const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const Notification = require('../models/Notification');
const { sendSuccessResponse, sendErrorResponse, sendPaginatedResponse } = require('../utils/responseHelper');

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
const sendMessage = async (req, res) => {
  try {
    const { recipient, content, messageType = 'text' } = req.body;
    const sender = req.user._id;

    // Check if recipient exists
    const recipientUser = await User.findById(recipient);
    if (!recipientUser) {
      return sendErrorResponse(res, 'Recipient not found', 404);
    }

    // Find or create conversation
    let conversation = await Conversation.findBetweenUsers(sender, recipient);
    
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [sender, recipient]
      });
    }

    // Create message
    const messageData = {
      sender,
      recipient,
      content,
      messageType,
      conversation: conversation._id
    };

    // Handle attachments if present
    if (req.files && req.files.length > 0) {
      messageData.attachments = req.files.map(file => ({
        filename: file.filename,
        originalName: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        url: `${req.protocol}://${req.get('host')}/uploads/messages/${file.filename}`
      }));
    }

    const message = await Message.create(messageData);

    // Update conversation
    conversation.lastMessage = message._id;
    conversation.lastMessageAt = Date.now();
    
    // Update unread count for recipient
    const currentUnreadCount = conversation.getUnreadCount(recipient);
    conversation.updateUnreadCount(recipient, currentUnreadCount + 1);
    
    await conversation.save();

    // Populate message
    await message.populate('sender', 'name avatar');
    await message.populate('recipient', 'name avatar');

    // Create notification for recipient
    await Notification.createNotification({
      recipient,
      sender,
      type: 'message',
      title: 'New Message',
      message: `${req.user.name} sent you a message`,
      data: {
        messageId: message._id,
        conversationId: conversation._id
      },
      actionUrl: `/messages/${conversation._id}`
    });

    // Emit real-time events
    const io = req.app.get('io');
    
    // Send message to recipient
    io.to(`user_${recipient}`).emit('newMessage', {
      message,
      conversation: conversation._id
    });

    // Send notification to recipient
    io.to(`user_${recipient}`).emit('newNotification', {
      type: 'message',
      title: 'New Message',
      message: `${req.user.name} sent you a message`,
      data: { conversationId: conversation._id }
    });

    sendSuccessResponse(res, { message }, 'Message sent successfully', 201);

  } catch (error) {
    console.error('Send message error:', error);
    sendErrorResponse(res, 'Error sending message', 500);
  }
};

// @desc    Get messages in a conversation
// @route   GET /api/messages/conversation/:conversationId
// @access  Private
const getConversationMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;

    // Check if user is part of the conversation
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: req.user._id
    });

    if (!conversation) {
      return sendErrorResponse(res, 'Conversation not found or access denied', 404);
    }

    // Get messages with pagination
    const messages = await Message.find({
      conversation: conversationId,
      isDeleted: false
    })
      .populate('sender', 'name avatar')
      .populate('recipient', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Message.countDocuments({
      conversation: conversationId,
      isDeleted: false
    });

    // Mark messages as read for current user
    await Message.updateMany(
      {
        conversation: conversationId,
        recipient: req.user._id,
        isRead: false
      },
      {
        isRead: true,
        readAt: Date.now()
      }
    );

    // Reset unread count for current user
    conversation.updateUnreadCount(req.user._id, 0);
    await conversation.save();

    sendPaginatedResponse(res, messages.reverse(), { page, limit, total }, 'Messages retrieved successfully');

  } catch (error) {
    console.error('Get conversation messages error:', error);
    sendErrorResponse(res, 'Error retrieving messages', 500);
  }
};

// @desc    Get all conversations for user
// @route   GET /api/messages/conversations
// @access  Private
const getUserConversations = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const conversations = await Conversation.find({
      participants: req.user._id,
      isActive: true
    })
      .populate('participants', 'name avatar lastActive')
      .populate('lastMessage')
      .sort({ lastMessageAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Conversation.countDocuments({
      participants: req.user._id,
      isActive: true
    });

    // Add unread count and other participant info
    const conversationsWithDetails = conversations.map(conv => {
      const otherParticipant = conv.participants.find(p => p._id.toString() !== req.user._id.toString());
      const unreadCount = conv.getUnreadCount(req.user._id);

      return {
        ...conv.toObject(),
        otherParticipant,
        unreadCount
      };
    });

    sendPaginatedResponse(res, conversationsWithDetails, { page, limit, total }, 'Conversations retrieved successfully');

  } catch (error) {
    console.error('Get user conversations error:', error);
    sendErrorResponse(res, 'Error retrieving conversations', 500);
  }
};

// @desc    Mark message as read
// @route   PUT /api/messages/:messageId/read
// @access  Private
const markMessageAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await Message.findOne({
      _id: messageId,
      recipient: req.user._id
    });

    if (!message) {
      return sendErrorResponse(res, 'Message not found', 404);
    }

    if (!message.isRead) {
      await message.markAsRead();

      // Emit read receipt to sender
      const io = req.app.get('io');
      io.to(`user_${message.sender}`).emit('messageRead', {
        messageId: message._id,
        readAt: message.readAt
      });
    }

    sendSuccessResponse(res, { message }, 'Message marked as read');

  } catch (error) {
    console.error('Mark message as read error:', error);
    sendErrorResponse(res, 'Error marking message as read', 500);
  }
};

// @desc    Delete a message
// @route   DELETE /api/messages/:messageId
// @access  Private
const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await Message.findOne({
      _id: messageId,
      sender: req.user._id
    });

    if (!message) {
      return sendErrorResponse(res, 'Message not found or unauthorized', 404);
    }

    await message.softDelete();

    // Emit message deletion to recipient
    const io = req.app.get('io');
    io.to(`user_${message.recipient}`).emit('messageDeleted', {
      messageId: message._id
    });

    sendSuccessResponse(res, null, 'Message deleted successfully');

  } catch (error) {
    console.error('Delete message error:', error);
    sendErrorResponse(res, 'Error deleting message', 500);
  }
};

// @desc    Search messages
// @route   GET /api/messages/search
// @access  Private
const searchMessages = async (req, res) => {
  try {
    const { query, conversationId } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    if (!query) {
      return sendErrorResponse(res, 'Search query is required', 400);
    }

    // Build search criteria
    const searchCriteria = {
      $or: [
        { sender: req.user._id },
        { recipient: req.user._id }
      ],
      content: { $regex: query, $options: 'i' },
      isDeleted: false
    };

    if (conversationId) {
      searchCriteria.conversation = conversationId;
    }

    const messages = await Message.find(searchCriteria)
      .populate('sender', 'name avatar')
      .populate('recipient', 'name avatar')
      .populate('conversation', 'participants')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Message.countDocuments(searchCriteria);

    sendPaginatedResponse(res, messages, { page, limit, total }, 'Messages found');

  } catch (error) {
    console.error('Search messages error:', error);
    sendErrorResponse(res, 'Error searching messages', 500);
  }
};

module.exports = {
  sendMessage,
  getConversationMessages,
  getUserConversations,
  markMessageAsRead,
  deleteMessage,
  searchMessages
};