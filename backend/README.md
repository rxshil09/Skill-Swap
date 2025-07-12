# SkillSwap Backend API

A comprehensive Express.js backend with JWT authentication, MongoDB integration, and Socket.io for real-time features.

## Features

- **Authentication**: JWT-based authentication with refresh tokens
- **Database**: MongoDB with Mongoose ODM
- **Real-time**: Socket.io for live chat and notifications
- **File Upload**: Multer for avatar and message attachments
- **Security**: Helmet, CORS, rate limiting
- **Validation**: Express-validator for input validation
- **Error Handling**: Centralized error handling middleware

## Tech Stack

- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JSON Web Tokens (JWT)
- **Real-time**: Socket.io
- **File Upload**: Multer
- **Validation**: Express-validator
- **Security**: Helmet, CORS, bcryptjs
- **Environment**: dotenv

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Update the environment variables in `.env`:
   - Set your MongoDB connection string
   - Set JWT secrets
   - Configure other settings as needed

5. Start the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment mode | development |
| `MONGODB_URI` | MongoDB connection string | Required |
| `JWT_SECRET` | JWT secret key | Required |
| `JWT_EXPIRE` | JWT expiration time | 7d |
| `JWT_REFRESH_SECRET` | Refresh token secret | Required |
| `JWT_REFRESH_EXPIRE` | Refresh token expiration | 30d |
| `CLIENT_URL` | Frontend URL for CORS | http://localhost:3000 |
| `MAX_FILE_SIZE` | Maximum file upload size | 5242880 (5MB) |

## API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - Login user
- `POST /logout` - Logout user
- `POST /refresh` - Refresh access token
- `GET /me` - Get current user
- `GET /verify` - Verify token

### Users (`/api/users`)
- `GET /` - Get all users (with pagination and search)
- `GET /profile/:id?` - Get user profile
- `PUT /profile` - Update user profile
- `POST /avatar` - Upload user avatar
- `POST /skills` - Add skill to profile
- `DELETE /skills/:skillId` - Remove skill from profile
- `PUT /deactivate` - Deactivate account

### Messages (`/api/messages`)
- `POST /` - Send message
- `GET /conversations` - Get user conversations
- `GET /conversation/:conversationId` - Get conversation messages
- `PUT /:messageId/read` - Mark message as read
- `DELETE /:messageId` - Delete message
- `GET /search` - Search messages

### Notifications (`/api/notifications`)
- `GET /` - Get notifications
- `GET /unread-count` - Get unread count
- `GET /types` - Get notification types
- `POST /` - Create notification
- `PUT /preferences` - Update notification preferences
- `PUT /mark-all-read` - Mark all as read
- `PUT /:notificationId/read` - Mark notification as read
- `DELETE /:notificationId` - Delete notification

## Socket.io Events

### Client to Server
- `joinConversation` - Join a conversation room
- `leaveConversation` - Leave a conversation room
- `typing` - Send typing indicator
- `messageRead` - Mark message as read
- `callUser` - Initiate video/audio call
- `answerCall` - Answer incoming call
- `rejectCall` - Reject incoming call
- `endCall` - End active call
- `iceCandidate` - WebRTC ICE candidate
- `skillRequest` - Send skill request
- `updateStatus` - Update user status
- `getOnlineUsers` - Get list of online users

### Server to Client
- `newMessage` - New message received
- `newNotification` - New notification
- `userOnline` - User came online
- `userOffline` - User went offline
- `userTyping` - User typing indicator
- `messageReadReceipt` - Message read receipt
- `incomingCall` - Incoming call
- `callAnswered` - Call answered
- `callRejected` - Call rejected
- `callEnded` - Call ended
- `iceCandidate` - WebRTC ICE candidate
- `newSkillRequest` - New skill request
- `userStatusUpdate` - User status update
- `onlineUsers` - List of online users

## Database Models

### User
- Personal information (name, email, avatar, bio, location)
- Skills offered and wanted
- Authentication data (password, refresh tokens)
- Profile settings and preferences

### Message
- Message content and metadata
- File attachments support
- Read receipts and timestamps
- Soft delete functionality

### Conversation
- Two-participant conversations
- Last message tracking
- Unread message counts
- Active status management

### Notification
- Various notification types
- Read/unread status
- Priority levels
- Expiration support

## File Upload

The API supports file uploads for:
- **User avatars**: Images only (JPEG, PNG, GIF, WebP)
- **Message attachments**: Images and documents (PDF, DOC, DOCX, TXT)

Files are stored locally in the `uploads/` directory with organized subdirectories.

## Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: API rate limiting
- **JWT**: Secure token-based authentication
- **bcrypt**: Password hashing
- **Input Validation**: Request validation
- **File Upload Security**: File type and size restrictions

## Error Handling

Centralized error handling with:
- Standardized error responses
- Development vs production error details
- Mongoose error handling
- JWT error handling
- Multer error handling

## Development

### Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

### Project Structure
```
backend/
├── controllers/     # Route controllers
├── middleware/      # Custom middleware
├── models/         # Mongoose models
├── routes/         # Express routes
├── socket/         # Socket.io handlers
├── utils/          # Utility functions
├── uploads/        # File uploads (gitignored)
├── .env.example    # Environment variables template
├── .gitignore      # Git ignore rules
├── package.json    # Dependencies and scripts
├── README.md       # This file
└── server.js       # Application entry point
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.