// // routes/visitorCountRoutes.js

// const express = require("express");
// const { getDb } = require("../utils/db"); // Import the getDb function
// const { v4: uuidv4 } = require("uuid");    // For generating unique IDs for cookies

// const router = express.Router();

// /**
//  * Extracts the subdomain from the request host header.
//  * E.g., for 'pharmatech.helixconferences.com', it returns 'pharmatech'.
//  * For 'helixconferences.com', it returns 'main' or a default identifier.
//  * @param {string} hostHeader - The Host header from the request (e.g., req.headers.host)
//  * @returns {string} The extracted subdomain or a default identifier.
//  */
// function getSubdomainFromHost(hostHeader) {
//     if (!hostHeader) {
//         return 'unknown';
//     }
//     // Remove port if present (e.g., 'localhost:3001')
//     const domain = hostHeader.split(':')[0];

//     // For 'helixconferences.com' and its subdomains
//     const parts = domain.split('.');
//     if (parts.length >= 3 && parts[parts.length - 2] === 'helixconferences' && parts[parts.length - 1] === 'com') {
//         // This handles cases like 'pharmatech.helixconferences.com' -> 'pharmatech'
//         return parts[0];
//     } else if (parts.length === 2 && parts[0] === 'helixconferences' && parts[1] === 'com') {
//         // This handles the main domain 'helixconferences.com'
//         return 'main'; // Use 'main' or 'www' for the primary domain
//     } else if (domain === 'localhost') {
//         // Handle localhost during development. You might map different ports
//         // to different 'subdomains' for local testing if needed, or just use 'localhost'.
//         return 'localhost';
//     }
//     // Fallback for any other unexpected domains
//     return 'other';
// }

// /**
//  * Middleware for the visitor counter.
//  * This function runs for every request hitting these routes and handles:
//  * 1. Extracting the subdomain.
//  * 2. Updating total and unique visit counts in the SQLite database.
//  * 3. Managing unique visitor cookies.
//  */
// router.use(async (req, res, next) => {
//     try {
//         const db = getDb(); // Get the initialized database instance
//         const subdomain = getSubdomainFromHost(req.headers.host);

//         // --- Fetch current counts for this subdomain ---
//         const getSql = `SELECT total_visits, unique_visits FROM subdomain_visits WHERE subdomain = ?`;
//         let row = await new Promise((resolve, reject) => {
//             db.get(getSql, [subdomain], (err, row) => {
//                 if (err) reject(err);
//                 else resolve(row);
//             });
//         });

//         let currentTotalVisits = 1000;
//         let currentUniqueVisits = 620;

//         if (row) {
//             currentTotalVisits = row.total_visits;
//             currentUniqueVisits = row.unique_visits;
//         }

//         // --- Increment total visits ---
//         currentTotalVisits += 1;

//         // --- Unique Visitor Logic (Using Cookies) ---
//         let uniqueVisitorId = req.cookies.uniqueVisitorId;

//         if (!uniqueVisitorId) {
//             // New unique visitor for this browser/device
//             uniqueVisitorId = uuidv4(); // Generate a new universally unique ID
//             res.cookie('uniqueVisitorId', uniqueVisitorId, {
//                 maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year expiry
//                 httpOnly: true, // Prevents client-side script access
//                 // secure: process.env.NODE_ENV === 'production', // Uncomment for HTTPS in production
//                 sameSite: 'Lax', // Recommended for CSRF protection
//             });
//             currentUniqueVisits += 1; // Increment unique count
//         }
//         // --- End Unique Visitor Logic ---

//         // --- Update/Insert counts in the database ---
//         // Use INSERT OR REPLACE to either insert a new row or update an existing one
//         const updateSql = `
//             INSERT INTO subdomain_visits (subdomain, total_visits, unique_visits)
//             VALUES (?, ?, ?)
//             ON CONFLICT(subdomain) DO UPDATE SET
//                 total_visits = excluded.total_visits,
//                 unique_visits = excluded.unique_visits;
//         `;
//         await new Promise((resolve, reject) => {
//             db.run(updateSql, [subdomain, currentTotalVisits, currentUniqueVisits], function(err) {
//                 if (err) reject(err);
//                 else resolve();
//             });
//         });

//         // Attach updated counts to the request object so later handlers can access them if needed
//         req.visitorCounts = {
//             totalVisits: currentTotalVisits,
//             uniqueVisits: currentUniqueVisits
//         };

//         console.log(`[VisitorCounter] Subdomain: ${subdomain}, Total: ${currentTotalVisits}, Unique: ${currentUniqueVisits}`);

//     } catch (error) {
//         console.error('[VisitorCounter Middleware Error]:', error);
//         // Do not block the request, but log the error.
//         // You might want to handle this more gracefully, e.g., send an internal server error to the client,
//         // but for a counter, allowing the main request to proceed might be preferred.
//     } finally {
//         next(); // IMPORTANT: Call next() to pass control to the actual route handler
//     }
// });

// /**
//  * POST /api/record-visit
//  * This endpoint is hit by the frontend to record a visit.
//  * The actual counting logic is handled by the `router.use` middleware above.
//  * This route just returns the updated counts that were set by the middleware.
//  */
// router.post("/record-visit", (req, res) => {
//     // The counts are already updated and attached to req.visitorCounts by the middleware
//     res.status(200).json({
//         message: "Visit recorded successfully",
//         totalVisits: req.visitorCounts ? req.visitorCounts.totalVisits : 1000, // Fallback if middleware failed
//         uniqueVisits: req.visitorCounts ? req.visitorCounts.uniqueVisits : 430, // Fallback if middleware failed
//     });
// });

// /**
//  * GET /api/get-visits
//  * This endpoint allows fetching the current total and unique visit counts for a subdomain
//  * without incrementing them again.
//  */
// router.get("/get-visits", async (req, res) => {
//     try {
//         const db = getDb();
//         const subdomain = getSubdomainFromHost(req.headers.host);

//         const getSql = `SELECT total_visits, unique_visits FROM subdomain_visits WHERE subdomain = ?`;
//         const row = await new Promise((resolve, reject) => {
//             db.get(getSql, [subdomain], (err, row) => {
//                 if (err) reject(err);
//                 else resolve(row);
//             });
//         });

//         if (row) {
//             res.status(200).json({
//                 totalVisits: row.total_visits,
//                 uniqueVisits: row.unique_visits,
//             });
//         } else {
//             // If no entry exists for this subdomain yet
//             res.status(200).json({ totalVisits: 1000, uniqueVisits: 578 });
//         }
//     } catch (error) {
//         console.error('[GET /api/get-visits Error]:', error);
//         res.status(500).json({ message: 'Internal server error while fetching visits' });
//     }
// });

// module.exports = router;




// routes/visitorCountRoutes.js

const express = require("express");
const { getDb } = require("../utils/db"); // Import the getDb function
const { v4: uuidv4 } = require("uuid");    // For generating unique IDs for cookies

const router = express.Router();

/**
 * Extracts the subdomain from the request host header.
 * E.g., for 'pharmatech.helixconferences.com', it returns 'pharmatech'.
 * For 'helixconferences.com', it returns 'main' or a default identifier.
 * @param {string} hostHeader - The Host header from the request (e.g., req.headers.host)
 * @returns {string} The extracted subdomain or a default identifier.
 */
function getSubdomainFromHost(hostHeader) {
    if (!hostHeader) {
        return 'unknown';
    }
    // Remove port if present (e.g., 'localhost:3001')
    const domain = hostHeader.split(':')[0];

    // For 'helixconferences.com' and its subdomains
    const parts = domain.split('.');
    if (parts.length >= 3 && parts[parts.length - 2] === 'helixconferences' && parts[parts.length - 1] === 'com') {
        // This handles cases like 'pharmatech.helixconferences.com' -> 'pharmatech'
        return parts[0];
    } else if (parts.length === 2 && parts[0] === 'helixconferences' && parts[1] === 'com') {
        // This handles the main domain 'helixconferences.com'
        return 'main'; // Use 'main' or 'www' for the primary domain
    } else if (domain === 'localhost') {
        // Handle localhost during development. You might map different ports
        // to different 'subdomains' for local testing if needed, or just use 'localhost'.
        return 'localhost';
    }
    // Fallback for any other unexpected domains
    return 'other';
}

/**
 * Middleware: This runs for any request hitting routes in this router.
 * Its primary purpose here is to extract the subdomain and
 * set a unique visitor cookie if it doesn't exist.
 * The actual incrementing and DB writing will happen in the specific POST route.
 */
router.use(async (req, res, next) => {
    // Attach the subdomain to the request object for easy access in route handlers
    req.subdomain = getSubdomainFromHost(req.headers.host);

    // --- Unique Visitor Cookie Management (only sets cookie, doesn't increment DB here) ---
    let uniqueVisitorId = req.cookies.uniqueVisitorId;
    if (!uniqueVisitorId) {
        uniqueVisitorId = uuidv4(); // Generate a new universally unique ID
        res.cookie('uniqueVisitorId', uniqueVisitorId, {
            maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year expiry
            httpOnly: true, // Prevents client-side script access
            // secure: process.env.NODE_ENV === 'production', // Uncomment for HTTPS in production
            sameSite: 'Lax', // Recommended for CSRF protection
        });
    }
    next(); // IMPORTANT: Pass control to the next middleware or route handler
});

/**
 * POST /api/record-visit
 * This endpoint is hit by the frontend to record a visit.
 * This is where the total and unique visit counts are incremented and persisted.
 */
router.post("/record-visit", async (req, res) => {
    try {
        const db = getDb();
        const subdomain = req.subdomain; // Get subdomain from middleware

        // --- Fetch current counts for this subdomain ---
        const getSql = `SELECT total_visits, unique_visits FROM subdomain_visits WHERE subdomain = ?`;
        let row = await new Promise((resolve, reject) => {
            db.get(getSql, [subdomain], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });

        // Set initial values if no row exists for this subdomain
        let currentTotalVisits = 1092; // Initial value for new subdomains
        let currentUniqueVisits = 689;  // Initial value for new subdomains

        if (row) {
            // If a row exists, use the values from the database
            currentTotalVisits = row.total_visits;
            currentUniqueVisits = row.unique_visits;
        }

        // --- Increment total visits (only here, per explicit POST request) ---
        currentTotalVisits += 1;

        // --- Increment Unique Visitor count (only if new cookie was set) ---
        // Check if the uniqueVisitorId cookie was NOT present on this request
        // (meaning it was just set by the router.use middleware for a new unique visitor)
        // This ensures the unique count only increments once per unique visitor.
        if (!req.cookies.uniqueVisitorId) {
            currentUniqueVisits += 1;
        }

        // --- Update/Insert counts in the database ---
        const updateSql = `
            INSERT INTO subdomain_visits (subdomain, total_visits, unique_visits)
            VALUES (?, ?, ?)
            ON CONFLICT(subdomain) DO UPDATE SET
                total_visits = excluded.total_visits,
                unique_visits = excluded.unique_visits;
        `;
        await new Promise((resolve, reject) => {
            db.run(updateSql, [subdomain, currentTotalVisits, currentUniqueVisits], function(err) {
                if (err) reject(err);
                else resolve();
            });
        });

        console.log(`[VisitorCounter] Subdomain: ${subdomain}, Total: ${currentTotalVisits}, Unique: ${currentUniqueVisits}`);

        res.status(200).json({
            message: "Visit recorded successfully",
            totalVisits: currentTotalVisits, // Send back the actual updated values
            uniqueVisits: currentUniqueVisits, // Send back the actual updated values
        });

    } catch (error) {
        console.error('[POST /api/record-visit Error]:', error);
        res.status(500).json({
            message: 'Internal server error while recording visit',
            totalVisits: 1092, // Fallback in case of error
            uniqueVisits: 689,  // Fallback in case of error
        });
    }
});

/**
 * GET /api/get-visits
 * This endpoint allows fetching the current total and unique visit counts for a subdomain
 * without incrementing them again.
 */
router.get("/get-visits", async (req, res) => {
    try {
        const db = getDb();
        const subdomain = req.subdomain; // Get subdomain from middleware

        const getSql = `SELECT total_visits, unique_visits FROM subdomain_visits WHERE subdomain = ?`;
        const row = await new Promise((resolve, reject) => {
            db.get(getSql, [subdomain], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });

        if (row) {
            res.status(200).json({
                totalVisits: row.total_visits,
                uniqueVisits: row.unique_visits,
            });
        } else {
            // If no entry exists for this subdomain yet, return the desired initial values
            res.status(200).json({ totalVisits: 1092, uniqueVisits: 689 }); // Fallback for GET request
        }
    } catch (error) {
        console.error('[GET /api/get-visits Error]:', error);
        res.status(500).json({ message: 'Internal server error while fetching visits' });
    }
});

module.exports = router;
