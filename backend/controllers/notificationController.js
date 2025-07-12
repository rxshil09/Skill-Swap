const Notification = require('../models/Notification');
const { sendSuccessResponse, sendErrorResponse, sendPaginatedResponse } = require('../utils/responseHelper');

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
const getNotifications = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const isRead = req.query.isRead;
    const type = req.query.type;

    // Build query
    const query = { recipient: req.user._id };

    if (isRead !== undefined) {
      query.isRead = isRead === 'true';
    }

    if (type) {
      query.type = type;
    }

    // Get notifications with pagination
    const notifications = await Notification.find(query)
      .populate('sender', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Notification.countDocuments(query);

    sendPaginatedResponse(res, notifications, { page, limit, total }, 'Notifications retrieved successfully');

  } catch (error) {
    console.error('Get notifications error:', error);
    sendErrorResponse(res, 'Error retrieving notifications', 500);
  }
};

// @desc    Get unread notification count
// @route   GET /api/notifications/unread-count
// @access  Private
const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      recipient: req.user._id,
      isRead: false
    });

    sendSuccessResponse(res, { count }, 'Unread count retrieved successfully');

  } catch (error) {
    console.error('Get unread count error:', error);
    sendErrorResponse(res, 'Error retrieving unread count', 500);
  }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:notificationId/read
// @access  Private
const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const notification = await Notification.findOne({
      _id: notificationId,
      recipient: req.user._id
    });

    if (!notification) {
      return sendErrorResponse(res, 'Notification not found', 404);
    }

    if (!notification.isRead) {
      await notification.markAsRead();
    }

    sendSuccessResponse(res, { notification }, 'Notification marked as read');

  } catch (error) {
    console.error('Mark notification as read error:', error);
    sendErrorResponse(res, 'Error marking notification as read', 500);
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/mark-all-read
// @access  Private
const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      {
        recipient: req.user._id,
        isRead: false
      },
      {
        isRead: true,
        readAt: Date.now()
      }
    );

    sendSuccessResponse(res, null, 'All notifications marked as read');

  } catch (error) {
    console.error('Mark all notifications as read error:', error);
    sendErrorResponse(res, 'Error marking all notifications as read', 500);
  }
};

// @desc    Delete notification
// @route   DELETE /api/notifications/:notificationId
// @access  Private
const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const notification = await Notification.findOneAndDelete({
      _id: notificationId,
      recipient: req.user._id
    });

    if (!notification) {
      return sendErrorResponse(res, 'Notification not found', 404);
    }

    sendSuccessResponse(res, null, 'Notification deleted successfully');

  } catch (error) {
    console.error('Delete notification error:', error);
    sendErrorResponse(res, 'Error deleting notification', 500);
  }
};

// @desc    Create notification (admin/system use)
// @route   POST /api/notifications
// @access  Private
const createNotification = async (req, res) => {
  try {
    const { recipient, type, title, message, data, actionUrl, priority } = req.body;

    const notificationData = {
      recipient,
      sender: req.user._id,
      type,
      title,
      message,
      data: data || {},
      actionUrl,
      priority: priority || 'medium'
    };

    const notification = await Notification.createNotification(notificationData);

    // Emit real-time notification
    const io = req.app.get('io');
    io.to(`user_${recipient}`).emit('newNotification', {
      notification
    });

    sendSuccessResponse(res, { notification }, 'Notification created successfully', 201);

  } catch (error) {
    console.error('Create notification error:', error);
    sendErrorResponse(res, 'Error creating notification', 500);
  }
};

// @desc    Get notification types
// @route   GET /api/notifications/types
// @access  Private
const getNotificationTypes = async (req, res) => {
  try {
    const types = [
      { value: 'message', label: 'Message' },
      { value: 'skill_request', label: 'Skill Request' },
      { value: 'skill_accepted', label: 'Skill Accepted' },
      { value: 'skill_rejected', label: 'Skill Rejected' },
      { value: 'skill_completed', label: 'Skill Completed' },
      { value: 'review_received', label: 'Review Received' },
      { value: 'system_announcement', label: 'System Announcement' },
      { value: 'profile_view', label: 'Profile View' },
      { value: 'follow', label: 'Follow' }
    ];

    sendSuccessResponse(res, { types }, 'Notification types retrieved successfully');

  } catch (error) {
    console.error('Get notification types error:', error);
    sendErrorResponse(res, 'Error retrieving notification types', 500);
  }
};

// @desc    Update notification preferences
// @route   PUT /api/notifications/preferences
// @access  Private
const updateNotificationPreferences = async (req, res) => {
  try {
    const { preferences } = req.body;

    // Update user notification preferences
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { notificationPreferences: preferences },
      { new: true }
    );

    sendSuccessResponse(res, { preferences: user.notificationPreferences }, 'Notification preferences updated successfully');

  } catch (error) {
    console.error('Update notification preferences error:', error);
    sendErrorResponse(res, 'Error updating notification preferences', 500);
  }
};

module.exports = {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  createNotification,
  getNotificationTypes,
  updateNotificationPreferences
};