const express = require('express');
const { query } = require('../config/db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        const rows = await query('SELECT id AS _id, name FROM references_list ORDER BY name ASC');
        res.json(rows.map(row => ({ ...row, _id: String(row._id) })));
    } catch (err) {
        next(err);
    }
});

router.post('/', requireAuth, async (req, res, next) => {
    try {
        await query('INSERT INTO references_list (name) VALUES ($1) ON CONFLICT (name) DO NOTHING', [req.body.name]);
        res.status(201).json({ message: 'Reference added successfully' });
    } catch (err) {
        next(err);
    }
});

router.delete('/:id', requireAuth, async (req, res, next) => {
    try {
        await query('DELETE FROM references_list WHERE id = $1', [req.params.id]);
        res.json({ message: 'Reference deleted successfully' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
