const express = require('express');
const router = express.Router();
const Registration = require('../models/Registration');

// Route to get all registrations for a specific domain
router.get('/domain/:domain', async (req, res) => {
    try {
        const { domain } = req.params;
        const registrations = await Registration.find({ sourceSite: domain }).sort({ registrationDate: -1 });
        res.status(200).json(registrations);
    } catch (error) {
        console.error("Error fetching registrations by domain:", error);
        res.status(500).json({ message: "Failed to fetch registrations", error: error.message });
    }
});

// Route to get all registrations across all domains (optional, if needed for admin dashboard)
router.get('/', async (req, res) => {
    try {
        const registrations = await Registration.find().sort({ registrationDate: -1 });
        res.status(200).json(registrations);
    } catch (error) {
        console.error("Error fetching all registrations:", error);
        res.status(500).json({ message: "Failed to fetch registrations", error: error.message });
    }
});

module.exports = router;
