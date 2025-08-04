// Backend for Helix/routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authMiddleware = require('../middlewares/authMiddleware'); // Your custom auth middleware

// Middleware to parse raw JSON body specifically for the PayPal webhook.
// This is needed because PayPal's webhook verification requires the raw body string.
// It should ONLY be applied to this specific route.
const rawBodyParser = express.raw({ type: 'application/json', limit: '50mb' });

// Route to initiate a payment (e.g., when a user submits the registration form)
// This route requires authentication via source token.
router.post('/initiate', authMiddleware, paymentController.initiatePayment);

// Route for PayPal webhooks to confirm payments.
// This route requires the raw body parser for signature verification.
// IMPORTANT: This route MUST match the URL you configured in your PayPal Developer Dashboard for webhooks.
router.post('/paypal-webhook', rawBodyParser, paymentController.confirmPayment);

module.exports = router;
