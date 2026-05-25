const express = require('express');
const { query } = require('../config/db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

function mapRow(row) {
    return { _id: String(row.id), category: row.category, value: row.value };
}

router.get('/', async (req, res, next) => {
    try {
        const rows = await query('SELECT id, category, value FROM form_options ORDER BY category ASC, value ASC');
        res.json(rows.map(mapRow));
    } catch (err) {
        next(err);
    }
});

router.get('/:category', async (req, res, next) => {
    try {
        const rows = await query('SELECT id, category, value FROM form_options WHERE category = $1 ORDER BY value ASC', [req.params.category]);
        res.json(rows.map(mapRow));
    } catch (err) {
        next(err);
    }
});

router.post('/', requireAuth, async (req, res, next) => {
    try {
        await query('INSERT INTO form_options (category, value) VALUES ($1, $2) ON CONFLICT (category, value) DO NOTHING', [req.body.category, req.body.value]);
        res.status(201).json({ message: 'Option added successfully' });
    } catch (err) {
        next(err);
    }
});

router.delete('/:id', requireAuth, async (req, res, next) => {
    try {
        await query('DELETE FROM form_options WHERE id = $1', [req.params.id]);
        res.json({ message: 'Option deleted successfully' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
