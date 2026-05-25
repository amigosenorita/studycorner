const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query, getOne } = require('../config/db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

function publicUser(row) {
    return {
        _id: String(row.id),
        name: row.name,
        email: row.email,
        role: row.role,
        createdAt: row.created_at
    };
}

async function ensureDefaultAdmin() {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    if (!email || !password) return;

    const existing = await getOne('SELECT id FROM admins WHERE email = $1 LIMIT 1', [email]);
    if (existing) return;

    const hash = await bcrypt.hash(password, 10);
    await query(
        'INSERT INTO admins (name, email, password_hash, role) VALUES ($1, $2, $3, $4)',
        ['Admin', email, hash, 'Admin']
    );
}

router.post('/login', async (req, res, next) => {
    try {
        await ensureDefaultAdmin();
        const { email, password } = req.body;
        const user = await getOne('SELECT * FROM admins WHERE email = $1 LIMIT 1', [email]);
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const ok = await bcrypt.compare(password, user.password_hash);
        if (!ok) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role, name: user.name },
            process.env.JWT_SECRET || 'change-me',
            { expiresIn: '1d' }
        );

        res.json({ token, role: user.role, name: user.name || user.email });
    } catch (err) {
        next(err);
    }
});

router.post('/register', requireAuth, async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;
        const existing = await getOne('SELECT id FROM admins WHERE email = $1 LIMIT 1', [email]);
        if (existing) return res.status(400).json({ message: 'Email already exists' });

        const hash = await bcrypt.hash(password, 10);
        await query(
            'INSERT INTO admins (name, email, password_hash, role) VALUES ($1, $2, $3, $4)',
            [name, email, hash, role || 'Admin']
        );
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        next(err);
    }
});

router.get('/users', requireAuth, async (req, res, next) => {
    try {
        const users = await query('SELECT id, name, email, role, created_at FROM admins ORDER BY created_at DESC');
        res.json(users.map(publicUser));
    } catch (err) {
        next(err);
    }
});

router.delete('/users/:id', requireAuth, async (req, res, next) => {
    try {
        await query('DELETE FROM admins WHERE id = $1', [req.params.id]);
        res.json({ message: 'User removed access / deleted' });
    } catch (err) {
        next(err);
    }
});

router.post('/change-password', requireAuth, async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await getOne('SELECT * FROM admins WHERE id = $1 LIMIT 1', [req.user.id]);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const ok = await bcrypt.compare(currentPassword, user.password_hash);
        if (!ok) return res.status(400).json({ message: 'Current password is incorrect' });

        const hash = await bcrypt.hash(newPassword, 10);
        await query('UPDATE admins SET password_hash = $1, updated_at = NOW() WHERE id = $2', [hash, req.user.id]);
        res.json({ message: 'Password updated successfully' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
