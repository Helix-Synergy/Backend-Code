// routes/contactRoutes.js
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// --- Nodemailer Configuration ---
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// --- API Route for Contact Form ---
router.post("/contact", (req, res) => {
  // Add this line to see what the backend receives
  console.log("Received contact form submission:", req.body);

  const { firstName, lastName, email, phone, company, message } = req.body;

  if (!firstName || !lastName || !email || !message) {
    console.error("Validation failed: Missing required fields in req.body", { firstName, lastName, email, message });
    return res.status(400).send("First Name, Last Name, Email, and Message are required.");
  }

  // Combine names for email subject/body
  const fullName = `${firstName} ${lastName}`.trim();

  const contactMailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.RECIPIENT_EMAIL, // Or your specific contact email recipient
    subject: `New Contact Form Message from ${fullName}`, // Use combined name in subject
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2 style="color: #333;">New Contact Message</h2>
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mobile Number:</strong> ${phone || 'N/A'}</p>
        <p><strong>Company / University:</strong> ${company || 'N/A'}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      </div>
    `,
  };

  transporter.sendMail(contactMailOptions, (error, info) => {
    if (error) {
      console.error("Error sending contact email:", error);
      return res.status(500).send("Error sending contact message. Please try again.");
    }
    console.log("Contact email sent successfully:", info.response);
    res.status(200).send("Your message has been sent successfully!");
  });
});

module.exports = router;