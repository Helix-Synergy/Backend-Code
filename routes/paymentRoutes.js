const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authMiddleware = require('../middlewares/authMiddleware'); // Your custom auth middleware

// Route to initiate a payment
router.post('/initiate', authMiddleware, paymentController.initiatePayment);

// Route to verify the Razorpay signature after checkout
router.post('/verify', paymentController.verifyPayment);

// Route for Razorpay Webhooks (background fulfillment)
router.post('/webhook', express.raw({ type: 'application/json' }), paymentController.razorpayWebhook);

// Route to download the PDF receipt
router.get('/receipt/:registrationId', paymentController.downloadReceipt);

module.exports = router;