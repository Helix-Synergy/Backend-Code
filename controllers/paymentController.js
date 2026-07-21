const nodemailer = require("nodemailer");
const Registration = require("../models/Registration");
const pricing = require('../models/Pricing');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { generateReceipt } = require('../utils/pdfGenerator');

// --- Initialize Nodemailer Transporter ONCE ---
const transporter = nodemailer.createTransport({
    host: 'smtp.resend.com',
    port: 465,
    secure: true,
    auth: {
        user: 'resend',
        pass: process.env.RESEND_API_KEY,
    },
});

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/**
 * initiatePayment:
 * Creates a Razorpay order and returns its details to the frontend.
 */
const initiatePayment = async (req, res) => {
    console.log("Backend: Received request body for initiatePayment:", req.body);

    try {
        const sourceData = req.sourceTokenPayload || {};
        const { orderDetails, participantInfo, conferenceId, conferenceName, totalAmount } = req.body;

        if (!orderDetails || !Array.isArray(orderDetails) || orderDetails.length === 0) {
            return res.status(400).json({ message: "Invalid order details" });
        }

        // Determine sourceSite from payload or use a default if bypass/direct
        const sourceSiteId = sourceData.sourceId || conferenceId || 'unknown_source';

        // Calculate total amount in smallest currency unit (paise for INR, cents for USD)
        // Note: You can switch to INR if required by Razorpay account config
        const amount = Math.round(totalAmount * 100); 
        const currency = "USD"; // USD transactions do not support UPI/QR in Razorpay

        // Create initial registration record
        const newRegistration = new Registration({
            firstName: participantInfo.fullName.split(' ')[0] || '',
            lastName: participantInfo.fullName.split(' ').slice(1).join(' ') || '',
            email: participantInfo.email,
            mobileNumber: participantInfo.mobileNum,
            address: participantInfo.billingAddress,
            city: participantInfo.city,
            country: participantInfo.country,
            university: participantInfo.university,
            affiliation: participantInfo.affiliation,
            plan: orderDetails.map(item => item.name).join(' + '),
            orderDetails: orderDetails,
            type: "hybrid", // Defaulting as placeholder, adapt if provided in body
            category: "academic", // Defaulting as placeholder
            sourceSite: sourceSiteId,
            conferenceName: conferenceName,
            conferenceDate: req.body.conferenceDate,
            status: "pending_payment",
            registrationDate: new Date(),
        });

        await newRegistration.save();

        const options = {
            amount: amount,
            currency: currency,
            receipt: newRegistration._id.toString(),
            payment_capture: 1 // Auto capture
        };

        const order = await razorpay.orders.create(options);

        // Save razorpay order ID and amount to registration for receipt generation later
        newRegistration.paymentDetails = { 
            razorpayOrderId: order.id,
            amountTotal: totalAmount, // Save totalAmount for receipt
            currency: currency
        };
        await newRegistration.save();

        res.status(200).json({ 
            orderId: order.id, 
            amount: amount, 
            currency: currency,
            registrationId: newRegistration._id 
        });

    } catch (error) {
        console.error("❌ Razorpay payment initiation failed:", error);
        res.status(500).json({ message: "Failed to initiate payment", error: error.message });
    }
};

/**
 * fulfillPayment:
 * Core fulfillment logic (updates DB, generates invoice, sends emails/PDF, emits socket).
 * Returns the updated registration doc or null if already processed.
 */
const fulfillPayment = async (registrationId, razorpay_order_id, razorpay_payment_id, razorpay_signature) => {
    let paymentMethod = 'Unknown';
    try {
        const paymentDetails = await razorpay.payments.fetch(razorpay_payment_id);
        paymentMethod = paymentDetails.method; // "upi", "card", "netbanking", etc.
    } catch (err) {
        console.error("❌ Failed to fetch payment method from Razorpay:", err);
    }

    const currentYear = new Date().getFullYear();
    const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, '0');
    const invoicePrefix = `HEX-${currentYear}-${currentMonth}-`;

    // Find highest invoice number for this month
    const lastReg = await Registration.findOne({ invoiceNumber: new RegExp(`^${invoicePrefix}`) })
        .sort({ invoiceNumber: -1 })
        .exec();

    let nextSlno = 1;
    if (lastReg && lastReg.invoiceNumber) {
        const lastSlno = parseInt(lastReg.invoiceNumber.split('-').pop(), 10);
        if (!isNaN(lastSlno)) {
            nextSlno = lastSlno + 1;
        }
    }
    const invoiceNumber = `${invoicePrefix}${nextSlno.toString().padStart(3, '0')}`;

    const registration = await Registration.findOneAndUpdate(
        { _id: registrationId, status: 'pending_payment' },
        {
            $set: {
                status: "paid",
                invoiceNumber: invoiceNumber,
                "paymentDetails.paymentGateway": "Razorpay",
                "paymentDetails.method": paymentMethod,
                "paymentDetails.razorpayOrderId": razorpay_order_id,
                "paymentDetails.razorpayPaymentId": razorpay_payment_id,
                "paymentDetails.razorpaySignature": razorpay_signature,
                paymentDate: new Date(),
            },
        },
        { new: true }
    );

    if (!registration) {
        return null; // Already processed or not found
    }

    // --- Send Post-Payment Email to Admin ---
    try {
        await transporter.sendMail({
            from: `"Helix Conferences" <${process.env.ADMIN_EMAIL}>`,
            to: process.env.ADMIN_EMAIL,
            subject: `🚀 Razorpay Payment Confirmed: ${registration.firstName} ${registration.lastName}`,
            html: `
                <h2>Razorpay Payment Confirmed! New Registration Completed!</h2>
                <p><strong>Name:</strong> ${registration.firstName} ${registration.lastName}</p>
                <p><strong>Email:</strong> ${registration.email}</p>
                <p><strong>Registration ID:</strong> ${registration._id}</p>
                <p><strong>Razorpay Payment ID:</strong> ${razorpay_payment_id}</p>
            `,
        });
        console.log(`Post-payment confirmation email sent to admin for ${registration.email} via Razorpay.`);
    } catch (emailError) {
        console.error("❌ Error sending post-payment confirmation email to admin:", emailError);
    }

    // --- Generate PDF Receipt and Email to Participant ---
    try {
        const pdfBuffer = await generateReceipt(registration);
        
        await transporter.sendMail({
            from: `"Helix Conferences" <${process.env.ADMIN_EMAIL}>`,
            to: registration.email,
            subject: `Payment Receipt - Helix Conferences`,
            html: `
                <h2>Thank you for your registration!</h2>
                <p>Dear ${registration.firstName},</p>
                <p>Your payment for <strong>${registration.plan}</strong> has been successfully processed.</p>
                <p>Please find attached your payment receipt.</p>
                <br>
                <p>Best Regards,</p>
                <p>Helix Conferences Team</p>
            `,
            attachments: [
                {
                    filename: `Receipt_${registration._id}.pdf`,
                    content: pdfBuffer,
                    contentType: 'application/pdf'
                }
            ]
        });
        console.log(`Receipt email sent to participant ${registration.email}.`);
    } catch (emailError) {
        console.error("❌ Error sending receipt email to participant:", emailError);
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
        console.log(`✅ Emitted Socket.IO event 'new_registration' for ${registration.email} (Razorpay)`);
    }

    return registration;
};

/**
 * verifyPayment:
 * Verifies the Razorpay signature sent by the frontend after successful checkout.
 */
const verifyPayment = async (req, res) => {
    try {
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature, registrationId } = req.body;

        const generatedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest('hex');

        if (generatedSignature !== razorpay_signature) {
            console.error("❌ Invalid Razorpay signature");
            return res.status(400).json({ message: "Invalid payment signature" });
        }

        const registration = await fulfillPayment(registrationId, razorpay_order_id, razorpay_payment_id, razorpay_signature);
        if (!registration) {
            console.error(`✅ Registration already processed for Order ID: ${razorpay_order_id} (likely by webhook)`);
            return res.status(200).json({ success: true, message: "Payment already processed." });
        }

        res.status(200).json({ success: true, message: "Payment verified successfully" });
    } catch (error) {
        console.error("❌ Error verifying payment:", error);
        res.status(500).json({ message: "Payment verification failed", error: error.message });
    }
};

/**
 * razorpayWebhook:
 * Listens for background events from Razorpay (e.g. payment.captured) to ensure fulfillment
 * happens even if the user drops off the frontend.
 */
const razorpayWebhook = async (req, res) => {
    try {
        const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
        if (!webhookSecret) {
            console.error("❌ RAZORPAY_WEBHOOK_SECRET not set in environment.");
            return res.status(500).send("Webhook secret not configured.");
        }

        const signature = req.headers['x-razorpay-signature'];
        
        // Since express.json() is configured globally before this route, req.body is already an object.
        const bodyStr = JSON.stringify(req.body);

        const expectedSignature = crypto.createHmac('sha256', webhookSecret)
            .update(bodyStr)
            .digest('hex');

        // Prevent timing attacks using crypto.timingSafeEqual
        const isSignatureValid = crypto.timingSafeEqual(
            Buffer.from(expectedSignature),
            Buffer.from(signature)
        );

        if (!isSignatureValid) {
            console.error("❌ Invalid Razorpay webhook signature");
            return res.status(400).send("Invalid signature");
        }

        const event = req.body;

        if (event.event === 'payment.captured' || event.event === 'order.paid') {
            const paymentEntity = event.payload.payment.entity;
            const razorpay_order_id = paymentEntity.order_id;
            const razorpay_payment_id = paymentEntity.id;
            
            const registrationDoc = await Registration.findOne({ "paymentDetails.razorpayOrderId": razorpay_order_id });
            
            if (registrationDoc) {
                if (registrationDoc.status === 'pending_payment') {
                    console.log(`Webhook: fulfilling payment for order ${razorpay_order_id}`);
                    await fulfillPayment(registrationDoc._id, razorpay_order_id, razorpay_payment_id, "webhook_signature_verified");
                } else {
                    console.log(`Webhook: order ${razorpay_order_id} already processed.`);
                }
            }
        }

        res.status(200).send("Webhook received");
    } catch (error) {
        console.error("❌ Error processing webhook:", error);
        res.status(500).send("Webhook processing failed");
    }
};

/**
 * downloadReceipt:
 * Generates and streams the PDF receipt on demand for a given registration.
 */
const downloadReceipt = async (req, res) => {
    try {
        const { registrationId } = req.params;
        const registration = await Registration.findById(registrationId);
        
        if (!registration) {
            return res.status(404).json({ message: "Registration not found" });
        }
        
        if (registration.status !== 'paid') {
            return res.status(400).json({ message: "Cannot generate receipt for unpaid registration" });
        }

        const pdfBuffer = await generateReceipt(registration);
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=Receipt_${registrationId}.pdf`);
        res.setHeader('Content-Length', pdfBuffer.length);
        
        res.status(200).end(pdfBuffer);
    } catch (error) {
        console.error("❌ Error downloading receipt:", error);
        res.status(500).json({ message: "Failed to download receipt", error: error.message });
    }
};

module.exports = {
    initiatePayment,
    verifyPayment,
    razorpayWebhook,
    downloadReceipt
};
