const { GoogleGenerativeAI } = require('@google/generative-ai');
const ChatbotFaq = require('../models/chatbotFaqModel');
const ChatLog = require('../models/chatbotLogModel');
const ChatbotUser = require('../models/chatbotUserModel');

// Initialize Google Generative AI conditionally
let genAI;
try {
  if (process.env.GOOGLE_API_KEY) {
    genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
  }
} catch (error) {
  console.error("Google AI initialization error:", error.message);
}

const staticFaqs = [
  {
    keywords: ["register", "registration", "signup", "sign up"],
    response: "You can register through the Registration page.",
    buttonText: "Open Registration Page",
    link: "/buy-a-ticket"
  },
  {
    keywords: ["contact", "support", "help", "email"],
    response: "You can contact our support team through the Contact page.",
    buttonText: "Open Contact Page",
    link: "/contact"
  },
  {
    keywords: ["abstract", "submit", "paper"],
    response: "You can submit your abstract via the Call for Papers page.",
    buttonText: "Submit Abstract",
    link: "/call-for-papers"
  },
  {
    keywords: ["pricing", "cost", "fee", "price", "ticket"],
    response: "You can view ticket pricing and details on our Registration page.",
    buttonText: "View Tickets",
    link: "/buy-a-ticket"
  }
];

exports.handleChat = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required." });
    }

    const lowerMessage = message.toLowerCase();

    // 1. Check local static FAQs first
    let matchedFaq = staticFaqs.find(faq => 
      faq.keywords.some(kw => lowerMessage.includes(kw))
    );

    if (!matchedFaq) {
      // If DB is seeded, we could also check DB.
      const dbFaqs = await ChatbotFaq.find();
      matchedFaq = dbFaqs.find(faq => 
        faq.keywords.some(kw => lowerMessage.includes(kw.toLowerCase()))
      );
    }

    if (matchedFaq) {
      // Log interaction
      await ChatLog.create({ userMessage: message, botResponse: matchedFaq.response });
      return res.json({
        response: matchedFaq.response,
        buttonText: matchedFaq.buttonText,
        link: matchedFaq.link
      });
    }

    // 2. Fallback to Google Gemini if no keyword match
    if (!genAI) {
      const fallbackResponse = "I am currently unable to connect to the AI service, but I can help you with registration, abstract submission, pricing, or contacting us.";
      await ChatLog.create({ userMessage: message, botResponse: fallbackResponse });
      return res.json({ response: fallbackResponse });
    }

    const fs = require('fs');
    const path = require('path');
    let conferencesList = "Multiple conferences in Medical, Engineering, Agriculture, etc.";
    try {
      const confPath = path.join(__dirname, '..', 'conferences.txt');
      if (fs.existsSync(confPath)) {
        conferencesList = fs.readFileSync(confPath, 'utf8');
      }
    } catch (e) {
      console.error("Could not load conferences list:", e);
    }

    const systemPrompt = `You are a professional Assistant for Helix Conferences (https://helixconferences.com). 
Your job is to help users with conference information, answer FAQs, suggest relevant pages, and provide navigation guidance.
If a user asks about anything unrelated to Helix Conferences, events, or the site, politely decline.
When a user asks about a specific conference (e.g., Zero-Trust AI, Foodmeet), you MUST provide ALL the details you know about it from the list below, including its exact Date, Location, and exact Link. Provide a welcoming summary of the event using this data.

List of our conferences and subdomains:
${conferencesList}

Be helpful, engaging, and professional.`;

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      systemInstruction: systemPrompt 
    });

    const result = await model.generateContent(message);
    const aiResponse = result.response.text();

    // Log interaction
    await ChatLog.create({ userMessage: message, botResponse: aiResponse });

    res.json({
      response: aiResponse
    });

  } catch (error) {
    console.error("Chatbot Error:", error);
    res.status(500).json({ error: "Something went wrong. Please try again later." });
  }
};

exports.saveUser = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    if (!name || !email || !phone) {
      return res.status(400).json({ error: "Name, email, and phone are required." });
    }
    const newUser = await ChatbotUser.create({ name, email, phone });
    res.status(201).json({ message: "User saved successfully.", user: newUser });
  } catch (error) {
    console.error("Save User Error:", error);
    res.status(500).json({ error: "Failed to save user details." });
  }
};

