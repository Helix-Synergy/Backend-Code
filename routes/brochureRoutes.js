
// routes/brochureRoutes.js
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const BrochureDownload = require('../models/BrochureDownload');

// Configure multer to handle form data without file uploads
const upload = multer();

// --- Nodemailer Transporter for Brochure Downloads & Contact Forms ---
const infoTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST_INFO,
  port: parseInt(process.env.SMTP_PORT_INFO),
  secure: process.env.SMTP_SECURE_INFO === 'true',
  auth: {
    user: process.env.EMAIL_USER_INFO,
    pass: process.env.EMAIL_PASS_INFO,
  },
  // logger: true, // Uncomment this line to see nodemailer logs in your console for debugging
  // debug: true,  // Uncomment this line for more detailed debugging info
});

// --- Map of website domains to their corresponding brochure file paths on the BACKEND ---
// IMPORTANT: You MUST place these PDF files in the 'brochures' directory
// of your backend project. For example: backend/brochures/public_health_brochure.pdf
const BROCHURE_PATHS_MAP = {
  // Existing and verified mappings:
  'publichealth.helixconferences.com': path.join(__dirname, '..', 'brochures', 'public_health_brochure.pdf'),
  'localhost:3000': path.join(__dirname, '..', 'brochures', 'public_health_brochure.pdf'), // For local development testing

  // --- Mappings based on your provided website domains and brochure filenames (CORRECTED CASE) ---
  'arm.helixconferences.com': path.join(__dirname, '..', 'brochures', 'ARM_brochure.pdf'), // <-- CORRECTED
  'ican.helixconferences.com': path.join(__dirname, '..', 'brochures', 'ICAN_brochure.pdf'), // <-- CORRECTED
  'gent.helixconferences.com': path.join(__dirname, '..', 'brochures', 'GENT_brochure.pdf'), // <-- CORRECTED
  'idom.helixconferences.com': path.join(__dirname, '..', 'brochures', 'IDOM_brochure.pdf'), // <-- CORRECTED
  'pharmatech.helixconferences.com': path.join(__dirname, '..', 'brochures', 'pharmatech_brochure.pdf'),
  'biocon.helixconferences.com': path.join(__dirname, '..', 'brochures', 'biocon_brochure.pdf'),
  'foodmeet.helixconferences.com': path.join(__dirname, '..', 'brochures', 'foodmeet_brochure.pdf'),
  'mediclave.helixconferences.com': path.join(__dirname, '..', 'brochures', 'mediclave_brochure.pdf'),
  // Add all your other website domains and their specific brochure filenames here
  // Example: 'mysite.com': path.join(__dirname, '..', 'brochures', 'mysite_brochure.pdf'),
};

// Fallback brochure path if a domain is not found in the map OR the specified brochure doesn't exist
// IMPORTANT: Ensure 's_brochure.pdf' is present in your backend's 'brochures' directory.
const FALLBACK_BROCHURE_PATH = path.join(__dirname, '..', 'brochures', 's_brochure.pdf');

// --- API Route for Brochure Download Form ---
router.post("/brochure-download", upload.none(), async (req, res) => {
  console.log("Received brochure download request body:", req.body);

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
    twitter,
    interestedIn,
    websiteDomain,
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
    !interestedIn ||
    !websiteDomain
  ) {
    console.error("Brochure Download: Missing required fields or websiteDomain:", req.body);
    return res.status(400).send("All required fields must be filled for brochure download.");
  }

  // --- Dynamically set the Team Name for the email signature ---
  let displayTeamName = "Our";
  if (websiteDomain) {
    const cleanedDomain = websiteDomain.replace(/^www\./, '');
    const parts = cleanedDomain.split('.');
    if (parts.length > 1) {
      const baseName = parts[0];
      displayTeamName = baseName.charAt(0).toUpperCase() + baseName.slice(1);
    } else {
      displayTeamName = websiteDomain.charAt(0).toUpperCase() + websiteDomain.slice(1);
    }
  }

  // --- Determine the correct brochure to attach based on websiteDomain ---
  let brochureFilePath = BROCHURE_PATHS_MAP[websiteDomain];

  // **** START OF DEBUGGING LOGS ****
  console.log(`DEBUG: websiteDomain received: "${websiteDomain}"`);
  console.log(`DEBUG: Initial brochureFilePath from map: "${brochureFilePath}"`);

  // Check if the specific brochure file exists, otherwise use fallback
  let absoluteBrochurePath;
  let fileExists = false;

  if (brochureFilePath) {
    absoluteBrochurePath = path.resolve(brochureFilePath);
    console.log(`DEBUG: Absolute brochure path resolved: "${absoluteBrochurePath}"`);
    console.log(`DEBUG: Checking if file exists at: "${absoluteBrochurePath}"`);
    fileExists = fs.existsSync(absoluteBrochurePath);
    console.log(`DEBUG: fs.existsSync result: ${fileExists}`);
  }

  if (!brochureFilePath || !fileExists) {
    console.warn(`Brochure not found for domain: ${websiteDomain}. Using fallback brochure.`);
    brochureFilePath = FALLBACK_BROCHURE_PATH;
  }

  const brochureFilename = path.basename(brochureFilePath);
  console.log(`DEBUG: Final brochureFilename to be attached: "${brochureFilename}"`);

  // --- Send Email to Administrator (Internal Notification) ---
  const adminMailOptions = {
    from: process.env.EMAIL_USER_INFO,
    to: process.env.RECIPIENT_EMAIL_INFO,
    subject: `New Brochure Download Request from ${firstName} ${lastName} (from ${websiteDomain})`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2 style="color: #333;">Brochure Download Details</h2>
        <hr>
        <p><strong>Website Domain:</strong> ${websiteDomain}</p>
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
    from: process.env.EMAIL_USER_INFO,
    to: email,
    subject: `Your Brochure Download from ${displayTeamName} - Thank You!`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2 style="color: #333;">Thank You for Your Interest!</h2>
        <p>Dear ${firstName},</p>
        <p>Thank you for requesting the event brochure. We appreciate your interest!</p>
        <p>Your brochure is attached to this email.</p>
        <p>We look forward to connecting with you.</p>
        <br>
        <p>Best regards,</p>
        <p>The ${displayTeamName} Team</p>
      </div>
    `,
    attachments: [
      {
        filename: brochureFilename, // <-- DYNAMIC FILENAME
        path: brochureFilePath,     // <-- DYNAMIC PATH TO THE BROCHURE FILE ON THE BACKEND
        contentType: 'application/pdf',
      },
    ],
  };

  try {
    // Save to Database first
    const newSubmission = await BrochureDownload.create({
      firstName, lastName, mobileNumber, address, state, country,
      university, email, affiliation, linkedin, twitter, interestedIn, websiteDomain
    });
    console.log("Brochure download saved to DB:", newSubmission._id);

    // Email sending has been removed to speed up the response.

    res.status(200).json({ success: true, message: "Form submitted successfully!" });

  } catch (error) {
    console.error("Error processing brochure download:", error);
    if (error.code === 'EENVELOPE' || error.code === 'EAUTH' || error.code === 'ETIMEDOUT') {
      return res.status(500).send("Error sending email. Please check server logs for details.");
    }
    res.status(500).send("Failed to process brochure download. Please try again.");
  }
});

// --- API Route to Fetch Brochure Downloads for Admin Dashboard ---
router.get("/brochure-download/:domain", async (req, res) => {
  try {
    const { domain } = req.params;
    let query = { websiteDomain: domain };

    // If domain is "all", fetch all records (optional convenience)
    if (domain === "all") {
      query = {};
    }

    const submissions = await BrochureDownload.find(query).sort({ createdAt: -1 });
    res.status(200).json(submissions);
  } catch (error) {
    console.error("Error fetching brochure downloads:", error);
    res.status(500).json({ success: false, message: "Failed to fetch brochure downloads." });
  }
});

module.exports = router;