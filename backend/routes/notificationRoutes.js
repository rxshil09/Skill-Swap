const express = require('express');
const {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  createNotification,
  getNotificationTypes,
  updateNotificationPreferences
} = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');
const { validateNotification } = require('../middleware/validation');

const router = express.Router();

// All routes are protected
router.use(protect);

// Notification routes
router.get('/', getNotifications);
router.get('/unread-count', getUnreadCount);
router.get('/types', getNotificationTypes);
router.post('/', validateNotification, createNotification);
router.put('/preferences', updateNotificationPreferences);
router.put('/mark-all-read', markAllAsRead);
router.put('/:notificationId/read', markAsRead);
router.delete('/:notificationId', deleteNotification);

module.exports = router;