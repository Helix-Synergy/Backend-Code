// Backend for Helix/controllers/paymentController.js (Stripe Only)
const nodemailer = require("nodemailer");
const Registration = require("../models/Registration");
const pricing = require('../models/Pricing');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Stripe SDK

// --- Initialize Nodemailer Transporter ONCE ---
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Helper function to get price for Stripe (in cents/paise)
function getPlanPrice(type, category, planName) {
    console.log(`DEBUG: getPlanPrice called with -> Type: '${type}', Category: '${category}', Plan: '${planName}'`);
    if (!pricing[type] || !pricing[type][category] || !pricing[type][category][planName]) {
        console.warn(`DEBUG: pricing['${type}']['${category}']['${planName}'] does NOT exist.`);
        return null;
    }
    // Stripe expects amount in the smallest currency unit
    const price = Math.round(parseFloat(pricing[type][category][planName]) * 100);
    console.log(`DEBUG: Found price: ${price} (in smallest unit).`);
    return price;
}

/**
 * initiatePayment:
 * Creates a Stripe Checkout Session and returns its ID to the frontend.
 */
const initiatePayment = async (req, res) => {
    console.log("Backend: Received request body for initiatePayment:", req.body);

    try {
        const {
            firstName, lastName, email, mobileNumber, address, state, country,
            university, affiliation, linkedin, twitter, abstractTitle, interest,
            abstractFile, demoFile,
            plan, type, category,
            sourceToken
        } = req.body;

        const sourceSiteId = req.sourceTokenPayload ? req.sourceTokenPayload.sourceId : 'unknown_source';
        const amount = getPlanPrice(type, category, plan);
        
        if (amount === null) {
            return res.status(400).json({ message: "Invalid conference plan, type, or category selected." });
        }
        
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
        
        // --- Send Pre-Payment Email to Admin ---
        try {
            await transporter.sendMail({
                from: `"Helix Conferences" <${process.env.EMAIL_USER}>`,
                to: process.env.ADMIN_EMAIL,
                subject: `New Stripe Payment Initiated: ${firstName} ${lastName}`,
                html: `
                    <h2>New Registration - Payment Initiated</h2>
                    <p><strong>User:</strong> ${firstName} ${lastName} (${email})</p>
                    <p><strong>Selected Plan:</strong> ${plan} (Type: ${type}, Category: ${category})</p>
                    <p><strong>Amount:</strong> <strong>$${amount / 100} USD</strong></p>
                    <p><strong>Status:</strong> Pending Payment (Waiting for Stripe confirmation)</p>
                    <p><strong>Temporary Registration ID:</strong> ${newEntry._id}</p>
                `
            });
            console.log(`Pre-payment email sent to admin for ${email} via Stripe.`);
        } catch (emailError) {
            console.error("❌ Error sending pre-payment email:", emailError);
        }

        // --- Create a Stripe Checkout Session ---
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: { name: `Conference Registration - ${plan}` },
                    unit_amount: amount,
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/stripe-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/stripe-cancel`,
            client_reference_id: newEntry._id.toString(),
            customer_email: email,
        });
        
        // Update the Registration record with Stripe's Session ID
        newEntry.stripeSessionId = session.id;
        await newEntry.save();

        res.status(200).json({ sessionId: session.id });

    } catch (error) {
        console.error("❌ Stripe payment initiation failed:", error);
        res.status(500).json({ message: "Failed to initiate payment. Please try again.", error: error.message });
    }
};

/**
 * confirmPayment:
 * This is the Stripe Webhook listener.
 */
const confirmPayment = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const rawBody = req.body;

    let event;
    try {
        event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error(`❌ Stripe Webhook signature verification failed:`, err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        console.log('✅ Stripe checkout session completed!', session.id);

        const registrationId = session.client_reference_id;
        const registration = await Registration.findOneAndUpdate(
            { _id: registrationId, status: 'pending_payment' },
            {
                $set: {
                    status: "paid",
                    paymentDetails: {
                        paymentGateway: "Stripe",
                        stripeSessionId: session.id,
                        amountTotal: session.amount_total / 100,
                        currency: session.currency,
                        paymentIntentId: session.payment_intent,
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

        // --- Send Post-Payment Email to Admin ---
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
            console.log(`Post-payment confirmation email sent to admin for ${registration.email} via Stripe.`);
        } catch (emailError) {
            console.error("❌ Error sending post-payment confirmation email:", emailError);
        }

        // --- Emit WebSocket Broadcast for Real-time Updates ---
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
    initiatePayment,
    confirmPayment
};