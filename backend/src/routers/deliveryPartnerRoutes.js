const express = require('express');
const router = express.Router();
const adminAuthMiddleware = require('../middlewares/adminAuthMiddleware');
const DeliveryPartner = require('../models/DeliveryPartner');
// Admin: Get all delivery partners 
router.get('/admin', adminAuthMiddleware, async (req, res) => {
    try {
        const partners = await DeliveryPartner.find();
        res.status(200).json(partners);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch delivery partners', error: error.message });
    }
}); module.exports = router;