// Backend for Helix/controllers/stripePaymentController.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Registration = require("../models/Registration");
const nodemailer = require("nodemailer");
const pricing = require('../models/Pricing'); // Import pricing model

// Helper function to get price from your pricing model
// This is the SAME function you have in paymentController.js
function getPlanPrice(type, category, planName) {
    console.log(`DEBUG: getPlanPrice called with -> Type: '${type}', Category: '${category}', Plan: '${planName}'`);
    if (!pricing[type] || !pricing[type][category] || !pricing[type][category][planName]) {
        console.warn(`DEBUG: Could not find price for '${type}', '${category}', '${planName}'.`);
        return null;
    }
    // Stripe expects amount in the smallest currency unit (e.g., paisa for INR, cents for USD)
    // Your pricing model seems to have values like "50.00", so we need to multiply by 100 and convert to integer
    const priceInSmallestUnit = Math.round(parseFloat(pricing[type][category][planName]) * 100);
    console.log(`DEBUG: Found price: ${priceInSmallestUnit} (in smallest unit).`);
    return priceInSmallestUnit;
}

// --- Initialize Nodemailer Transporter ONCE ---
// This is the SAME transporter setup you have in paymentController.js
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

/**
 * createCheckoutSession:
 * This function is the Stripe equivalent of your `initiatePayment` function.
 * 1. Receives registration data from frontend.
 * 2. Gets the price from your pricing model.
 * 3. Saves initial registration data to MongoDB with 'pending_payment' status.
 * 4. Creates a Stripe Checkout Session using the Stripe SDK.
 * 5. Updates the MongoDB record with the Stripe Session ID.
 * 6. Responds to the frontend with the Stripe Session ID.
 */
const createCheckoutSession = async (req, res) => {
    console.log("Backend: Received request body for Stripe Checkout:", req.body);
    
    try {
        const {
            firstName, lastName, email, mobileNumber, address, state, country,
            university, affiliation, linkedin, twitter, abstractTitle, interest,
            abstractFile, demoFile,
            plan, type, category,
            sourceToken
        } = req.body;

        const sourceSiteId = req.sourceTokenPayload ? req.sourceTokenPayload.sourceId : 'unknown_source';

        // Get the amount from your pricing model, in smallest currency unit for Stripe
        const amount = getPlanPrice(type, category, plan);
        if (amount === null) {
            return res.status(400).json({ message: "Invalid conference plan, type, or category selected. Please check pricing." });
        }
        
        // Use the same MongoDB logic to save a new record
        const newEntry = new Registration({
            firstName, lastName, email, mobileNumber, address, state, country,
            university, affiliation, linkedin, twitter, abstractTitle, interest,
            abstractFile, demoFile,
            plan, type, category,
            sourceSite: sourceSiteId,
            status: "pending_payment",
            registrationDate: new Date(),
        });
        await newEntry.save();
        
        // --- Send Pre-Payment Email to Admin (Stripe version) ---
        // You can reuse your email logic here with a slight modification
        // to mention 'Stripe' instead of 'PayPal'.
        try {
            await transporter.sendMail({
                from: `"Helix Conferences" <${process.env.EMAIL_USER}>`,
                to: process.env.ADMIN_EMAIL,
                subject: `New Stripe Payment Initiated: ${firstName} ${lastName}`,
                html: `
                    <h2>New Registration - Stripe Payment Initiated</h2>
                    <p><strong>User:</strong> ${firstName} ${lastName} (${email})</p>
                    <p><strong>Selected Plan:</strong> ${plan} (Type: ${type}, Category: ${category})</p>
                    <p><strong>Status:</strong> Pending Payment (Waiting for Stripe confirmation)</p>
                    <p><strong>Temporary Registration ID:</strong> ${newEntry._id}</p>
                `
            });
            console.log(`Pre-payment email sent to admin for ${email} (Stripe).`);
        } catch (emailError) {
            console.error("❌ Error sending pre-payment email:", emailError);
        }

        // --- Create a Stripe Checkout Session (the core difference) ---
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'inr', // Or 'usd', 'eur', etc.
                    product_data: {
                        name: `Conference Registration - ${plan}`,
                        description: `Payment for ${email}`,
                    },
                    unit_amount: amount, // Amount in paisa/cents
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/stripe-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/stripe-cancel`,
            client_reference_id: newEntry._id.toString(), // Important: Link Stripe session to your MongoDB record
            customer_email: email, // Pre-fill the email address
        });
        
        // Update the Registration record with Stripe's Session ID
        // Note: You might need to add a 'stripeSessionId' field to your Registration model
        newEntry.stripeSessionId = session.id;
        await newEntry.save();

        // Respond to the frontend with the session ID
        res.status(200).json({ sessionId: session.id });

    } catch (error) {
        console.error("❌ Stripe payment initiation failed:", error);
        res.status(500).json({ message: "Failed to initiate Stripe payment. Please try again.", error: error.message });
    }
};

/**
 * handleStripeWebhook:
 * This function is the Stripe equivalent of your `confirmPayment` function.
 * It processes webhooks sent from Stripe to confirm a successful payment.
 */
const handleStripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const rawBody = req.body; // Assuming your middleware correctly passes the raw body

    let event;

    try {
        event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error(`❌ Stripe Webhook signature verification failed:`, err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        console.log('✅ Stripe checkout session completed!', session.id);

        // Find the registration using the client_reference_id
        const registrationId = session.client_reference_id;
        
        const registration = await Registration.findOneAndUpdate(
            { _id: registrationId, status: 'pending_payment' },
            {
                $set: {
                    status: "paid",
                    paymentDetails: {
                        paymentGateway: "Stripe",
                        stripeSessionId: session.id,
                        amountTotal: session.amount_total / 100, // Convert back to major currency unit
                        currency: session.currency,
                        paymentIntentId: session.payment_intent,
                        // Store other details as needed
                    },
                    paymentDate: new Date(),
                },
            },
            { new: true }
        );

        if (!registration) {
            console.error(`❌ Registration not found or already processed for Stripe Session ID: ${session.id}`);
            return res.status(200).send("Registration not found or already processed.");
        }
        
        // --- Send Post-Payment Email to Admin (Stripe version) ---
        // Reuse your email logic here
        try {
            await transporter.sendMail({
                from: `"Helix Conferences" <${process.env.EMAIL_USER}>`,
                to: process.env.ADMIN_EMAIL,
                subject: `🚀 Stripe Payment Confirmed: ${registration.firstName} ${registration.lastName}`,
                html: `
                    <h2>Stripe Payment Confirmed! New Registration Completed!</h2>
                    <p><strong>Name:</strong> ${registration.firstName} ${registration.lastName}</p>
                    <p><strong>Email:</strong> ${registration.email}</p>
                    <p><strong>Amount Paid:</strong> ${session.amount_total / 100} ${session.currency.toUpperCase()}</p>
                    <p><strong>Registration ID:</strong> ${registration._id}</p>
                `,
            });
            console.log(`Post-payment confirmation email sent to admin for ${registration.email} (Stripe).`);
        } catch (emailError) {
            console.error("❌ Error sending post-payment confirmation email:", emailError);
        }

        // --- Emit WebSocket Broadcast for Real-time Updates ---
        // Reuse your Socket.IO logic here
        if (global.io) {
            global.io.emit('new_registration', {
                message: 'A new conference registration has been completed!',
                name: `${registration.firstName} ${registration.lastName}`,
                email: registration.email,
                plan: registration.plan,
                sourceSite: registration.sourceSite,
                timestamp: new Date().toISOString(),
            });
            console.log(`✅ Emitted Socket.IO event 'new_registration' for ${registration.email} (Stripe)`);
        }

    } else {
        console.log(`Received Stripe webhook event type: ${event.type}. Not processing.`);
    }

    res.status(200).json({ received: true });
};

module.exports = {
    createCheckoutSession,
    handleStripeWebhook
};