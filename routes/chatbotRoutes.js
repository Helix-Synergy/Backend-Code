const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/chatbotController');
const rateLimit = require('express-rate-limit');

// Set up rate limiting: maximum of 5 requests per minute per IP
const chatbotLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // Limit each IP to 5 requests per minute
  message: { error: "Too many requests, please try again later." },
  standardHeaders: true, 
  legacyHeaders: false,
});

router.post('/', chatbotLimiter, chatbotController.handleChat);
router.post('/user', chatbotController.saveUser);
router.get('/users', chatbotController.getUsers);

module.exports = router;
