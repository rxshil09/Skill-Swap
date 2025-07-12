const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendErrorResponse } = require('../utils/responseHelper');

// Protect routes - require authentication
const protect = async (req, res, next) => {
  let token;

  // Check for token in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  // Check for token in cookies
  else if (req.cookies.token) {
    token = req.cookies.token;
  }

  // Make sure token exists
  if (!token) {
    return sendErrorResponse(res, 'Not authorized to access this route', 401);
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from token
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return sendErrorResponse(res, 'No user found with this token', 404);
    }

    if (!user.isActive) {
      return sendErrorResponse(res, 'User account is deactivated', 401);
    }

    // Update last active
    user.updateLastActive();

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return sendErrorResponse(res, 'Not authorized to access this route', 401);
  }
};

// Grant access to specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return sendErrorResponse(
        res,
        `User role ${req.user.role} is not authorized to access this route`,
        403
      );
    }
    next();
  };
};

// Optional authentication - doesn't require token but adds user if present
const optionalAuth = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      
      if (user && user.isActive) {
        req.user = user;
        user.updateLastActive();
      }
    } catch (error) {
      // Token is invalid, but we continue without user
      console.log('Invalid token in optional auth:', error.message);
    }
  }

  next();
};

module.exports = {
  protect,
  authorize,
  optionalAuth
};