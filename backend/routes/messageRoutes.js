const express = require('express');
const {
  sendMessage,
  getConversationMessages,
  getUserConversations,
  markMessageAsRead,
  deleteMessage,
  searchMessages
} = require('../controllers/messageController');
const { protect } = require('../middleware/auth');
const { uploadMessageAttachments } = require('../middleware/upload');
const { validateMessage } = require('../middleware/validation');

const router = express.Router();

// All routes are protected
router.use(protect);

// Message routes
router.post('/', uploadMessageAttachments, validateMessage, sendMessage);
router.get('/conversations', getUserConversations);
router.get('/conversation/:conversationId', getConversationMessages);
router.put('/:messageId/read', markMessageAsRead);
router.delete('/:messageId', deleteMessage);
router.get('/search', searchMessages);

module.exports = router;