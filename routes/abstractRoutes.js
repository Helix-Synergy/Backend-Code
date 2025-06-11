// routes/abstractRoutes.js
const express = require('express');
const router = express.Router(); // Create an Express router
const nodemailer = require('nodemailer');
const multer = require('multer');

// --- Multer Configuration for File Uploads ---
const upload = multer({ storage: multer.memoryStorage() });

// --- Nodemailer Configuration ---
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// --- The API Route for Abstract Submission ---
router.post("/abstract-submission", upload.single("abstract"), (req, res) => {
  const form = req.body;
  const abstractFile = req.file;

  if (!abstractFile) {
    return res.status(400).send("No abstract file uploaded.");
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.RECIPIENT_EMAIL,
    subject: `New Abstract Submission: ${form.abstractTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2 style="color: #333;">New Abstract Submission Details</h2>
        <hr>
        <p><strong>Name:</strong> ${form.firstName} ${form.lastName}</p>
        <p><strong>Email:</strong> ${form.email}</p>
        <p><strong>Mobile Number:</strong> ${form.mobileNumber}</p>
        <p><strong>University/Industry:</strong> ${form.university}</p>
        <p><strong>Affiliation:</strong> ${form.affiliation}</p>
        <p><strong>Country:</strong> ${form.country}</p>
        <p><strong>Presentation Track:</strong> ${form.interestedIn}</p>
        <p><strong>Abstract Title:</strong> ${form.abstractTitle}</p>
        <hr>
        <h3 style="color: #333;">Social Profiles</h3>
        <p><strong>LinkedIn:</strong> <a href="${form.linkedin}">${form.linkedin}</a></p>
        <p><strong>Twitter:</strong> <a href="https://twitter.com/${form.twitter}">${form.twitter}</a></p>
        <hr>
        <p>The abstract PDF is attached to this email.</p>
      </div>
    `,
    attachments: [
      {
        filename: abstractFile.originalname,
        content: abstractFile.buffer,
        contentType: "application/pdf",
      },
    ],
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      return res.status(500).send("Error sending email. Please try again.");
    }
    console.log("Email sent successfully:", info.response);
    res.status(200).send("Abstract submitted successfully!");
  });
});

module.exports = router; // Export the router