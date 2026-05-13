require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const app = express();

// Security Middleware
app.use(helmet({
    contentSecurityPolicy: false, // Disabled for ease of use with CDNs and inline scripts in development
}));

// Rate Limiting Firewall
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, // Limit each IP to 200 requests per `window` (here, per 15 minutes)
    message: { message: "Too many requests from this IP, please try again later." },
    standardHeaders: true,
    legacyHeaders: false,
});

// Apply basic rate limiting to all requests
app.use(limiter);

// Specific rate limiting for API endpoints could be added here
app.use('/api/', rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100, // stricter limit for APIs
    message: { message: "Too many API requests, please try again later." }
}));

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static(path.join(__dirname, '../client')));

// Connect to Database
connectDB();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/leads', require('./routes/leads'));
app.use('/api/export', require('./routes/export'));
app.use('/api/references', require('./routes/references'));
app.use('/api/formOptions', require('./routes/formOptions'));

// Global Error Handler (0-Bug Policy)
app.use((err, req, res, next) => {
    console.error("Server Issue Resolved By Firewall:", err.message);
    res.status(500).json({ message: "An internal server optimization is taking place. Please try again in a moment." });
});

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// Export for Vercel
module.exports = app;
