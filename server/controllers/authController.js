// ========================================
// AUTHENTICATION CONTROLLER
// ========================================
// Handles user signup and login operations.
// Responsible for password hashing, JWT token generation, and user verification.

// Import required packages
const User = require('../models/User');           // User database model
const bcrypt = require('bcryptjs');               // Password hashing library
const jwt = require('jsonwebtoken');              // JWT token generation

// ========================================
// SIGNUP FUNCTION
// ========================================
// Route: POST /api/auth/signup
// Purpose: Create a new user account with email and password
// Request body: { name, email, password }
// Response: { token, user: { id, name, email } }
exports.signup = async (req, res) => {
  try {
    // Step 1: Extract user input from request body
    const { name, email, password } = req.body;

    // Step 2: Check if user with this email already exists in database
    let user = await User.findOne({ email });
    if (user) {
      // User already exists, return error
      return res.status(400).json({ message: 'User already exists' });
    }

    // Step 3: Hash the password for security
    // bcrypt.genSalt(10) creates a random salt with 10 rounds of hashing
    const salt = await bcrypt.genSalt(10);
    // Hash the password using the salt (prevents storing plain text passwords)
    const passwordHash = await bcrypt.hash(password, salt);

    // Step 4: Create a new User document with hashed password
    user = new User({
      name,                // User's full name
      email,               // User's email (unique identifier)
      passwordHash,        // Hashed password (never store plain text!)
    });

    // Step 5: Save the new user to MongoDB
    await user.save();

    // Step 6: Generate JWT token for authentication
    // JWT payload contains userId (used in authMiddleware)
    // Token expires in 7 days
    const token = jwt.sign(
      { userId: user._id },                      // Payload: user ID
      process.env.JWT_SECRET,                    // Secret key for signing (from .env)
      { expiresIn: '7d' }                        // Token validity period
    );

    // Step 7: Send response to frontend with token and user info
    res.status(201).json({
      token,                                      // JWT token to store in localStorage
      user: { id: user._id, name, email }        // User details for frontend
    });
  } catch (err) {
    // Handle any errors during signup
    console.error(err.message);
    res.status(500).json({ message: 'Server error', details: err.message });
  }
};

// ========================================
// LOGIN FUNCTION
// ========================================
// Route: POST /api/auth/login
// Purpose: Authenticate user and issue JWT token
// Request body: { email, password }
// Response: { token, user: { id, name, email } }
exports.login = async (req, res) => {
  try {
    // Step 1: Extract email and password from request body
    const { email, password } = req.body;

    // Step 2: Find user by email in database
    const user = await User.findOne({ email });
    if (!user) {
      // Email not found in system
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Step 3: Verify password by comparing with stored hash
    // bcrypt.compare() automatically handles salt and comparison
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      // Password doesn't match the stored hash
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Step 4: Generate JWT token for this user
    const token = jwt.sign(
      { userId: user._id },                      // Payload: user ID
      process.env.JWT_SECRET,                    // Secret key for signing
      { expiresIn: '7d' }                        // Token expires in 7 days
    );

    // Step 5: Send response with token and user info
    res.json({
      token,                                      // JWT token to store in localStorage
      user: { id: user._id, name: user.name, email }  // User details
    });
  } catch (err) {
    // Handle any errors during login
    console.error(err.message);
    res.status(500).json({ message: 'Server error', details: err.message });
  }
};
