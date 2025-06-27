// // server.js

// const express = require("express");
// const nodemailer = require("nodemailer");
// const multer = require("multer");
// const cors = require("cors");
// require("dotenv").config(); // To use variables from .env file

// const app = express();
// const port = process.env.PORT || 5000;

// // Middleware
// app.use(cors()); // Enable Cross-Origin Resource Sharing
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // --- Multer Configuration for File Uploads ---
// // This tells Multer to store the uploaded file in memory
// const upload = multer({ storage: multer.memoryStorage() });

// // --- Nodemailer Configuration ---
// // This sets up the email sending service.
// const transporter = nodemailer.createTransport({
//   service: "gmail", // Or your email provider
//   auth: {
//     user: process.env.EMAIL_USER, // Your email from .env
//     pass: process.env.EMAIL_PASS, // Your email app password from .env
//   },
// });

// // --- The API Route for Abstract Submission ---
// // The 'upload.single("abstract")' part tells Multer to expect one file named "abstract".
// app.post("/abstract-submission", upload.single("abstract"), (req, res) => {
//   // 'req.body' contains the text fields from your form
//   // 'req.file' contains the uploaded file (the abstract PDF)
//   const form = req.body;
//   const abstractFile = req.file;

//   if (!abstractFile) {
//     return res.status(400).send("No abstract file uploaded.");
//   }

//   // --- Formatting the Email ---
//   const mailOptions = {
//     from: process.env.EMAIL_USER,
//     to: process.env.RECIPIENT_EMAIL, // The email address that will receive the submissions
//     subject: `New Abstract Submission: ${form.abstractTitle}`,
//     html: `
//       <div style="font-family: Arial, sans-serif; line-height: 1.6;">
//         <h2 style="color: #333;">New Abstract Submission Details</h2>
//         <hr>
//         <p><strong>Name:</strong> ${form.firstName} ${form.lastName}</p>
//         <p><strong>Email:</strong> ${form.email}</p>
//         <p><strong>Mobile Number:</strong> ${form.mobileNumber}</p>
//         <p><strong>University/Industry:</strong> ${form.university}</p>
//         <p><strong>Affiliation:</strong> ${form.affiliation}</p>
//         <p><strong>Country:</strong> ${form.country}</p>
//         <p><strong>Presentation Track:</strong> ${form.interestedIn}</p>
//         <p><strong>Abstract Title:</strong> ${form.abstractTitle}</p>
//         <hr>
//         <h3 style="color: #333;">Social Profiles</h3>
//         <p><strong>LinkedIn:</strong> <a href="${form.linkedin}">${form.linkedin}</a></p>
//         <p><strong>Twitter:</strong> <a href="https://twitter.com/${form.twitter}">${form.twitter}</a></p>
//         <hr>
//         <p>The abstract PDF is attached to this email.</p>
//       </div>
//     `,
//     attachments: [
//       {
//         filename: abstractFile.originalname, // The original name of the file
//         content: abstractFile.buffer, // The file data
//         contentType: "application/pdf",
//       },
//     ],
//   };

//   // --- Sending the Email ---
//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       console.error("Error sending email:", error);
//       return res.status(500).send("Error sending email. Please try again.");
//     }
//     console.log("Email sent successfully:", info.response);
//     res.status(200).send("Abstract submitted successfully!");
//   });
// });

// // Start the server
// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });




// // server.js

// const express = require("express");
// const cors = require("cors");
// require("dotenv").config(); // Load environment variables from .env file

// // Import your database utility
// const { initializeDb, closeDb } = require("./utils/db"); // <--- NEW: Import db utilities



// // Import your route files
// const abstractRoutes = require("./routes/abstractRoutes");
// const contactRoutes = require("./routes/contactRoutes");
// const brochureRoutes = require("./routes/brochureRoutes");
// const visitorCountRoutes = require("./routes/visitorCountRoutes");

// const app = express();
// const port = process.env.PORT || 3001; // Use port from environment variable or default to 3001

// // --- CORS Configuration ---
// // This configuration allows requests from the main domain and any of its subdomains.
// const corsOptions = {
//   origin: function (origin, callback) {
//     // Allow requests with no origin (e.g., from Postman, curl, or same-origin requests during development)
//     if (!origin) return callback(null, true);

//     // Define the base domain that all your subdomains will share
//     const baseDomain = 'helixconferences.com';

//     // Check if the request origin ends with the base domain (e.g., "pharmatech.helixconferences.com")
//     // or if it's the exact base domain itself ("helixconferences.com")
//     if (origin.endsWith(`.${baseDomain}`) || origin === `https://${baseDomain}`) {
//       callback(null, true); // Allow the origin
//     } else {
//       console.log(`CORS Blocked: Origin ${origin} not allowed.`); // Log blocked origins for debugging
//       callback(new Error(`Not allowed by CORS: ${origin}`)); // Block the origin
//     }
//   },
//   credentials: true, // Allow cookies to be sent
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed HTTP methods
//   allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
// };
// app.use(cors(corsOptions));

// // --- Global Middleware ---
// // Middleware to parse incoming request bodies. Order matters!
// app.use(express.json()); // Parses JSON-formatted request bodies
// app.use(express.urlencoded({ extended: true })); // Parses URL-encoded request bodies

// // --- Route Middleware ---
// // Mount your imported route modules to the application.
// // Requests to paths defined within these modules will be handled by them.
// app.use("/", abstractRoutes); // Handles routes for abstract submissions
// app.use("/", contactRoutes);  // Handles routes for contact form submissions
// app.use("/", brochureRoutes); // Handles routes for brochure downloads
// app.use("/api", visitorCountRoutes);

// // --- Database Initialization and Server Start ---
// // Call initializeDb() before starting the server
// initializeDb()
//   .then(() => {
//     app.listen(port, () => {
//       console.log(`Server is running on port ${port}`);
//     });

//     // Optional: Graceful shutdown for DB connection
//     process.on('SIGINT', () => {
//         console.log('SIGINT signal received: closing DB connection and exiting');
//         closeDb();
//         process.exit(0);
//     });
//     process.on('SIGTERM', () => {
//         console.log('SIGTERM signal received: closing DB connection and exiting');
//         closeDb();
//         process.exit(0);
//     });

//   })
//   .catch((err) => {
//     console.error("Failed to initialize database. Server not started.", err);
//     process.exit(1); // Exit if DB initialization fails
//   });







// server.js

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser"); // <-- NEW: Import cookie-parser
require("dotenv").config(); // Load environment variables from .env file

// Import your database utility
const { initializeDb, closeDb } = require("./utils/db");

// Import your route files
const abstractRoutes = require("./routes/abstractRoutes");
const contactRoutes = require("./routes/contactRoutes");
const brochureRoutes = require("./routes/brochureRoutes");
const visitorCountRoutes = require("./routes/visitorCountRoutes"); // <-- NEW: Import visitorCountRoutes

const app = express();
const port = process.env.PORT || 3001;

// --- CORS Configuration ---
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    const baseDomain = 'helixconferences.com';
    const allowedOrigins = [
      `https://${baseDomain}`,
      // Allow your React dev server for local testing.
      // IMPORTANT: Adjust this in production if your frontend is not on a subdomain of helixconferences.com
      `http://localhost:3000`
    ];

    if (origin.endsWith(`.${baseDomain}`) || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log(`CORS Blocked: Origin ${origin} not allowed.`);
      callback(new Error(`Not allowed by CORS: ${origin}`));
    }
  },
  credentials: true, // Crucial for sending/receiving cookies for unique visitor tracking
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
};
app.use(cors(corsOptions));

// --- Global Middleware ---
app.use(express.json()); // Parses JSON-formatted request bodies
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded request bodies
app.use(cookieParser()); // <-- NEW: Add cookie-parser middleware here. It must be before routes that use req.cookies.

// --- Route Middleware ---
// Mount your imported route modules to the application.
app.use("/", abstractRoutes); // Handles routes for abstract submissions
app.use("/", contactRoutes);  // Handles routes for contact form submissions
app.use("/", brochureRoutes); // Handles routes for brochure downloads
app.use("/api", visitorCountRoutes); // <-- NEW: Mount visitorCountRoutes under /api prefix

// --- Database Initialization and Server Start ---
// Call initializeDb() before starting the server.
// The server will only start listening for requests AFTER the database is ready.
initializeDb()
  .then(() => {
    // ONLY ONE app.listen call, inside this block
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });

    // Optional: Graceful shutdown for DB connection
    // Ensures the SQLite database file is properly closed when the server process exits
    process.on('SIGINT', () => { // Catch Ctrl+C
        console.log('SIGINT signal received: closing DB connection and exiting');
        closeDb();
        process.exit(0);
    });
    process.on('SIGTERM', () => { // Catch process manager termination signals
        console.log('SIGTERM signal received: closing DB connection and exiting');
        closeDb();
        process.exit(0);
    });

  })
  .catch((err) => {
    // If database initialization fails, log the error and exit the process
    console.error("Failed to initialize database. Server not started.", err);
    process.exit(1);
  });
