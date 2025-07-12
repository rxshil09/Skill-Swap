const User = require('../models/User');
const { sendSuccessResponse, sendErrorResponse, sendPaginatedResponse } = require('../utils/responseHelper');
const path = require('path');
const fs = require('fs');

// @desc    Get user profile
// @route   GET /api/users/profile/:id?
// @access  Public
const getUserProfile = async (req, res) => {
  try {
    const userId = req.params.id || req.user?._id;

    if (!userId) {
      return sendErrorResponse(res, 'User ID is required', 400);
    }

    const user = await User.findById(userId).select('-password -refreshTokens');

    if (!user) {
      return sendErrorResponse(res, 'User not found', 404);
    }

    sendSuccessResponse(res, { user }, 'User profile retrieved successfully');
  } catch (error) {
    console.error('Get user profile error:', error);
    sendErrorResponse(res, 'Error retrieving user profile', 500);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const allowedFields = ['name', 'bio', 'location', 'website', 'phone', 'skillsOffered', 'skillsWanted'];
    const updates = {};

    // Only include allowed fields
    Object.keys(req.body).forEach(key => {
      if (allowedFields.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      {
        new: true,
        runValidators: true
      }
    ).select('-password -refreshTokens');

    if (!user) {
      return sendErrorResponse(res, 'User not found', 404);
    }

    sendSuccessResponse(res, { user }, 'Profile updated successfully');
  } catch (error) {
    console.error('Update profile error:', error);
    sendErrorResponse(res, 'Error updating profile', 500);
  }
};

// @desc    Upload user avatar
// @route   POST /api/users/avatar
// @access  Private
const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return sendErrorResponse(res, 'Please upload an image file', 400);
    }

    // Get current user
    const user = await User.findById(req.user._id);

    // Delete old avatar if it exists and is not default
    if (user.avatar && user.avatar !== 'default-avatar.png') {
      const oldAvatarPath = path.join('uploads/avatars', user.avatar);
      if (fs.existsSync(oldAvatarPath)) {
        fs.unlinkSync(oldAvatarPath);
      }
    }

    // Update user avatar
    user.avatar = req.file.filename;
    await user.save();

    const avatarUrl = `${req.protocol}://${req.get('host')}/uploads/avatars/${req.file.filename}`;

    sendSuccessResponse(res, {
      avatar: user.avatar,
      avatarUrl
    }, 'Avatar uploaded successfully');

  } catch (error) {
    console.error('Upload avatar error:', error);
    
    // Delete uploaded file if error occurs
    if (req.file) {
      const filePath = req.file.path;
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    sendErrorResponse(res, 'Error uploading avatar', 500);
  }
};

// @desc    Get all users with pagination and search
// @route   GET /api/users
// @access  Public
const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const skillCategory = req.query.category || '';
    const location = req.query.location || '';

    // Build query
    const query = { isActive: true };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { 'skillsOffered.name': { $regex: search, $options: 'i' } },
        { 'skillsWanted.name': { $regex: search, $options: 'i' } }
      ];
    }

    if (skillCategory) {
      query.$or = [
        { 'skillsOffered.category': skillCategory },
        { 'skillsWanted.category': skillCategory }
      ];
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    // Execute query with pagination
    const users = await User.find(query)
      .select('-password -refreshTokens')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    sendPaginatedResponse(res, users, { page, limit, total }, 'Users retrieved successfully');
  } catch (error) {
    console.error('Get users error:', error);
    sendErrorResponse(res, 'Error retrieving users', 500);
  }
};

// @desc    Add skill to user profile
// @route   POST /api/users/skills
// @access  Private
const addSkill = async (req, res) => {
  try {
    const { type, name, category, level, description } = req.body;

    if (!['offered', 'wanted'].includes(type)) {
      return sendErrorResponse(res, 'Skill type must be either "offered" or "wanted"', 400);
    }

    const user = await User.findById(req.user._id);

    const skillData = { name, category, level };
    if (description && type === 'offered') {
      skillData.description = description;
    }

    if (type === 'offered') {
      user.skillsOffered.push(skillData);
    } else {
      user.skillsWanted.push(skillData);
    }

    await user.save();

    sendSuccessResponse(res, { user }, 'Skill added successfully');
  } catch (error) {
    console.error('Add skill error:', error);
    sendErrorResponse(res, 'Error adding skill', 500);
  }
};

// @desc    Remove skill from user profile
// @route   DELETE /api/users/skills/:skillId
// @access  Private
const removeSkill = async (req, res) => {
  try {
    const { skillId } = req.params;
    const { type } = req.query;

    if (!['offered', 'wanted'].includes(type)) {
      return sendErrorResponse(res, 'Skill type must be either "offered" or "wanted"', 400);
    }

    const user = await User.findById(req.user._id);

    if (type === 'offered') {
      user.skillsOffered.id(skillId).remove();
    } else {
      user.skillsWanted.id(skillId).remove();
    }

    await user.save();

    sendSuccessResponse(res, { user }, 'Skill removed successfully');
  } catch (error) {
    console.error('Remove skill error:', error);
    sendErrorResponse(res, 'Error removing skill', 500);
  }
};

// @desc    Deactivate user account
// @route   PUT /api/users/deactivate
// @access  Private
const deactivateAccount = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { isActive: false },
      { new: true }
    ).select('-password -refreshTokens');

    sendSuccessResponse(res, { user }, 'Account deactivated successfully');
  } catch (error) {
    console.error('Deactivate account error:', error);
    sendErrorResponse(res, 'Error deactivating account', 500);
  }
};

module.exports = {
  getUserProfile,
  updateProfile,
  uploadAvatar,
  getUsers,
  addSkill,
  removeSkill,
  deactivateAccount
};