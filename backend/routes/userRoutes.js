const express = require('express');
const {
  getUserProfile,
  updateProfile,
  uploadAvatar,
  getUsers,
  addSkill,
  removeSkill,
  deactivateAccount
} = require('../controllers/userController');
const { protect, optionalAuth } = require('../middleware/auth');
const { uploadAvatar: uploadAvatarMiddleware } = require('../middleware/upload');
const { validateProfileUpdate } = require('../middleware/validation');

const router = express.Router();

// Public routes
router.get('/', optionalAuth, getUsers);
router.get('/profile/:id', optionalAuth, getUserProfile);

// Protected routes
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, validateProfileUpdate, updateProfile);
router.post('/avatar', protect, uploadAvatarMiddleware, uploadAvatar);
router.post('/skills', protect, addSkill);
router.delete('/skills/:skillId', protect, removeSkill);
router.put('/deactivate', protect, deactivateAccount);

module.exports = router;