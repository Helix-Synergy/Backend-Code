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
            plan: orderDetails[0].name,
            type: "hybrid", // Defaulting as placeholder, adapt if provided in body
            category: "academic", // Defaulting as placeholder
            sourceSite: sourceSiteId,
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

        let paymentMethod = 'Unknown';
        try {
            const paymentDetails = await razorpay.payments.fetch(razorpay_payment_id);
            paymentMethod = paymentDetails.method; // "upi", "card", "netbanking", etc.
        } catch (err) {
            console.error("❌ Failed to fetch payment method from Razorpay:", err);
        }

        const registration = await Registration.findOneAndUpdate(
            { _id: registrationId, status: 'pending_payment' },
            {
                $set: {
                    status: "paid",
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
            console.error(`❌ Registration not found or already processed for Order ID: ${razorpay_order_id}`);
            return res.status(400).json({ message: "Registration not found or already processed." });
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

        res.status(200).json({ success: true, message: "Payment verified successfully" });
    } catch (error) {
        console.error("❌ Error verifying payment:", error);
        res.status(500).json({ message: "Payment verification failed", error: error.message });
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
    downloadReceipt
};
