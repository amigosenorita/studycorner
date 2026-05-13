const express = require('express');
const router = express.Router();
const FormOption = require('../models/FormOption');

// Get all options for a specific category
router.get('/:category', async (req, res) => {
    try {
        const options = await FormOption.find({ category: req.params.category });
        res.json(options);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add a new option
router.post('/', async (req, res) => {
    try {
        const { category, value } = req.body;
        if (!category || !value) return res.status(400).json({ message: 'Category and value are required' });
        const option = new FormOption({ category, value });
        await option.save();
        console.log(`[FormOption] Added: ${category} -> ${value}`);
        res.status(201).json(option);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete an option
router.delete('/:id', async (req, res) => {
    try {
        const option = await FormOption.findByIdAndDelete(req.params.id);
        if (!option) return res.status(404).json({ message: 'Option not found' });
        res.json({ message: 'Option removed' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
