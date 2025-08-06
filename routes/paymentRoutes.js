// Backend for Helix/routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authMiddleware = require('../middlewares/authMiddleware'); // Your custom auth middleware

// Route to initiate a payment (e.g., when a user submits the registration form)
// This route requires authentication via source token.
router.post('/initiate', authMiddleware, paymentController.initiatePayment);

// Route for Stripe webhooks to confirm payments.
// IMPORTANT: This route MUST match the URL you configured in your Stripe Developer Dashboard for webhooks.
// The raw body parser for this route is now handled directly in server.js for clarity and proper ordering.
router.post('/stripe-webhook', paymentController.confirmPayment);

module.exports = router;