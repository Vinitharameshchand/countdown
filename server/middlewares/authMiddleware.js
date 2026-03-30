// ========================================
// AUTHENTICATION MIDDLEWARE
// ========================================
// This middleware verifies JWT tokens on protected routes.
// Runs before every API endpoint to ensure user is authenticated.
// Extracts userId from token and attaches to request object.

const jwt = require('jsonwebtoken');

// Export middleware function (used in routes)
module.exports = (req, res, next) => {
  // Step 1: Extract Authorization header from request
  // Format expected: "Bearer <token>"
  const authHeader = req.header('Authorization');
  // Split by space and take the second part (token)
  const token = authHeader && authHeader.split(' ')[1];

  // Step 2: Check if token exists
  if (!token) {
    // No token provided, user is not authenticated
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  // Step 3: Verify and decode JWT token
  try {
    // jwt.verify() checks token signature and expiration
    // Returns decoded payload if valid
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Step 4: Attach decoded user info to request object
    // decoded = { userId, iat (issued at), exp (expiration) }
    // This makes userId available in controllers via req.user.userId
    req.user = decoded;

    // Step 5: Call next middleware/route handler
    next();
  } catch (err) {
    // Token is invalid or expired
    res.status(401).json({ message: 'Token is not valid' });
  }
};
