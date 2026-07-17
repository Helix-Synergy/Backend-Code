const Bytez = require('bytez.js');
const ChatbotFaq = require('../models/chatbotFaqModel');
const ChatLog = require('../models/chatbotLogModel');
const ChatbotUser = require('../models/chatbotUserModel');
const NodeCache = require("node-cache");
const { Resend } = require('resend');

// Initialize cache with a Time-To-Live of 24 hours (86400 seconds)
const aiCache = new NodeCache({ stdTTL: 86400 });

// Initialize OTP cache with a TTL of 5 minutes (300 seconds)
const otpCache = new NodeCache({ stdTTL: 300 });

// Initialize Resend
const resendClient = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Initialize Bytez AI conditionally
let bytezClient;
try {
  if (process.env.BYTEZ_API_KEY) {
    bytezClient = new Bytez(process.env.BYTEZ_API_KEY);
  }
} catch (error) {
  console.error("Bytez AI initialization error:", error.message);
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
  },
  {
    keywords: ["upcoming conferences", "upcoming", "conferences", "events"],
    response: "You can explore all our upcoming conferences on the Conferences page.",
    buttonText: "View Conferences",
    link: "https://helixconferences.com/Conferences"
  },
  {
    keywords: ["brochure", "download", "download brochure"],
    response: "You can download the conference brochure directly from the specific conference's page."
  },
  {
    keywords: ["travel", "accommodation", "visa", "hotel", "stay"],
    response: "Visa documents will be supported, a complimentary accommodation will be provided for oral presenters."
  },
  {
    keywords: ["discount", "discounts", "offer", "concession", "pricing discount"],
    response: "For discounts on pricing, please contact us at +1-7036-516-096 or email us at hello@helixconferences.com."
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

    // 2. Fallback to Bytez AI if no keyword match
    if (!bytezClient) {
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
        conferencesList = await fs.promises.readFile(confPath, 'utf8');
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

    // 3. Check Cache before calling Bytez API
    const cacheKey = `bytez_${lowerMessage}`;
    const cachedResponse = aiCache.get(cacheKey);
    
    if (cachedResponse) {
      console.log("Serving chatbot response from cache.");
      await ChatLog.create({ userMessage: message, botResponse: cachedResponse });
      return res.json({ response: cachedResponse });
    }

    const model = bytezClient.model("mistralai/Mistral-7B-Instruct-v0.2");
    
    const input = [
      { "role": "system", "content": systemPrompt },
      { "role": "user", "content": message }
    ];

    const { error, output } = await model.run(input);
    
    if (error) {
      console.error("Bytez API run error:", error);
      throw new Error("Failed to generate content from Bytez API");
    }

    const aiResponse = output;

    // Save response to cache
    aiCache.set(cacheKey, aiResponse);

    // Log interaction
    await ChatLog.create({ userMessage: message, botResponse: aiResponse });

    res.json({
      response: aiResponse
    });

  } catch (error) {
    console.error("Chatbot Error:", error);
    
    // Graceful fallback for API errors
    if (error.status === 503 || (error.message && error.message.includes('503'))) {
      const fallbackResponse = "The AI service is currently experiencing high demand. I can still help you with registration, abstract submission, pricing, or contacting us.";
      return res.json({ response: fallbackResponse });
    }

    // Graceful fallback for Rate Limit (429) errors
    if (error.status === 429 || (error.message && error.message.includes('429'))) {
      const fallbackResponse = "I'm currently busy helping another user! Please wait a few seconds and try your message again.";
      return res.json({ response: fallbackResponse });
    }
    
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

exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required." });

    if (!resendClient) {
      console.error("Resend API key missing");
      return res.status(500).json({ error: "Email service is not configured." });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpCache.set(email, otp);

    const { data, error } = await resendClient.emails.send({
        from: 'Helix Conferences <info@helixconferences.com>',
        to: [email],
        subject: `Your Chatbot Verification Code`,
        html: `
            <div style="font-family: sans-serif; padding: 20px;">
                <h2 style="color: #004466;">Welcome to Helix Conferences!</h2>
                <p>Your verification code to start chatting is: <strong style="font-size: 24px; color: #0077aa;">${otp}</strong></p>
                <p>This code will expire in 5 minutes.</p>
            </div>
        `
    });

    if (error) {
      console.error("Resend API Error:", error);
      return res.status(500).json({ error: "Failed to send OTP email via Resend." });
    }

    res.status(200).json({ message: "OTP sent successfully." });
  } catch (error) {
    console.error("Send OTP Error:", error);
    res.status(500).json({ error: "Failed to send OTP email." });
  }
};

exports.verifyOtpAndSaveUser = async (req, res) => {
  try {
    const { name, email, phone, otp } = req.body;
    if (!name || !email || !phone || !otp) {
      return res.status(400).json({ error: "All fields and OTP are required." });
    }

    const cachedOtp = otpCache.get(email);
    if (!cachedOtp || cachedOtp !== otp) {
      return res.status(400).json({ error: "Invalid or expired verification code." });
    }

    otpCache.del(email); // OTP is valid, remove it from cache

    const newUser = await ChatbotUser.create({ name, email, phone });
    res.status(201).json({ message: "User verified and saved successfully.", user: newUser });
  } catch (error) {
    console.error("Verify OTP Error:", error);
    res.status(500).json({ error: "Failed to verify user." });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await ChatbotUser.find().sort({ createdAt: -1 });
    res.status(200).json({ data: users });
  } catch (error) {
    console.error("Fetch Users Error:", error);
    res.status(500).json({ error: "Failed to fetch chatbot users." });
  }
};

