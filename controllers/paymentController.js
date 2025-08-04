// Backend for Helix/controllers/paymentController.js
const nodemailer = require("nodemailer");
const Registration = require("../models/Registration");
const paypal = require('@paypal/checkout-server-sdk'); // PayPal SDK
const pricing = require('../models/Pricing'); // Import pricing model

// --- Initialize Nodemailer Transporter ONCE ---
// This transporter is defined globally to avoid recreating it on every request.
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT), // Port should be a number
    secure: process.env.EMAIL_SECURE === 'true', // Convert string to boolean
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// --- Configure PayPal Environment ONCE ---
// Use Sandbox for development/testing, Live for production
const environment = process.env.NODE_ENV === 'production'
    ? new paypal.core.LiveEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET)
    : new paypal.core.SandboxEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET);
const paypalClient = new paypal.core.PayPalHttpClient(environment);


// Helper function to get price based on plan, type, and category
function getPlanPrice(type, category, planName) {
    // --- NEW: Detailed Logging for Pricing Lookup ---
    console.log(`DEBUG: getPlanPrice called with -> Type: '${type}', Category: '${category}', Plan: '${planName}'`);
    console.log(`DEBUG: typeof type: ${typeof type}, typeof category: ${typeof category}, typeof planName: ${typeof planName}`);

    // Check if pricing[type] exists
    if (!pricing[type]) {
        console.warn(`DEBUG: pricing['${type}'] does NOT exist. Available types: ${Object.keys(pricing).join(', ')}`);
        return "0.00";
    }
    console.log(`DEBUG: pricing['${type}'] exists.`);

    // Check if pricing[type][category] exists
    if (!pricing[type][category]) {
        console.warn(`DEBUG: pricing['${type}']['${category}'] does NOT exist. Available categories for '${type}': ${Object.keys(pricing[type]).join(', ')}`);
        return "0.00";
    }
    console.log(`DEBUG: pricing['${type}']['${category}'] exists.`);

    // Check if pricing[type][category][planName] exists
    if (!pricing[type][category][planName]) {
        console.warn(`DEBUG: pricing['${type}']['${category}']['${planName}'] does NOT exist. Available plans for '${type}' and '${category}': ${Object.keys(pricing[type][category]).join(', ')}`);
        return "0.00";
    }
    console.log(`DEBUG: Found price for '${planName}'.`);

    // If all checks pass, return the price
    return pricing[type][category][planName].toString(); // PayPal API expects amount as string
}

/**
 * initiatePayment:
 * 1. Receives full registration data from frontend along with sourceToken.
 * 2. Verifies sourceToken to get sourceSite ID.
 * 3. Looks up the price using the Pricing model.
 * 4. Saves initial registration data to MongoDB with 'pending_payment' status.
 * 5. Sends a pre-payment email notification to the admin.
 * 6. Creates a PayPal order using the PayPal SDK.
 * 7. Updates the MongoDB record with the PayPal Order ID.
 * 8. Responds to the frontend with the PayPal Order ID for button rendering.
 */
const initiatePayment = async (req, res) => {
    // This log should now show a parsed JSON object, not a buffer.
    console.log("Backend: Received request body for initiatePayment:", req.body);

    try {
        // Destructure all expected registration fields from the request body
        const {
            firstName, lastName, email, mobileNumber, address, state, country,
            university, affiliation, linkedin, twitter, abstractTitle, interest,
            abstractFile, demoFile, // These are currently just string paths, actual file upload handled separately
            plan, type, category, // These are crucial for pricing lookup
            sourceToken // This JWT comes from your 60 websites, passed through React app
        } = req.body;

        // The authMiddleware (applied to this route) should have verified the sourceToken
        // and attached its payload to req.sourceTokenPayload.
        const sourceSiteId = req.sourceTokenPayload ? req.sourceTokenPayload.sourceId : 'unknown_source';
        if (sourceSiteId === 'unknown_source') {
            console.error("❌ Source token payload missing or invalid. Check authMiddleware application.");
            // In a production scenario, you might want to return an error here
            // return res.status(401).json({ message: "Unauthorized source or missing token." });
        }

        // Validate plan, type, category, and get the amount from your pricing model
        const amount = getPlanPrice(type, category, plan);
        if (amount === "0.00") {
            return res.status(400).json({ message: "Invalid conference plan, type, or category selected. Please check pricing." });
        }

        // Create a new Registration entry. Status starts as 'pending_payment'.
        const newEntry = new Registration({
            firstName, lastName, email, mobileNumber, address, state, country,
            university, affiliation, linkedin, twitter, abstractTitle, interest,
            abstractFile, demoFile,
            plan, type, category,
            sourceSite: sourceSiteId, // Assign the verified source ID
            status: "pending_payment",
            registrationDate: new Date(),
        });

        // Save the initial user details to MongoDB. This generates an _id for the record.
        await newEntry.save();

        // --- Send Pre-Payment Email to Admin ---
        try {
            await transporter.sendMail({
                from: `"Helix Conferences" <${process.env.EMAIL_USER}>`,
                to: process.env.ADMIN_EMAIL,
                subject: `New Payment Initiated: ${firstName} ${lastName} for ${plan}`,
                text: `User ${email} from ${sourceSiteId} selected the ${plan} plan (${type} - ${category}) and initiated payment for $${amount}. Registration ID: ${newEntry._id}`,
                html: `
                    <h2>New Registration - Payment Initiated</h2>
                    <p><strong>User:</strong> ${firstName} ${lastName} (${email})</p>
                    <p><strong>Selected Plan:</strong> ${plan} (Type: ${type}, Category: ${category})</p>
                    <p><strong>Amount:</strong> <strong>$${amount} USD</strong></p>
                    <p><strong>Source Website:</strong> ${sourceSiteId}</p>
                    <p><strong>Temporary Registration ID:</strong> ${newEntry._id}</p>
                    <p><strong>Status:</strong> Pending Payment (Waiting for PayPal confirmation)</p>
                    <p><em>Full details are saved in MongoDB.</em></p>
                `
            });
            console.log(`Pre-payment email sent to admin for ${email}.`);
        } catch (emailError) {
            console.error("❌ Error sending pre-payment email:", emailError);
            // Log the error but don't stop the payment process
        }

        // --- Create PayPal Order ---
        const request = new paypal.orders.OrdersCreateRequest();
        request.prefer("return=representation"); // Get full representation of the order back
        request.requestBody({
            intent: "CAPTURE", // Funds are captured immediately upon buyer approval
            purchase_units: [{
                amount: {
                    currency_code: "USD", // Ensure this matches your pricing currency
                    value: amount, // Use the validated amount from pricing model
                },
                description: `Conference Registration - ${plan} for ${email}`,
                custom_id: newEntry._id.toString(), // Important: Link PayPal order to your MongoDB record
                soft_descriptor: "HELIXCONFREG", // Appears on buyer's credit card statement
            }],
            application_context: {
                return_url: `${process.env.FRONTEND_URL}/paypal-success`, // Redirects after successful payment
                cancel_url: `${process.env.FRONTEND_URL}/paypal-cancel`,   // Redirects if buyer cancels
                shipping_preference: "NO_SHIPPING", // No shipping address needed for digital service
                user_action: "PAY_NOW", // Changes button text from "Continue" to "Pay Now"
            }
        });

        const order = await paypalClient.execute(request);
        
        // Update the Registration record with PayPal's Order ID
        newEntry.paypalOrderId = order.result.id;
        await newEntry.save();

        // Respond to the frontend with the PayPal Order ID
        res.status(200).json({
            message: "Payment initiated successfully, proceed to PayPal.",
            orderID: order.result.id, // Frontend uses this to render PayPal button
        });

    } catch (error) {
        console.error("❌ Payment initiation failed:", error);
        // More specific error handling could differentiate between PayPal API errors and DB errors
        res.status(500).json({ message: "Failed to initiate payment. Please try again.", error: error.message });
    }
};

/**
 * confirmPayment (PayPal Webhook Listener):
 * This endpoint is hit by PayPal when a payment event occurs (e.g., CHECKOUT.ORDER.COMPLETED).
 * 1. IMPORTANT: Verifies the authenticity of the PayPal webhook request (signature validation).
 * 2. Parses the webhook event payload.
 * 3. Finds the corresponding registration record using the PayPal Order ID.
 * 4. Updates the registration status to 'paid', stores payment details and capture ID.
 * 5. Sends a post-payment email notification to the admin.
 * 6. Emits a Socket.IO event to all connected clients for real-time updates.
 * 7. Responds with 200 OK to PayPal to acknowledge receipt of the webhook.
 */
const confirmPayment = async (req, res) => {
    // --- IMPORTANT: PayPal Webhook Signature Verification ---
    // This is CRITICAL for security to ensure the request truly comes from PayPal.
    // It uses the raw request body, which is why `express.raw()` middleware is needed.
    const WEBHOOK_ID = process.env.PAYPAL_WEBHOOK_ID;
    const WEBHOOK_SECRET = process.env.PAYPAL_WEBHOOK_SECRET; // This might not be needed for SDK verify but good to have

    // Extract headers for verification
    const paypalTransmissionId = req.headers['paypal-transmission-id'];
    const paypalTransmissionTime = req.headers['paypal-transmission-time'];
    const paypalCertUrl = req.headers['paypal-cert-url'];
    const paypalAuthAlgo = req.headers['paypal-auth-algo'];
    const paypalHmac = req.headers['paypal-transmission-sig'];

    if (!paypalTransmissionId || !paypalTransmissionTime || !paypalCertUrl || !paypalAuthAlgo || !paypalHmac) {
        console.error("❌ PayPal Webhook Error: Missing required headers for signature verification.");
        return res.status(400).send("Missing PayPal webhook headers.");
    }

    try {
        // The raw body is needed for signature verification
        // Ensure `express.raw({type: 'application/json'})` is used in server.js before `express.json()`
        const requestBodyString = req.body.toString(); 
        const webhookEvent = JSON.parse(requestBodyString); // Parse it AFTER getting the raw string

        // Verify the webhook signature using PayPal's SDK utility
        // This SDK method takes care of fetching certs, hashing, etc.
        const isValid = await paypal.notification.WebhookEvent.verify({
            auth_algo: paypalAuthAlgo,
            cert_url: paypalCertUrl,
            transmission_id: paypalTransmissionId,
            transmission_time: paypalTransmissionTime,
            transmission_sig: paypalHmac,
            webhook_id: WEBHOOK_ID,
            // For older SDK versions or complex setups, you might need to compute crc32
            // crc32: paypal.notification.WebhookEvent.getCrc32(requestBodyString) 
        }, requestBodyString);

        if (!isValid) {
            console.error("❌ PayPal Webhook Error: Invalid signature. Request is not from PayPal.");
            return res.status(403).send("Invalid webhook signature.");
        }
        console.log("✅ PayPal Webhook signature verified successfully.");


        // Process only CHECKOUT.ORDER.COMPLETED events
        if (webhookEvent.event_type !== 'CHECKOUT.ORDER.COMPLETED') {
            console.log(`Received PayPal webhook event type: ${webhookEvent.event_type}. Not processing as it's not a completion event.`);
            // Always respond with 200 OK to PayPal for events you don't process to avoid retries
            return res.status(200).send(`Event type ${webhookEvent.event_type} not handled by this endpoint.`);
        }

        const paypalOrderId = webhookEvent.resource.id;
        // Extract the capture ID from the completed order details
        const captureId = webhookEvent.resource.purchase_units[0].payments.captures[0].id;
        const paymentAmount = webhookEvent.resource.purchase_units[0].payments.captures[0].amount.value;
        const paymentCurrency = webhookEvent.resource.purchase_units[0].payments.captures[0].amount.currency_code;

        // Find the registration record using the PayPal Order ID and update its status
        const registration = await Registration.findOneAndUpdate(
            { paypalOrderId: paypalOrderId, status: 'pending_payment' }, // Find by PayPal Order ID and ensure it's still pending
            {
                $set: {
                    status: "paid",
                    paypalCaptureId: captureId,
                    paymentDetails: webhookEvent.resource, // Store the full webhook payload for auditing
                    paymentDate: new Date(),
                },
            },
            { new: true } // Return the updated document
        );

        if (!registration) {
            console.error(`❌ Registration not found or already processed for PayPal Order ID: ${paypalOrderId}`);
            // Respond 200 to PayPal to prevent retries, even if our internal update fails or is redundant
            return res.status(200).send("Registration not found or already processed for this webhook.");
        }

        // --- Send Post-Payment Email to Admin ---
        try {
            await transporter.sendMail({
                from: `"Helix Conferences" <${process.env.EMAIL_USER}>`,
                to: process.env.ADMIN_EMAIL,
                subject: `🚀 Payment Confirmed: ${registration.firstName} ${registration.lastName} for ${registration.plan}`,
                html: `
                    <h2>Payment Confirmed! New Registration Completed!</h2>
                    <p><strong>Name:</strong> ${registration.firstName} ${registration.lastName}</p>
                    <p><strong>Email:</strong> ${registration.email}</p>
                    <p><strong>Plan:</strong> ${registration.plan} (Type: ${registration.type}, Category: ${registration.category})</p>
                    <p><strong>Amount Paid:</strong> <strong>$${paymentAmount} ${paymentCurrency}</strong></p>
                    <p><strong>Source Website:</strong> ${registration.sourceSite}</p>
                    <p><strong>PayPal Order ID:</strong> ${paypalOrderId}</p>
                    <p><strong>PayPal Capture ID:</strong> ${captureId}</p>
                    <p><strong>Your Registration ID:</strong> ${registration._id}</p>
                    <p><strong>Status:</strong> PAID</p>
                    <p><em>Full payment details available in MongoDB.</em></p>
                `,
            });
            console.log(`Post-payment confirmation email sent to admin for ${registration.email}.`);
        } catch (emailError) {
            console.error("❌ Error sending post-payment confirmation email:", emailError);
        }

        // --- Emit WebSocket Broadcast for Real-time Updates ---
        if (global.io) { // `global.io` is set in server.js
            global.io.emit('new_registration', {
                message: 'A new conference registration has been completed!',
                name: `${registration.firstName} ${registration.lastName}`,
                email: registration.email,
                plan: registration.plan,
                sourceSite: registration.sourceSite,
                timestamp: new Date().toISOString(),
            });
            console.log(`✅ Emitted Socket.IO event 'new_registration' for ${registration.email}`);
        } else {
            console.warn("Socket.IO not initialized or accessible. Real-time update for new registration skipped.");
        }

        // Always respond with 200 OK to PayPal webhooks to acknowledge receipt and prevent retries
        res.status(200).send("Webhook received and processed.");

    } catch (error) {
        console.error("❌ PayPal Webhook processing failed:", error);
        // Log the full error for debugging.
        // DO NOT send sensitive error details back to PayPal.
        res.status(500).send("Error processing webhook.");
    }
};

module.exports = {
    initiatePayment,
    confirmPayment,
};
