const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const multer = require("multer");
require("dotenv").config();

// Routes
const sourceRoutes = require("./routes/sourceRoutes");
const emailRoutes = require("./routes/emailRoutes");
const abstractRoutes = require("./routes/abstractRoutes");
const contactRoutes = require("./routes/contactRoutes");
const brochureRoutes = require("./routes/brochureRoutes");
const visitorCountRoutes = require("./routes/visitorCountRoutes");

const Router = require("./routes/helixconferencecontactroute");
const emailRoutes1 = require("./routes/helixconferenceEmailrouter");
const router2 = require("./routes/helixsyngeryrouter");

const paymentRoutes = require("./routes/paymentRoutes");

const app = express();

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);


// =========================
// ALLOWED FRONTEND ORIGINS
// =========================

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "http://127.0.0.1:3000",

  "https://helix-admin-dashboard-1.onrender.com",
  "https://helix-scientific-conferences.vercel.app",

  "https://helixconferences.com",
  "https://www.helixconferences.com",

  process.env.FRONTEND_URL,
].filter(Boolean);


// =========================
// SOCKET.IO CONFIG
// =========================

const io = new Server(server, {
  cors: {
    origin: function (origin, callback) {

      if (!origin) {
        return callback(null, true);
      }

      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app") ||
        origin.endsWith(".helixconferences.com") ||
        origin.endsWith(".onrender.com")
      ) {
        callback(null, true);
      } else {
        console.log("❌ Socket.IO CORS blocked:", origin);
        callback(new Error("Socket.IO CORS blocked"));
      }
    },
    methods: ["GET", "POST"],
    credentials: true,
  },
});

global.io = io;

console.log("✅ Socket.IO initialized");


// =========================
// EXPRESS CORS CONFIG
// =========================

const corsOptions = {
  origin: function (origin, callback) {

    // Allow Postman/mobile apps
    if (!origin) {
      return callback(null, true);
    }

    if (
      allowedOrigins.includes(origin) ||
      origin.endsWith(".vercel.app") ||
      origin.endsWith(".helixconferences.com") ||
      origin.endsWith(".onrender.com")
    ) {
      callback(null, true);
    } else {
      console.log("❌ CORS blocked:", origin);
      callback(new Error(`CORS blocked for ${origin}`));
    }
  },

  credentials: true,

  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],

  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "x-access-token",
  ],
};

app.use(cors(corsOptions));

app.options("*", cors(corsOptions));


// =========================
// BODY PARSERS
// =========================

// Stripe webhook
app.use(
  "/api/payment/stripe-webhook",
  express.raw({ type: "application/json" })
);

// Global parsers
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());


// =========================
// MONGODB CONNECTION
// =========================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
  })
  .catch((err) => {
    console.log("❌ MongoDB connection error:", err);
    process.exit(1);
  });


// =========================
// ROUTES
// =========================

// Payment Routes
app.use("/api/payment", paymentRoutes);

// Existing Routes
app.use("/api/source", sourceRoutes);

app.use("/api", emailRoutes);

app.use("/", abstractRoutes);

app.use("/", contactRoutes);

app.use("/", brochureRoutes);

app.use("/api", visitorCountRoutes);

// Helix Conference Routes
app.use("/contact", Router);

app.use("/emails", emailRoutes1);

// Helix Synergy Routes
app.use("/contactform", router2);


// =========================
// MULTER ERROR HANDLER
// =========================

app.use((err, req, res, next) => {

  if (err instanceof multer.MulterError) {

    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File size exceeds 10MB limit",
      });
    }

    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  if (err.message === "Only PDF files are allowed") {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  console.error("❌ Server Error:", err);

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});


// =========================
// TEST ROUTE
// =========================

app.get("/", (req, res) => {
  res.send("🚀 Helix Backend Running Successfully");
});


// =========================
// SOCKET CONNECTION
// =========================

io.on("connection", (socket) => {

  console.log("✅ Socket Connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ Socket Disconnected:", socket.id);
  });
});


// =========================
// START SERVER
// =========================

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});


// =========================
// GRACEFUL SHUTDOWN
// =========================

process.on("SIGINT", async () => {

  console.log("SIGINT received");

  await mongoose.disconnect();

  server.close(() => {

    console.log("HTTP server closed");

    process.exit(0);
  });
});

process.on("SIGTERM", async () => {

  console.log("SIGTERM received");

  await mongoose.disconnect();

  server.close(() => {

    console.log("HTTP server closed");

    process.exit(0);
  });
});
