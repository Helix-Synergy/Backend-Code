// // routes/brochureRoutes.js
// const express = require('express');
// const router = express.Router();
// const nodemailer = require('nodemailer');
// const path = require('path');
// const multer = require('multer');

// // Configure multer to handle form data without file uploads
// const upload = multer(); // No storage needed as we're not handling files

// // --- Nodemailer Transporter for Brochure Downloads & Contact Forms ---
// // This transporter will use your Hostinger (or other custom SMTP) details.
// // Make sure to set these environment variables correctly on Render!
// const infoTransporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST_INFO, // e.g., 'smtp.hostinger.com' or 'smtp.hostinger.in'
//   port: parseInt(process.env.SMTP_PORT_INFO), // e.g., 465 (for SSL) or 587 (for TLS)
//   secure: process.env.SMTP_SECURE_INFO === 'true', // Use true for 465, false for 587
//   auth: {
//     user: process.env.EMAIL_USER_INFO, // Your full Hostinger email address (e.g., info@yourdomain.com)
//     pass: process.env.EMAIL_PASS_INFO, // The password for that email account
//   },
//   // logger: true, // Uncomment this line to see nodemailer logs in your console for debugging
//   // debug: true,  // Uncomment this line for more detailed debugging info
// });

// // Define the path to your brochure PDF (This is for email attachment)
// const BROCHURE_PATH = path.join(__dirname, '..', 'brochures', 'public_health_brochure.pdf');
// console.log("Calculated BROCHURE_PATH:", BROCHURE_PATH);

// // --- API Route for Brochure Download Form ---
// router.post("/brochure-download", upload.none(), async (req, res) => {
//   console.log("Received brochure download request body:", req.body);

//   const {
//     firstName,
//     lastName,
//     mobileNumber,
//     address,
//     state,
//     country,
//     university,
//     email,
//     affiliation,
//     linkedin,
//     twitter,
//     interestedIn,
//   } = req.body;

//   // Basic validation for required fields
//   if (
//     !firstName ||
//     !lastName ||
//     !mobileNumber ||
//     !address ||
//     !state ||
//     !country ||
//     !university ||
//     !email ||
//     !affiliation ||
//     !interestedIn
//   ) {
//     console.error("Brochure Download: Missing required fields:", req.body);
//     return res.status(400).send("All required fields must be filled for brochure download.");
//   }

//   // --- Send Email to Administrator (Internal Notification) ---
//   const adminMailOptions = {
//     from: process.env.EMAIL_USER_INFO, // Use the new INFO sender email
//     to: process.env.RECIPIENT_EMAIL_INFO, // Admin's email address for info/brochure requests
//     subject: `New Brochure Download Request from ${firstName} ${lastName}`,
//     html: `
//       <div style="font-family: Arial, sans-serif; line-height: 1.6;">
//         <h2 style="color: #333;">Brochure Download Details</h2>
//         <hr>
//         <p><strong>Name:</strong> ${firstName} ${lastName}</p>
//         <p><strong>Email:</strong> ${email}</p>
//         <p><strong>Mobile Number:</strong> ${mobileNumber}</p>
//         <p><strong>Address:</strong> ${address}</p>
//         <p><strong>State:</strong> ${state}</p>
//         <p><strong>Country:</strong> ${country}</p>
//         <p><strong>University/Industry:</strong> ${university}</p>
//         <p><strong>Affiliation:</strong> ${affiliation}</p>
//         <p><strong>Interested In:</strong> ${interestedIn}</p>
//         ${linkedin ? `<p><strong>LinkedIn:</strong> <a href="${linkedin}">${linkedin}</a></p>` : ''}
//         ${twitter ? `<p><strong>Twitter:</strong> <a href="https://twitter.com/${twitter}">${twitter}</a></p>` : ''}
//         <hr>
//         <p>This user has requested to download the brochure.</p>
//       </div>
//     `,
//   };

//   // --- Send Confirmation Email to User (with Brochure as Attachment) ---
//   const userMailOptions = {
//     from: process.env.EMAIL_USER_INFO, // Use the new INFO sender email
//     to: email, // Send to the user's email
//     subject: `Your PharmaTech Brochure Download - Thank You!`,
//     html: `
//       <div style="font-family: Arial, sans-serif; line-height: 1.6;">
//         <h2 style="color: #333;">Thank You for Your Interest!</h2>
//         <p>Dear ${firstName},</p>
//         <p>Thank you for requesting the PharmaTech event brochure. We appreciate your interest!</p>
//         <p>Your brochure is attached to this email.</p>
//         <p>We look forward to connecting with you.</p>
//         <br>
//         <p>Best regards,</p>
//         <p>The PharmaTech Team</p>
//       </div>
//     `,
//     attachments: [
//       {
//         filename: 'public_health_brochure.pdf',
//         path: BROCHURE_PATH,
//         contentType: 'application/pdf',
//       },
//     ],
//   };

//   try {
//     // Send emails using the infoTransporter
//     await infoTransporter.sendMail(adminMailOptions);
//     console.log("Admin notification email sent for brochure download.");

//     await infoTransporter.sendMail(userMailOptions);
//     console.log("Brochure download confirmation email sent to user.");

//     res.status(200).send("Form submitted and brochure sent to your email!");

//   } catch (error) {
//     console.error("Error processing brochure download:", error);
//     if (error.code === 'EENVELOPE' || error.code === 'EAUTH' || error.code === 'ETIMEDOUT') {
//       return res.status(500).send("Error sending email. Please check server logs for details.");
//     }
//     res.status(500).send("Failed to process brochure download. Please try again.");
//   }
// });

// module.exports = router;


// routes/brochureRoutes.js
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const path = require('path');
const multer = require('multer');

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
  // debug: true,  // Uncomment this line for more detailed debugging info
});

// Define the path to your brochure PDF (This is for email attachment)
const BROCHURE_PATH = path.join(__dirname, '..', 'brochures', 'public_health_brochure.pdf');
console.log("Calculated BROCHURE_PATH:", BROCHURE_PATH);

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
    websiteDomain, // <-- NEW: Capture the website domain sent from the frontend
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
    !websiteDomain // <-- Ensure websiteDomain is also present
  ) {
    console.error("Brochure Download: Missing required fields or websiteDomain:", req.body);
    return res.status(400).send("All required fields must be filled for brochure download.");
  }

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


  // --- Send Email to Administrator (Internal Notification) ---
  const adminMailOptions = {
    from: process.env.EMAIL_USER_INFO,
    to: process.env.RECIPIENT_EMAIL_INFO,
    subject: `New Brochure Download Request from ${firstName} ${lastName} (from ${websiteDomain})`, // Add domain to subject
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2 style="color: #333;">Brochure Download Details</h2>
        <hr>
        <p><strong>Website Domain:</strong> ${websiteDomain}</p> <!-- Show domain in admin email -->
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
    subject: `Your Brochure Download from ${displayTeamName} - Thank You!`, // Dynamically set subject
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2 style="color: #333;">Thank You for Your Interest!</h2>
        <p>Dear ${firstName},</p>
        <p>Thank you for requesting the event brochure. We appreciate your interest!</p>
        <p>Your brochure is attached to this email.</p>
        <p>We look forward to connecting with you.</p>
        <br>
        <p>Best regards,</p>
        <p>The ${displayTeamName} Team</p> <!-- Dynamically set based on domain -->
      </div>
    `,
    attachments: [
      {
        filename: 'public_health_brochure.pdf',
        path: BROCHURE_PATH,
        contentType: 'application/pdf',
      },
    ],
  };

  try {
    // Send emails using the infoTransporter
    await infoTransporter.sendMail(adminMailOptions);
    console.log("Admin notification email sent for brochure download.");

    await infoTransporter.sendMail(userMailOptions);
    console.log("Brochure download confirmation email sent to user.");

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
