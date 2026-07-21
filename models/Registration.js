// Backend for Helix/models/Registration.js
const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
    firstName: { type: String, trim: true, required: true },
    lastName: { type: String, trim: true, required: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    mobileNumber: { type: String, trim: true },
    address: { type: String, trim: true },
    state: { type: String, trim: true },
    country: { type: String, trim: true },
    university: { type: String, trim: true },
    affiliation: { type: String, trim: true },
    linkedin: { type: String, trim: true },
    twitter: { type: String, trim: true },
    abstractTitle: { type: String, trim: true },
    interest: { type: String, trim: true },
    abstractFile: { type: String }, // Path to stored file (if using file uploads, currently just a string)
    demoFile: { type: String },     // Path to stored file (if using file uploads, currently just a string)

    // Conference specific details for pricing and type
    plan: { type: String, required: true }, // e.g., "e-Poster", "Oral Presentation"
    orderDetails: { type: Array, default: [] }, // Array of objects with name, price, quantity
    type: { type: String, enum: ['hybrid', 'webinar'], required: true }, // e.g., "hybrid", "webinar"
    category: { type: String, enum: ['academic', 'business'], required: true }, // e.g., "academic", "business"
    
    sourceSite: { type: String, required: true }, // The ID obtained from the verified sourceToken
    conferenceName: { type: String }, // Store the actual name for receipts
    conferenceDate: { type: String }, // Store the actual date for receipts
    
    // Payment-related fields
    invoiceNumber: { type: String }, // e.g., HEX-2026-07-001
    status: {
        type: String,
        enum: ['pending_payment', 'paid', 'failed', 'refunded'],
        default: 'pending_payment',
        required: true
    },
    paypalOrderId: { type: String },    // PayPal's Order ID, saved after order creation in initiatePayment
    paypalCaptureId: { type: String },  // PayPal's Capture ID, saved after successful payment execution from webhook
    paymentDetails: { type: Object },   // Full details from PayPal webhook payload (for auditing)
    
    registrationDate: { type: Date, default: Date.now }, // Timestamp of initial registration entry
    paymentDate: { type: Date }, // Date when payment was successfully confirmed via webhook
});

module.exports = mongoose.model('Registration', registrationSchema);