require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

const app = express();

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ limit: '25mb', extended: true }));

app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false
}));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/leads', require('./routes/leads'));
app.use('/api/references', require('./routes/references'));
app.use('/api/formOptions', require('./routes/formOptions'));

app.use(express.static(path.join(__dirname, '../client')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'));
});

app.use((err, req, res, next) => {
    console.error(err);
    const isDev = process.env.NODE_ENV !== 'production';
    res.status(500).json({
        message: isDev ? err.message : 'Server error. Please try again.'
    });
});

const PORT = process.env.PORT || 5000;

if (require.main === module) {
    app.listen(PORT, () => console.log(`Admission CRM running on http://localhost:${PORT}`));
}

module.exports = app;
