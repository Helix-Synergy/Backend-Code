// Backend for Helix/utils/jwt.js
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Ensure dotenv is loaded here for JWT_SECRET

// Function to sign a new JWT
function signToken(payload, expiresIn = '5m') { // Default to 5 minutes for source tokens
    if (!process.env.JWT_SECRET) {
        console.error("JWT_SECRET is not defined in .env. Cannot sign token.");
        throw new Error("JWT secret not configured.");
    }
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
}

// Function to verify a JWT
function verifyToken(token) {
    if (!process.env.JWT_SECRET) {
        console.error("JWT_SECRET is not defined in .env. Cannot verify token.");
        throw new Error("JWT secret not configured.");
    }
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        // console.error("JWT verification failed:", err.message); // Log for debugging if needed
        return null; // Return null if token is invalid or expired
    }
}

module.exports = { signToken, verifyToken };