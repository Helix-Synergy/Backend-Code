// Backend for Helix/middlewares/authMiddleware.js
const { verifyToken } = require('../utils/jwt'); // Use your utility function

/**
 * Middleware to verify a JSON Web Token (JWT) from incoming requests,
 * or to allow a specific 'DIRECT_REGISTRATION_SOURCE_ID' for un-tokenized direct access.
 * It checks the Authorization: Bearer <token> header, x-access-token header, or query param.
 * If valid, attaches the decoded payload to req.sourceTokenPayload.
 */
function authMiddleware(req, res, next) {
    let token = null;

    // 1. Check for token in Authorization: Bearer header (standard and preferred)
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    }

    // 2. Fallback: Check for token in x-access-token header (used in some legacy systems)
    if (!token && req.headers['x-access-token']) {
        token = req.headers['x-access-token'];
    }

    // 3. Fallback: Check for token in query parameter (least secure, use with caution for sensitive operations)
    if (!token && req.query.token) {
        token = req.query.token;
    }

    // If no token is found at all
    if (!token) {
        return res.status(403).json({ success: false, message: "Access token missing. Authentication required." });
    }

    // --- NEW LOGIC: Handle "DIRECT_REGISTRATION_SOURCE_ID" specifically ---
    // If the token is our special direct registration ID, allow it without JWT verification.
    if (token === "DIRECT_REGISTRATION_SOURCE_ID") {
        req.sourceTokenPayload = { sourceId: "DIRECT_REGISTRATION_SOURCE_ID" };
        return next(); // Proceed to the next middleware or route handler
    }

    // --- Original JWT Verification Logic (for actual JWTs) ---
    const decoded = verifyToken(token);

    // If verification fails (invalid, expired, etc.)
    if (!decoded) {
        return res.status(401).json({ success: false, message: "Invalid or expired token. Authentication failed." });
    }

    // Attach the decoded payload to the request object for downstream use
    req.sourceTokenPayload = decoded; // Contains info like { sourceId: "partner_a_id", iat: ..., exp: ... }

    // Proceed to the next middleware or route handler
    next();
}

module.exports = authMiddleware;
