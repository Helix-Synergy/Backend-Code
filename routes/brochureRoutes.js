// routes/brochureRoutes.js
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const path = require('path');
const multer = require('multer'); // <--- ADD THIS LINE

// Configure multer to handle form data without file uploads
const upload = multer(); // <--- ADD THIS LINE: No storage needed as we're not handling files

// --- Nodemailer Configuration ---
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Define the path to your brochure PDF (This is for email attachment)
const BROCHURE_PATH = path.join(__dirname, '..', 'brochures', 'public_health_brochure.pdf');
console.log("Calculated BROCHURE_PATH:", BROCHURE_PATH); // Good to keep for debugging

// --- API Route for Brochure Download Form ---
// <--- ADD 'upload.none()' AS MIDDLEWARE HERE ---
router.post("/brochure-download", upload.none(), async (req, res) => {
  console.log("Received brochure download request body:", req.body); // Keep this for form data check

  // Destructure all fields from the request body (now correctly populated by multer)
  const {
    firstName,
    lastName,
    mobileNumber,
    address,
    state,
    country,
    university,
    email,
    affiliation,
    linkedin,
    twitter, // Assuming you changed frontend to send 'twitter' not 'localtwitter'
    interestedIn,
  } = req.body;

  // Basic validation for required fields
  if (
    !firstName ||
    !lastName ||
    !mobileNumber ||
    !address ||
    !state ||
    !country ||
    !university ||
    !email ||
    !affiliation ||
    !interestedIn
  ) {
    console.error("Brochure Download: Missing required fields:", req.body);
    // If req.body is empty, this will trigger a 400. This is desired for bad data.
    return res.status(400).send("All required fields must be filled for brochure download.");
  }

  // --- Send Email to Administrator (Internal Notification) ---
  const adminMailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.RECIPIENT_EMAIL, // Admin's email address
    subject: `New Brochure Download Request from ${firstName} ${lastName}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2 style="color: #333;">Brochure Download Details</h2>
        <hr>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mobile Number:</strong> ${mobileNumber}</p>
        <p><strong>Address:</strong> ${address}</p>
        <p><strong>State:</strong> ${state}</p>
        <p><strong>Country:</strong> ${country}</p>
        <p><strong>University/Industry:</strong> ${university}</p>
        <p><strong>Affiliation:</strong> ${affiliation}</p>
        <p><strong>Interested In:</strong> ${interestedIn}</p>
        ${linkedin ? `<p><strong>LinkedIn:</strong> <a href="${linkedin}">${linkedin}</a></p>` : ''}
        ${twitter ? `<p><strong>Twitter:</strong> <a href="https://twitter.com/${twitter}">${twitter}</a></p>` : ''}
        <hr>
        <p>This user has requested to download the brochure.</p>
      </div>
    `,
  };

  // --- Send Confirmation Email to User (with Brochure as Attachment) ---
  const userMailOptions = {
    from: process.env.EMAIL_USER,
    to: email, // Send to the user's email
    subject: `Your PharmaTech Brochure Download - Thank You!`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2 style="color: #333;">Thank You for Your Interest!</h2>
        <p>Dear ${firstName},</p>
        <p>Thank you for requesting the PharmaTech event brochure. We appreciate your interest!</p>
        <p>Your brochure is attached to this email.</p>
        <p>We look forward to connecting with you.</p>
        <br>
        <p>Best regards,</p>
        <p>The PharmaTech Team</p>
      </div>
    `,
    attachments: [
      {
        filename: 'public_health_brochure.pdf', // Name the file will have when downloaded
        path: BROCHURE_PATH, // Path to the file on your server
        contentType: 'application/pdf',
      },
    ],
  };

  try {
    // Send email to administrator
    await transporter.sendMail(adminMailOptions);
    console.log("Admin notification email sent for brochure download.");

    // Send confirmation email to user with brochure
    await transporter.sendMail(userMailOptions);
    console.log("Brochure download confirmation email sent to user.");

    // Respond to frontend that submission was successful
    res.status(200).send("Form submitted and brochure sent to your email!");

  } catch (error) {
    console.error("Error processing brochure download:", error);
    if (error.code === 'EENVELOPE' || error.code === 'EAUTH' || error.code === 'ETIMEDOUT') {
      return res.status(500).send("Error sending email. Please check server logs for details.");
    }
    res.status(500).send("Failed to process brochure download. Please try again.");
  }
});

module.exports = router;