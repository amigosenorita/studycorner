const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');
const sendWhatsAppMessage = require('../utils/whatsapp');

// Create a new lead (Admission Form Submission)
router.post('/', async (req, res) => {
    try {
        const lead = new Lead(req.body);
        await lead.save();

        // Trigger WhatsApp Message
        sendWhatsAppMessage(lead.mobile, lead.studentName);

        res.status(201).json({ message: 'Admission form submitted successfully', lead });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all leads
router.get('/', async (req, res) => {
    try {
        const leads = await Lead.find(req.query).sort({ createdAt: -1 });
        res.json(leads);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get dashboard analytics
router.get('/analytics', async (req, res) => {
    try {
        const totalLeads = await Lead.countDocuments(req.query);

        // Count by course
        const courseDistribution = await Lead.aggregate([
            { $group: { _id: "$preferredCourse", count: { $sum: 1 } } }
        ], req.query);

        // Status Funnel
        const funnel = await Lead.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ], req.query);

        res.json({ totalLeads, courseDistribution, funnel });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update lead status
router.put('/:id', async (req, res) => {
    try {
        const lead = await Lead.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
        res.json(lead);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete lead
router.delete('/:id', async (req, res) => {
    try {
        const lead = await Lead.findByIdAndDelete(req.params.id);
        if (lead) {
            res.json({ message: 'Lead deleted successfully' });
        } else {
            res.status(404).json({ error: 'Lead not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
