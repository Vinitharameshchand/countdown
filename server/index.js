// ========================================
// COUNTDOWN: BACKEND SERVER ENTRY POINT
// ========================================
// This file initializes the Express server and connects it to MongoDB.
// All API routes are registered here, and the server starts listening for requests.

// Load environment variables from .env file
require('dotenv').config();

// Import required packages
const express = require('express');              // Web framework
const mongoose = require('mongoose');            // MongoDB ODM (Object Data Modeling)
const cors = require('cors');                    // Enable Cross-Origin Resource Sharing
const helmet = require('helmet');                // Security headers middleware (currently disabled)
const morgan = require('morgan');                // HTTP request logger (currently disabled)

const app = express();
const PORT = process.env.PORT || 5000;           // Server port (default 5000)

// ========== MIDDLEWARE CONFIGURATION ==========
// CORS: Allow requests from any origin (you may want to restrict this in production)
app.use(cors({ origin: '*' }));

// Parse incoming JSON request bodies and make them available in req.body
app.use(express.json());

// Note: These are commented out but available for security/logging:
// app.use(helmet());    // Add security headers to HTTP responses
// app.use(morgan('dev')); // Log HTTP requests in development format

// ========== DATABASE CONNECTION ==========
// Connect to MongoDB using Mongoose
// The database connection is established when the server starts
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/countdown')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// ========== API ROUTES ==========
// Register all route handlers for different features
// Each route is protected by authMiddleware (JWT verification) - see individual route files

// Authentication routes: /api/auth/signup, /api/auth/login
app.use('/api/auth', require('./routes/authRoutes'));

// Income management routes: /api/income/get, /api/income/add, /api/income/delete
app.use('/api/income', require('./routes/incomeRoutes'));

// Expense management routes: /api/expense/get, /api/expense/add, /api/expense/delete
app.use('/api/expense', require('./routes/expenseRoutes'));

// Loan management routes: /api/loan/create, /api/loan/get, /api/loan/pay-emi, /api/loan/simulate
app.use('/api/loan', require('./routes/loanRoutes'));

// ========== SERVER STARTUP ==========
// Start listening for incoming HTTP requests
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`MongoDB URI: ${process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/countdown'}`);
});
