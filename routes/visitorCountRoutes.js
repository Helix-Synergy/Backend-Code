const express = require("express");
const { v4: uuidv4 } = require("uuid");
const VisitorCount = require("../models/VisitorCount");

const router = express.Router();

/**
 * Extracts the subdomain from the request host header.
 */
function getSubdomainFromRequest(req) {
    // Prefer origin or referer for cross-origin API requests from the frontend
    let urlString = req.headers.origin || req.headers.referer || req.headers.host;
    if (!urlString) return 'unknown';
    
    // Clean up the URL: remove http://, https://, paths, and ports
    let domain = urlString.replace(/^https?:\/\//, '').split('/')[0].split(':')[0];
    
    const parts = domain.split('.');
    
    if (parts.length >= 3 && parts[parts.length - 2] === 'helixconferences' && parts[parts.length - 1] === 'com') {
        return parts[0];
    } else if (parts.length === 2 && parts[0] === 'helixconferences' && parts[1] === 'com') {
        return 'main';
    } else if (domain === 'localhost') {
        return 'localhost';
    }
    return 'other';
}

/**
 * Middleware: Extracts subdomain and manages unique visitor cookie.
 */
router.use(async (req, res, next) => {
    req.subdomain = getSubdomainFromRequest(req);

    let uniqueVisitorId = req.cookies.uniqueVisitorId;
    if (!uniqueVisitorId) {
        uniqueVisitorId = uuidv4();
        res.cookie('uniqueVisitorId', uniqueVisitorId, {
            maxAge: 365 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: 'Lax',
        });
    }
    next();
});

/**
 * POST /api/record-visit
 * Records a visit and increments MongoDB counts.
 */
router.post("/record-visit", async (req, res) => {
    try {
        const subdomain = req.subdomain;
        const isNewVisitor = !req.cookies.uniqueVisitorId;

        const update = { $inc: { total_visits: 1 } };
        if (isNewVisitor) {
            update.$inc.unique_visits = 1;
        }

        const updatedCounts = await VisitorCount.findOneAndUpdate(
            { subdomain },
            update,
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        console.log(`[VisitorCounter] Subdomain: ${subdomain}, Total: ${updatedCounts.total_visits}, Unique: ${updatedCounts.unique_visits}`);

        res.status(200).json({
            message: "Visit recorded successfully",
            totalVisits: updatedCounts.total_visits,
            uniqueVisits: updatedCounts.unique_visits,
        });

    } catch (error) {
        console.error('[POST /api/record-visit Error]:', error);
        res.status(500).json({
            message: 'Internal server error while recording visit',
            totalVisits: 1000,
            uniqueVisits: 600,
        });
    }
});

/**
 * GET /api/get-visits
 * Fetches current counts from MongoDB.
 */
router.get("/get-visits", async (req, res) => {
    try {
        const subdomain = req.subdomain;
        const counts = await VisitorCount.findOne({ subdomain });

        if (counts) {
            res.status(200).json({
                totalVisits: counts.total_visits,
                uniqueVisits: counts.unique_visits,
            });
        } else {
            res.status(200).json({ totalVisits: 1000, uniqueVisits: 600 });
        }
    } catch (error) {
        console.error('[GET /api/get-visits Error]:', error);
        res.status(500).json({ message: 'Internal server error while fetching visits' });
    }
});

module.exports = router;
