// Backend for Helix/routes/sourceRoutes.js
const express = require('express');
const router = express.Router();
const sourceController = require('../controllers/sourceController');
// const authMiddleware = require('../middlewares/authMiddleware'); // <--- COMMENT OUT OR REMOVE THIS LINE

// Public route for external websites to request a source token
// Expects sourceId and conferenceType as QUERY parameters (e.g., /generate-token?sourceId=ABC&conferenceType=hybrid)
// CHANGED TO .GET
router.get('/generate-token', sourceController.generateSourceToken); // <-- Changed from /get-source-token and .post

// Public endpoint for your React app to explicitly verify a source token if needed.
// This route should NOT be protected by authMiddleware as it's for initial source verification.
// REMOVED authMiddleware
router.get('/verify-token', sourceController.verifySourceToken); // <-- Removed authMiddleware

module.exports = router;


// // Backend for Helix/routes/sourceRoutes.js
// const express = require('express');
// const router = express.Router();
// const sourceController = require('../controllers/sourceController');

// // Add this new POST route
// router.post('/get-source-token', sourceController.generateSourceToken); // Or create a new function if logic differs

// // Existing GET route
// router.get('/generate-token', sourceController.generateSourceToken); // Keep this if other parts of frontend use it

// // Existing verify route
// router.get('/verify-token', sourceController.verifySourceToken);

// module.exports = router;