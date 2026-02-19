// const express = require("express");
// const cors = require("cors");
// const cookieParser = require("cookie-parser");
// const http = require('http'); // For Socket.IO
// const { Server } = require('socket.io'); // For Socket.IO
// const mongoose = require('mongoose'); // Using Mongoose for DB connection
// require("dotenv").config(); // Load environment variables from .env file

// // Import your new route files
// const paymentRoutes = require("./routes/paymentRoutes");
// const sourceRoutes = require("./routes/sourceRoutes"); // New route for source token generation
// const emailRoutes = require("./routes/emailRoutes"); // <--- ADDED THIS LINE: Import emailRoutes

// // Import your existing route files
// const abstractRoutes = require("./routes/abstractRoutes");
// const contactRoutes = require("./routes/contactRoutes");
// const brochureRoutes = require("./routes/brochureRoutes");
// const visitorCountRoutes = require("./routes/visitorCountRoutes");

// const app = express();
// const port = process.env.PORT || 5000; // Using 5000 as a common backend port

// // --- Create HTTP Server for Express & Socket.IO ---
// const server = http.createServer(app);

// // --- Dynamic CORS Origins & Socket.IO Origin Setup ---
// const allowedFrontendOrigins = [
//     process.env.FRONTEND_URL, // This covers http://localhost:3000
//     'http://192.168.0.195:3000', // Your local network IP for frontend
//     'http://127.0.0.1:3000', // explicitly allowing localhost's loopback IP variant for local testing
//     // Add all Hostinger website URLs from .env to allowed origins
//     ...Array.from({ length: 60 }, (_, i) => process.env[`HOSTINGER_SITE_${i + 1}_URL`]).filter(Boolean)
// ];

// // --- Socket.IO Setup ---
// const io = new Server(server, {
//     cors: {
//         origin: (origin, callback) => {
//             if (allowedFrontendOrigins.includes(origin) || (origin && origin.endsWith('.helixconferences.com'))) {
//                 callback(null, true);
//             } else {
//                 console.log(`Socket.IO CORS Blocked: Origin ${origin} not allowed.`);
//                 callback(new Error('Not allowed by Socket.IO CORS'));
//             }
//         },
//         methods: ["GET", "POST"]
//     }
// });
// global.io = io; // Make `io` instance globally accessible
// console.log('✅ Socket.IO server initialized.');

// // --- CORS Configuration for Express HTTP requests ---
// const corsOptions = {
//     origin: function (origin, callback) {
//         if (!origin) return callback(null, true); // Allow requests with no origin (e.g., Postman)

//         // Explicitly check for the current origin if it's not covered by the dynamic list
//         if (allowedFrontendOrigins.includes(origin) || origin.endsWith('.helixconferences.com')) {
//             callback(null, true);
//         } else {
//             console.log(`Express CORS Blocked: Origin ${origin} not allowed.`);
//             callback(new Error(`Not allowed by CORS: ${origin}`));
//         }
//     },
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization', 'x-access-token'],
// };
// app.use(cors(corsOptions));

// // --- GLOBAL BODY PARSERS ---
// // IMPORTANT: express.json() and express.urlencoded() MUST come BEFORE
// // any route definitions or other middleware that might consume the request body.
// app.use(express.json()); // Parses application/json bodies for ALL routes
// app.use(express.urlencoded({ extended: true })); // Parses application/x-www-form-urlencoded bodies for ALL routes
// app.use(cookieParser()); // Parses cookies

// // --- MongoDB Connection (Using Mongoose) ---
// mongoose.connect(process.env.MONGO_URI)
//     .then(() => console.log('✅ MongoDB connected via Mongoose!'))
//     .catch(err => {
//         console.error('❌ MongoDB connection error:', err);
//         process.exit(1); // Exit process on DB connection failure
//     });

// // --- Route Middleware ---
// // Mount your core payment and source routes
// // The /api/payment/paypal-webhook route now has its rawBodyParser applied directly in paymentRoutes.js
// app.use("/api/payment", paymentRoutes);
// app.use("/api/source", sourceRoutes);   // Handles /api/source/generate-token and /api/source/verify-token
// app.use("/api", emailRoutes);           // <--- ADDED THIS LINE: Mount email routes for sending registration emails

// // Mount your existing routes
// app.use("/", abstractRoutes);
// app.use("/", contactRoutes);
// app.use("/", brochureRoutes);
// app.use("/api", visitorCountRoutes);

// // --- Basic Test Route ---
// app.get("/", (req, res) => {
//     res.send("Helix Conferences Backend is running and ready!");
// });

// // --- Socket.IO Connection Event ---
// io.on('connection', (socket) => {
//     console.log(`A client connected via Socket.IO: ${socket.id}`);
//     socket.on('disconnect', () => {
//         console.log(`Client disconnected from Socket.IO: ${socket.id}`);
//     });
// });

// // --- Server Start ---
// server.listen(port, () => {
//     console.log(`🚀 Server running on port ${port}`);
// });

// // --- Graceful Shutdown ---
// process.on('SIGINT', async () => {
//     console.log('SIGINT signal received: closing DB connection and exiting');
//     await mongoose.disconnect();
//     server.close(() => {
//         console.log('HTTP server closed.');
//         process.exit(0);
//     });
// });
// process.on('SIGTERM', async () => {
//     console.log('SIGTERM signal received: closing DB connection and exiting');
//     await mongoose.disconnect();
//     server.close(() => {
//         console.log('HTTP server closed.');
//         process.exit(0);
//     });
// });





// _______The code starts here-------------------
// const express = require("express");
// const cors = require("cors");
// const cookieParser = require("cookie-parser");
// const http = require('http');
// const { Server } = require('socket.io');
// const mongoose = require('mongoose');
// require("dotenv").config();

// // Import your existing route files
// const sourceRoutes = require("./routes/sourceRoutes");
// const emailRoutes = require("./routes/emailRoutes");
// const abstractRoutes = require("./routes/abstractRoutes");
// const contactRoutes = require("./routes/contactRoutes");
// const brochureRoutes = require("./routes/brochureRoutes");
// const visitorCountRoutes = require("./routes/visitorCountRoutes");

// // This paymentRoutes file will now be for Stripe only
// const paymentRoutes = require("./routes/paymentRoutes");

// const app = express();
// const port = process.env.PORT || 5000;

// const server = http.createServer(app);

// const allowedFrontendOrigins = [
//   process.env.FRONTEND_URL || 'http://localhost:3000',

//     'http://192.168.0.195:3000',
//     'http://127.0.0.1:3000',
//     'https://helix-scientific-conferences.vercel.app',
//     'https://helixconferences.com',
   
    

   

//     ...Array.from({ length: 60 }, (_, i) => process.env[`HOSTINGER_SITE_${i + 1}_URL`]).filter(Boolean)
// ];

// const io = new Server(server, {
//     cors: {
//         origin: (origin, callback) => {
//             if (allowedFrontendOrigins.includes(origin) || (origin && origin.endsWith('.helixconferences.com'))) {
//                 callback(null, true);
//             } else {
//                 console.log(`Socket.IO CORS Blocked: Origin ${origin} not allowed.`);
//                 callback(new Error('Not allowed by Socket.IO CORS'));
//             }
//         },
//         methods: ["GET", "POST"]
//     }
// });
// global.io = io;
// console.log('✅ Socket.IO server initialized.');

// const corsOptions = {
//     origin: function (origin, callback) {
//         if (!origin) return callback(null, true);
//         if (allowedFrontendOrigins.includes(origin) || origin.endsWith('.helixconferences.com')) {
//             callback(null, true);
//         } else {
//             console.log(`Express CORS Blocked: Origin ${origin} not allowed.`);
//             callback(new Error(`Not allowed by CORS: ${origin}`));
//         }
//     },
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization', 'x-access-token'],
// };
// app.use(cors(corsOptions));

// // --- Stripe Webhook Body Parser ---
// // This middleware is critical and must be placed before the global JSON parser.
// // It applies ONLY to the Stripe webhook route.
// app.use("/api/payment/stripe-webhook", express.raw({ type: "application/json" }));

// // --- Global Body Parsers ---
// // These apply to all other routes.
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());

// // --- MongoDB Connection (Using Mongoose) ---
// mongoose.connect(process.env.MONGO_URI)
//     .then(() => console.log('✅ MongoDB connected via Mongoose!'))
//     .catch(err => {
//         console.error('❌ MongoDB connection error:', err);
//         process.exit(1);
//     });

// // --- Route Middleware ---
// app.use("/api/payment", paymentRoutes);

// // Mount your existing routes
// app.use("/api/source", sourceRoutes);
// app.use("/api", emailRoutes);
// app.use("/", abstractRoutes);
// app.use("/", contactRoutes);
// app.use("/", brochureRoutes);
// app.use("/api", visitorCountRoutes);

// // --- Basic Test Route ---
// app.get("/", (req, res) => {
//     res.send("Helix Conferences Backend is running and ready!");
// });

// // --- Socket.IO Connection Event ---
// io.on('connection', (socket) => {
//     console.log(`A client connected via Socket.IO: ${socket.id}`);
//     socket.on('disconnect', () => {
//         console.log(`Client disconnected from Socket.IO: ${socket.id}`);
//     });
// });

// // --- Server Start ---
// server.listen(port, () => {
//     console.log(`🚀 Server running on port ${port}`);
// });

// // --- Graceful Shutdown ---
// process.on('SIGINT', async () => {
//     console.log('SIGINT signal received: closing DB connection and exiting');
//     await mongoose.disconnect();
//     server.close(() => {
//         console.log('HTTP server closed.');
//         process.exit(0);
//     });
// });
// process.on('SIGTERM', async () => {
//     console.log('SIGTERM signal received: closing DB connection and exiting');
//     await mongoose.disconnect();
//     server.close(() => {
//         console.log('HTTP server closed.');
//         process.exit(0);
//     });
// });



// _______The code 2 starts here-------------------
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const multer = require("multer"); 
require("dotenv").config();

// Import your existing route files
const sourceRoutes = require("./routes/sourceRoutes");
const emailRoutes = require("./routes/emailRoutes");
const abstractRoutes = require("./routes/abstractRoutes");
const contactRoutes = require("./routes/contactRoutes");
const brochureRoutes = require("./routes/brochureRoutes");
const visitorCountRoutes = require("./routes/visitorCountRoutes");
const Router=require("./routes/helixconferencecontactroute")
const emailRoutes1=require("./routes/helixconferenceEmailrouter")
// This paymentRoutes file will now be for Stripe only
const paymentRoutes = require("./routes/paymentRoutes");

const app = express();
const port = process.env.PORT || 5000;

const server = http.createServer(app);

const allowedFrontendOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000',

    'http://192.168.0.195:3000',
    'http://127.0.0.1:3000',
    'https://helix-scientific-conferences.vercel.app',
    'https://helixconferences.com',
               
  'https://www.helixconferences.com', 
   
    

   

    ...Array.from({ length: 60 }, (_, i) => process.env[`HOSTINGER_SITE_${i + 1}_URL`]).filter(Boolean)
];

const io = new Server(server, {
  cors: {
    origin: true,
    methods: ["GET", "POST"]
  }
});

global.io = io;
console.log('✅ Socket.IO server initialized.');

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // Postman

    if (
      origin.startsWith("http://localhost") ||
       origin.startsWith("https://helixconferences.com") ||
      origin.endsWith(".vercel.app") ||

      origin.endsWith(".helixconferences.com")
    ) {
      return callback(null, true);
    }

    console.log("❌ CORS blocked:", origin);
    callback(null, false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// --- Stripe Webhook Body Parser ---
// This middleware is critical and must be placed before the global JSON parser.
// It applies ONLY to the Stripe webhook route.
app.use("/api/payment/stripe-webhook", express.raw({ type: "application/json" }));

// --- Global Body Parsers ---
// These apply to all other routes.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// --- MongoDB Connection (Using Mongoose) ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB connected via Mongoose!'))
    .catch(err => {
        console.error('❌ MongoDB connection error:', err);
        process.exit(1);
    });

// --- Route Middleware ---
// app.use("/api/payment", paymentRoutes);

// Mount your existing routes
// app.use("/api/source", sourceRoutes);
// app.use("/api", emailRoutes);

// Helix Subdomain Routes
app.use("/", abstractRoutes);
app.use("/", contactRoutes);
app.use("/", brochureRoutes);
// app.use("/api", visitorCountRoutes);

// Helix Conference Contact Form and Email Routes
app.use("/contact", Router); 
app.use("/emails",emailRoutes1)
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ message: "File size exceeds 10MB limit" });
    }
    return res.status(400).json({ message: err.message });
  }

  if (err.message === "Only PDF files are allowed") {
    return res.status(400).json({ message: err.message });
  }

  console.error("Unhandled Error:", err);
  res.status(500).json({ message: "Something went wrong" });
});

// --- Basic Test Route ---
app.get("/", (req, res) => {
    res.send("Helix Conferences Backend is running and ready!");
});

// --- Socket.IO Connection Event ---
io.on('connection', (socket) => {
    console.log(`A client connected via Socket.IO: ${socket.id}`);
    socket.on('disconnect', () => {
        console.log(`Client disconnected from Socket.IO: ${socket.id}`);
    });
});

// --- Server Start ---
server.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
});

// --- Graceful Shutdown ---
process.on('SIGINT', async () => {
    console.log('SIGINT signal received: closing DB connection and exiting');
    await mongoose.disconnect();
    server.close(() => {
        console.log('HTTP server closed.');
        process.exit(0);
    });
});
process.on('SIGTERM', async () => {
    console.log('SIGTERM signal received: closing DB connection and exiting');
    await mongoose.disconnect();
    server.close(() => {
        console.log('HTTP server closed.');
        process.exit(0);
    });
});