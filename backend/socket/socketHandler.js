const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Store connected users
const connectedUsers = new Map();

const socketHandler = (io) => {
  // Authentication middleware for socket connections
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
      
      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return next(new Error('Authentication error: User not found'));
      }

      socket.userId = user._id.toString();
      socket.user = user;
      next();
    } catch (error) {
      console.error('Socket authentication error:', error);
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User ${socket.user.name} connected with socket ID: ${socket.id}`);

    // Store user connection
    connectedUsers.set(socket.userId, {
      socketId: socket.id,
      user: socket.user,
      lastSeen: new Date()
    });

    // Join user to their personal room
    socket.join(`user_${socket.userId}`);

    // Update user's last active status
    socket.user.updateLastActive();

    // Emit user online status to their contacts
    socket.broadcast.emit('userOnline', {
      userId: socket.userId,
      user: {
        id: socket.user._id,
        name: socket.user.name,
        avatar: socket.user.avatar
      }
    });

    // Handle joining conversation rooms
    socket.on('joinConversation', (conversationId) => {
      socket.join(`conversation_${conversationId}`);
      console.log(`User ${socket.user.name} joined conversation: ${conversationId}`);
    });

    // Handle leaving conversation rooms
    socket.on('leaveConversation', (conversationId) => {
      socket.leave(`conversation_${conversationId}`);
      console.log(`User ${socket.user.name} left conversation: ${conversationId}`);
    });

    // Handle typing indicators
    socket.on('typing', (data) => {
      const { conversationId, isTyping } = data;
      socket.to(`conversation_${conversationId}`).emit('userTyping', {
        userId: socket.userId,
        user: {
          id: socket.user._id,
          name: socket.user.name
        },
        isTyping
      });
    });

    // Handle message read receipts
    socket.on('messageRead', (data) => {
      const { messageId, conversationId } = data;
      socket.to(`conversation_${conversationId}`).emit('messageReadReceipt', {
        messageId,
        readBy: socket.userId,
        readAt: new Date()
      });
    });

    // Handle video call events
    socket.on('callUser', (data) => {
      const { to, offer, callType } = data;
      socket.to(`user_${to}`).emit('incomingCall', {
        from: socket.userId,
        caller: {
          id: socket.user._id,
          name: socket.user.name,
          avatar: socket.user.avatar
        },
        offer,
        callType
      });
    });

    socket.on('answerCall', (data) => {
      const { to, answer } = data;
      socket.to(`user_${to}`).emit('callAnswered', {
        from: socket.userId,
        answer
      });
    });

    socket.on('rejectCall', (data) => {
      const { to } = data;
      socket.to(`user_${to}`).emit('callRejected', {
        from: socket.userId
      });
    });

    socket.on('endCall', (data) => {
      const { to } = data;
      socket.to(`user_${to}`).emit('callEnded', {
        from: socket.userId
      });
    });

    // Handle ICE candidates for WebRTC
    socket.on('iceCandidate', (data) => {
      const { to, candidate } = data;
      socket.to(`user_${to}`).emit('iceCandidate', {
        from: socket.userId,
        candidate
      });
    });

    // Handle skill request events
    socket.on('skillRequest', (data) => {
      const { to, skillData } = data;
      socket.to(`user_${to}`).emit('newSkillRequest', {
        from: socket.userId,
        requester: {
          id: socket.user._id,
          name: socket.user.name,
          avatar: socket.user.avatar
        },
        skillData
      });
    });

    // Handle notification acknowledgment
    socket.on('notificationRead', (data) => {
      const { notificationId } = data;
      // Update notification read status in database
      // This could be handled by the notification controller
      console.log(`Notification ${notificationId} read by user ${socket.userId}`);
    });

    // Handle user status updates
    socket.on('updateStatus', (status) => {
      const validStatuses = ['online', 'away', 'busy', 'offline'];
      if (validStatuses.includes(status)) {
        // Update user status in connected users map
        const userConnection = connectedUsers.get(socket.userId);
        if (userConnection) {
          userConnection.status = status;
          connectedUsers.set(socket.userId, userConnection);
        }

        // Broadcast status update to contacts
        socket.broadcast.emit('userStatusUpdate', {
          userId: socket.userId,
          status
        });
      }
    });

    // Handle getting online users
    socket.on('getOnlineUsers', () => {
      const onlineUsers = Array.from(connectedUsers.values()).map(connection => ({
        userId: connection.user._id,
        name: connection.user.name,
        avatar: connection.user.avatar,
        status: connection.status || 'online',
        lastSeen: connection.lastSeen
      }));

      socket.emit('onlineUsers', onlineUsers);
    });

    // Handle disconnect
    socket.on('disconnect', (reason) => {
      console.log(`User ${socket.user.name} disconnected: ${reason}`);

      // Remove user from connected users
      connectedUsers.delete(socket.userId);

      // Update user's last active status
      socket.user.updateLastActive();

      // Emit user offline status to their contacts
      socket.broadcast.emit('userOffline', {
        userId: socket.userId,
        user: {
          id: socket.user._id,
          name: socket.user.name,
          avatar: socket.user.avatar
        },
        lastSeen: new Date()
      });
    });

    // Handle errors
    socket.on('error', (error) => {
      console.error(`Socket error for user ${socket.user.name}:`, error);
    });
  });

  // Helper function to get connected user
  const getConnectedUser = (userId) => {
    return connectedUsers.get(userId);
  };

  // Helper function to emit to specific user
  const emitToUser = (userId, event, data) => {
    const userConnection = getConnectedUser(userId);
    if (userConnection) {
      io.to(`user_${userId}`).emit(event, data);
      return true;
    }
    return false;
  };

  // Helper function to emit to conversation
  const emitToConversation = (conversationId, event, data, excludeUserId = null) => {
    if (excludeUserId) {
      io.to(`conversation_${conversationId}`).except(`user_${excludeUserId}`).emit(event, data);
    } else {
      io.to(`conversation_${conversationId}`).emit(event, data);
    }
  };

  // Make helper functions available to the app
  io.getConnectedUser = getConnectedUser;
  io.emitToUser = emitToUser;
  io.emitToConversation = emitToConversation;
  io.getOnlineUsers = () => Array.from(connectedUsers.values());
};

module.exports = socketHandler;