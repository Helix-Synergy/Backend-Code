// routes/contactRoutes.js
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const multer = require('multer');

// Configure multer to handle form data without file uploads
const upload = multer();

// --- Nodemailer Transporter for Contact Forms (using Hostinger/custom SMTP) ---
// This transporter will use the same Hostinger details as your brochure download.
// Ensure these environment variables are set correctly on Render!
const infoTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST_INFO, // e.g., 'smtp.hostinger.com'
  port: parseInt(process.env.SMTP_PORT_INFO), // e.g., 465 or 587
  secure: process.env.SMTP_SECURE_INFO === 'true', // true for 465, false for 587
  auth: {
    user: process.env.EMAIL_USER_INFO, // Your full Hostinger email address for info/contact
    pass: process.env.EMAIL_PASS_INFO, // The password for that email account
  },
  // logger: true, // Uncomment for debugging nodemailer logs in your console
  // debug: true,  // Uncomment for more detailed debugging info
});

// --- API Route for Contact Form ---
router.post("/contact", upload.none(), async (req, res) => {
  console.log("Received contact form submission:", req.body);

  const {
    firstName,
    lastName,
    email,
    phone,
    company,
    message,
    websiteDomain, // <-- NEW: Capture the website domain sent from the frontend
  } = req.body;

  if (!firstName || !lastName || !email || !message || !websiteDomain) { // <-- Added websiteDomain to validation
    console.error("Validation failed: Missing required fields in req.body", req.body);
    return res.status(400).send("First Name, Last Name, Email, Message, and Website Domain are required.");
  }

  // Combine names for email subject/body
  const fullName = `${firstName} ${lastName}`.trim();

  // --- Dynamically set the Team Name for the email signature ---
  let displayTeamName = "Our"; // Default if domain is not provided or malformed
  if (websiteDomain) {
    // Basic sanitization to get a cleaner name from the domain
    const cleanedDomain = websiteDomain.replace(/^www\./, ''); // Remove 'www.'
    const parts = cleanedDomain.split('.');
    if (parts.length > 1) {
      // Take the first part of the domain (e.g., "helixconferences" from "helixconferences.com")
      const baseName = parts[0];
      displayTeamName = baseName.charAt(0).toUpperCase() + baseName.slice(1); // Capitalize first letter
    } else {
        displayTeamName = websiteDomain.charAt(0).toUpperCase() + websiteDomain.slice(1);
    }
  }

  const contactMailOptions = {
    from: process.env.EMAIL_USER_INFO,
    to: process.env.RECIPIENT_EMAIL_INFO,
    subject: `New Contact Form Message from ${fullName} (from ${websiteDomain})`, // <-- Added domain to subject
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2 style="color: #333;">New Contact Message</h2>
        <hr>
        <p><strong>Website Domain:</strong> ${websiteDomain}</p> <!-- Show domain in admin email -->
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mobile Number:</strong> ${phone || 'N/A'}</p>
        <p><strong>Company / University:</strong> ${company || 'N/A'}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
        <hr>
        <p>Best regards,</p>
        <p>The ${displayTeamName} Team</p> <!-- Dynamically set based on domain -->
      </div>
    `,
    replyTo: email
  };

  try {
    await infoTransporter.sendMail(contactMailOptions);
    console.log("Contact email sent successfully.");
    res.status(200).send("Your message has been sent successfully!");
  } catch (error) {
    console.error("Error sending contact email:", error);
    if (error.code === 'EENVELOPE' || error.code === 'EAUTH' || error.code === 'ETIMEDOUT') {
      return res.status(500).send("Error sending email. Please check server logs for details.");
    }
    res.status(500).send("Failed to send message. Please try again.");
  }
});

module.exports = router;
