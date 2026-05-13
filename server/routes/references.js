const express = require('express');
const router = express.Router();
const Reference = require('../models/Reference');

// Get all references
router.get('/', async (req, res) => {
    try {
        const references = await Reference.find();
        res.json(references);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add a new reference
router.post('/', async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ message: 'Reference name is required' });
        const reference = new Reference({ name });
        await reference.save();
        res.status(201).json(reference);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a reference
router.delete('/:id', async (req, res) => {
    try {
        const reference = await Reference.findByIdAndDelete(req.params.id);
        if (!reference) return res.status(404).json({ message: 'Reference not found' });
        res.json({ message: 'Reference removed' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
