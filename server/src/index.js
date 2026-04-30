/**
 * MAIN SERVER FILE
 * Initialize Express, MongoDB, and API routes
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Initialize Express app
const app = express();

// ============================================
// MIDDLEWARE
// ============================================

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// CORS Configuration
const corsOptions = {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

// ============================================
// DATABASE CONNECTION
// ============================================

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        return true;
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        // Retry connection after 5 seconds
        setTimeout(connectDB, 5000);
    }
};

connectDB();

// ============================================
// ROUTES
// ============================================

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString(),
    });
});

// API Routes
const authRoutes = require('./routes/authRoutes');
const loanRoutes = require('./routes/loanRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/loans', loanRoutes);

// ============================================
// ROOT ROUTE
// ============================================

app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Countdown API - Lock-Screen First Debt Freedom App',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            loans: '/api/loans',
            health: '/health',
        },
    });
});

// ============================================
// ERROR HANDLING
// ============================================

// 404 Not Found
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found',
        path: req.originalUrl,
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);

    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err : {},
    });
});

// ============================================
// START SERVER
// ============================================

const PORT = process.env.PORT || 5001;

const server = app.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════════╗
║   🚀 Countdown Server Starting              ║
║   PORT: ${PORT}                               ║
║   ENV: ${process.env.NODE_ENV || 'development'}                         ║
║   API: http://localhost:${PORT}           ║
╚══════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        mongoose.connection.close(false, () => {
            console.log('MongoDB connection closed');
            process.exit(0);
        });
    });
});

module.exports = app;
