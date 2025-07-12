const User = require('../models/User');
const { sendSuccessResponse, sendErrorResponse } = require('../utils/responseHelper');
const { 
  generateAccessToken, 
  generateRefreshToken, 
  verifyRefreshToken,
  setTokenCookies,
  clearTokenCookies 
} = require('../utils/tokenHelper');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendErrorResponse(res, 'User already exists with this email', 400);
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password
    });

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Save refresh token to user
    user.refreshTokens.push({ token: refreshToken });
    await user.save();

    // Set cookies
    setTokenCookies(res, accessToken, refreshToken);

    // Remove password from response
    user.password = undefined;

    sendSuccessResponse(res, {
      user,
      token: accessToken
    }, 'User registered successfully', 201);

  } catch (error) {
    console.error('Register error:', error);
    sendErrorResponse(res, 'Error registering user', 500);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user and include password
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return sendErrorResponse(res, 'Invalid credentials', 401);
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return sendErrorResponse(res, 'Invalid credentials', 401);
    }

    // Check if user is active
    if (!user.isActive) {
      return sendErrorResponse(res, 'Account is deactivated', 401);
    }

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Save refresh token to user
    user.refreshTokens.push({ token: refreshToken });
    await user.save();

    // Set cookies
    setTokenCookies(res, accessToken, refreshToken);

    // Update last active
    user.updateLastActive();

    // Remove password from response
    user.password = undefined;

    sendSuccessResponse(res, {
      user,
      token: accessToken
    }, 'Login successful');

  } catch (error) {
    console.error('Login error:', error);
    sendErrorResponse(res, 'Error logging in', 500);
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      // Remove refresh token from user
      await User.findByIdAndUpdate(req.user._id, {
        $pull: { refreshTokens: { token: refreshToken } }
      });
    }

    // Clear cookies
    clearTokenCookies(res);

    sendSuccessResponse(res, null, 'Logout successful');

  } catch (error) {
    console.error('Logout error:', error);
    sendErrorResponse(res, 'Error logging out', 500);
  }
};

// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public
const refreshToken = async (req, res) => {
  try {
    const { refreshToken: token } = req.cookies;

    if (!token) {
      return sendErrorResponse(res, 'Refresh token not provided', 401);
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(token);

    // Find user and check if refresh token exists
    const user = await User.findOne({
      _id: decoded.id,
      'refreshTokens.token': token
    });

    if (!user) {
      return sendErrorResponse(res, 'Invalid refresh token', 401);
    }

    // Generate new tokens
    const newAccessToken = generateAccessToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    // Remove old refresh token and add new one
    user.refreshTokens = user.refreshTokens.filter(rt => rt.token !== token);
    user.refreshTokens.push({ token: newRefreshToken });
    await user.save();

    // Set new cookies
    setTokenCookies(res, newAccessToken, newRefreshToken);

    sendSuccessResponse(res, {
      token: newAccessToken
    }, 'Token refreshed successfully');

  } catch (error) {
    console.error('Refresh token error:', error);
    sendErrorResponse(res, 'Invalid refresh token', 401);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    sendSuccessResponse(res, { user }, 'User data retrieved successfully');
  } catch (error) {
    console.error('Get me error:', error);
    sendErrorResponse(res, 'Error retrieving user data', 500);
  }
};

// @desc    Verify token
// @route   GET /api/auth/verify
// @access  Private
const verifyToken = async (req, res) => {
  try {
    sendSuccessResponse(res, { 
      user: req.user,
      isValid: true 
    }, 'Token is valid');
  } catch (error) {
    console.error('Verify token error:', error);
    sendErrorResponse(res, 'Error verifying token', 500);
  }
};

module.exports = {
  register,
  login,
  logout,
  refreshToken,
  getMe,
  verifyToken
};