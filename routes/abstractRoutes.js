// routes/abstractRoutes.js
const express = require('express');
const router = express.Router(); // Create an Express router
const nodemailer = require('nodemailer');
const multer = require('multer');

// --- Multer Configuration for File Uploads ---
const upload = multer({ storage: multer.memoryStorage() });

// --- Nodemailer Transporter for ABSTRACT SUBMISSIONS ---
// This transporter will use a dedicated Hostinger (or other custom SMTP) email for abstracts.
// Make sure to set these NEW environment variables correctly on Render!
const abstractTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST_ABSTRACT, // e.g., 'smtp.hostinger.com'
  port: parseInt(process.env.SMTP_PORT_ABSTRACT), // e.g., 465 (for SSL) or 587 (for TLS)
  secure: process.env.SMTP_SECURE_ABSTRACT === 'true', // true for 465, false for 587
  auth: {
    user: process.env.EMAIL_USER_ABSTRACT, // Your full Hostinger email address for abstract submissions
    pass: process.env.EMAIL_PASS_ABSTRACT, // The password for that specific email account
  },
  // logger: true, // Uncomment this line to see nodemailer logs in your console for debugging
  // debug: true,  // Uncomment this line for more detailed debugging info
});

// --- The API Route for Abstract Submission ---
router.post("/abstract-submission", upload.single("abstract"), async (req, res) => { // Made route async
  const form = req.body;
  const abstractFile = req.file;

  // Destructure websiteDomain from the form data
  const { websiteDomain } = form;

  if (!abstractFile || !websiteDomain) { // Added websiteDomain to validation
    console.error("No abstract file uploaded or websiteDomain missing.");
    return res.status(400).send("No abstract file uploaded or Website Domain is required.");
  }

  // --- Dynamically set the Team Name for the email signature ---
  let displayTeamName = "Our"; // Default if domain is not provided or malformed
  if (websiteDomain) {
    const cleanedDomain = websiteDomain.replace(/^www\./, ''); // Remove 'www.'
    const parts = cleanedDomain.split('.');
    if (parts.length > 1) {
      const baseName = parts[0];
      displayTeamName = baseName.charAt(0).toUpperCase() + baseName.slice(1); // Capitalize first letter
    } else {
        displayTeamName = websiteDomain.charAt(0).toUpperCase() + websiteDomain.slice(1);
    }
  }

  // Mail options for the administrator
  const adminMailOptions = {
    from: process.env.EMAIL_USER_ABSTRACT, // Use the dedicated abstract sender email
    to: process.env.RECIPIENT_EMAIL_ABSTRACT, // Admin's email address for abstract notifications
    subject: `New Abstract Submission: ${form.abstractTitle} (from ${websiteDomain})`, // Added domain to subject
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2 style="color: #333;">New Abstract Submission Details</h2>
        <hr>
        <p><strong>Website Domain:</strong> ${websiteDomain}</p> <!-- Show domain in admin email -->
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

  // Mail options for the user (confirmation email)
  const userMailOptions = {
    from: process.env.EMAIL_USER_ABSTRACT, // Use the dedicated abstract sender email
    to: form.email, // Send to the user's email
    subject: `Your Abstract Submission for ${displayTeamName} - Confirmation`, // Dynamic subject
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2 style="color: #333;">Thank You for Your Abstract Submission!</h2>
        <p>Dear ${form.firstName},</p>
        <p>Thank you for submitting your abstract titled: <strong>"${form.abstractTitle}"</strong>.</p>
        <p>We have received your submission from ${websiteDomain} and will review it shortly.</p>
        <p>You will receive further updates via email.</p>
        <br>
        <p>Best regards,</p>
        <p>The ${displayTeamName} Team</p> <!-- Dynamically set based on domain -->
      </div>
    `,
  };

  try {
    // Send email to administrator
    await abstractTransporter.sendMail(adminMailOptions);
    console.log("Admin notification email sent for abstract submission.");

    // Send confirmation email to user
    await abstractTransporter.sendMail(userMailOptions);
    console.log("User confirmation email sent for abstract submission.");

    res.status(200).send("Abstract submitted successfully and confirmation sent!");
  } catch (error) {
    console.error("Error sending abstract email:", error);
    if (error.code === 'EENVELOPE' || error.code === 'EAUTH' || error.code === 'ETIMEDOUT') {
      return res.status(500).send("Error sending email. Please check server logs for details.");
    }
    res.status(500).send("Failed to submit abstract. Please try again.");
  }
});

module.exports = router; // Export the router
