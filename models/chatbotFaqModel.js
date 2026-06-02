const mongoose = require('mongoose');

const chatbotFaqSchema = new mongoose.Schema({
  keywords: [{ type: String, required: true }],
  response: { type: String, required: true },
  buttonText: { type: String },
  link: { type: String }
});

// Seed data or default data could be added manually, but we define the schema here.
module.exports = mongoose.model('ChatbotFaq', chatbotFaqSchema);
