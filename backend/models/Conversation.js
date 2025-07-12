const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  lastMessageAt: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  unreadCount: {
    type: Map,
    of: Number,
    default: {}
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Ensure only two participants per conversation
conversationSchema.pre('save', function(next) {
  if (this.participants.length !== 2) {
    return next(new Error('Conversation must have exactly 2 participants'));
  }
  next();
});

// Index for efficient queries
conversationSchema.index({ participants: 1 });
conversationSchema.index({ lastMessageAt: -1 });

// Find conversation between two users
conversationSchema.statics.findBetweenUsers = function(userId1, userId2) {
  return this.findOne({
    participants: { $all: [userId1, userId2] }
  }).populate('participants', 'name email avatar')
    .populate('lastMessage');
};

// Update unread count for a user
conversationSchema.methods.updateUnreadCount = function(userId, count = 0) {
  this.unreadCount.set(userId.toString(), count);
  return this.save();
};

// Get unread count for a user
conversationSchema.methods.getUnreadCount = function(userId) {
  return this.unreadCount.get(userId.toString()) || 0;
};

module.exports = mongoose.model('Conversation', conversationSchema);