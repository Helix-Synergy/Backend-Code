const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/chatbotController');

router.post('/', chatbotController.handleChat);
router.post('/user', chatbotController.saveUser);
router.get('/users', chatbotController.getUsers);

module.exports = router;
