import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  Plus, 
  Send, 
  Paperclip, 
  Smile,
  Phone,
  MoreVertical,
  Circle,
  MessageCircle
} from 'lucide-react'
import { useApp } from '../contexts/AppContext'

function Messages() {
  const { messages, markMessageRead, sendMessage } = useApp()
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [newMessage, setNewMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [showNewChatModal, setShowNewChatModal] = useState(false)
  const [showMoreMenu, setShowMoreMenu] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)

  // Mock conversations for demo
  const conversations = [
    {
      id: 1,
      participant: {
        id: 2,
        name: 'Sarah Chen',
        avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400',
        status: 'online'
      },
      lastMessage: 'Hey! Thanks for accepting my swap request. When would be a good time to start?',
      timestamp: '2024-01-15T14:30:00Z',
      unread: 2,
      messages: [
        {
          id: 1,
          senderId: 2,
          message: 'Hi! I saw your web development skills and I\'m interested in swapping for graphic design.',
          timestamp: '2024-01-15T10:00:00Z',
          read: true
        },
        {
          id: 2,
          senderId: 1,
          message: 'That sounds great! I\'d love to learn more about graphic design.',
          timestamp: '2024-01-15T10:15:00Z',
          read: true
        },
        {
          id: 3,
          senderId: 2,
          message: 'Perfect! What would you like to start with? Logo design or maybe some Photoshop basics?',
          timestamp: '2024-01-15T10:30:00Z',
          read: true
        },
        {
          id: 4,
          senderId: 1,
          message: 'I think Photoshop basics would be a great starting point. When are you available?',
          timestamp: '2024-01-15T12:00:00Z',
          read: true
        },
        {
          id: 5,
          senderId: 2,
          message: 'Hey! Thanks for accepting my swap request. When would be a good time to start?',
          timestamp: '2024-01-15T14:30:00Z',
          read: false
        }
      ]
    },
    {
      id: 2,
      participant: {
        id: 3,
        name: 'Mike Rodriguez',
        avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400',
        status: 'away'
      },
      lastMessage: 'Looking forward to our photography session this weekend!',
      timestamp: '2024-01-14T18:20:00Z',
      unread: 0,
      messages: [
        {
          id: 1,
          senderId: 3,
          message: 'Hi! I\'m interested in your photography skills. I can teach guitar in exchange.',
          timestamp: '2024-01-14T16:00:00Z',
          read: true
        },
        {
          id: 2,
          senderId: 1,
          message: 'That\'s awesome! I\'ve always wanted to learn guitar. What style do you teach?',
          timestamp: '2024-01-14T16:15:00Z',
          read: true
        },
        {
          id: 3,
          senderId: 3,
          message: 'I specialize in acoustic and fingerpicking techniques. How about we meet this weekend?',
          timestamp: '2024-01-14T17:00:00Z',
          read: true
        },
        {
          id: 4,
          senderId: 3,
          message: 'Looking forward to our photography session this weekend!',
          timestamp: '2024-01-14T18:20:00Z',
          read: true
        }
      ]
    },
    {
      id: 3,
      participant: {
        id: 4,
        name: 'Maria Garcia',
        avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=400',
        status: 'offline'
      },
      lastMessage: '¡Perfecto! Let\'s start with basic conversation next week.',
      timestamp: '2024-01-13T15:45:00Z',
      unread: 0,
      messages: [
        {
          id: 1,
          senderId: 4,
          message: '¡Hola! I can help you with Spanish conversation practice.',
          timestamp: '2024-01-13T14:00:00Z',
          read: true
        },
        {
          id: 2,
          senderId: 1,
          message: 'That would be amazing! I can help you with JavaScript in return.',
          timestamp: '2024-01-13T14:30:00Z',
          read: true
        },
        {
          id: 3,
          senderId: 4,
          message: '¡Perfecto! Let\'s start with basic conversation next week.',
          timestamp: '2024-01-13T15:45:00Z',
          read: true
        }
      ]
    }
  ]

  const filteredConversations = conversations.filter(conv =>
    conv.participant.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return

    const message = {
      id: Date.now(),
      senderId: 1, // Current user
      message: newMessage,
      timestamp: new Date().toISOString(),
      read: true
    }

    // Add message to context
    sendMessage(message)
    
    // Update local conversation state
    setSelectedConversation(prev => ({
      ...prev,
      messages: [...prev.messages, message],
      lastMessage: newMessage,
      timestamp: message.timestamp
    }))
    
    setNewMessage('')
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now - date) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      })
    } else if (diffInHours < 168) { // Less than a week
      return date.toLocaleDateString('en-US', {
        weekday: 'short'
      })
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      })
    }
  }

  const formatMessageTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Mock users for new chat
  const mockUsers = [
    { id: 5, name: 'John Doe', avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg' },
    { id: 6, name: 'Jane Smith', avatar: 'https://images.pexels.com/photos/123456/pexels-photo-123456.jpeg' },
  ]

  // Handle new chat selection
  const handleNewChat = (user) => {
    const newConversation = {
      id: Date.now(),
      participant: user,
      lastMessage: '',
      timestamp: new Date().toISOString(),
      unread: 0,
      messages: [],
    }
    setSelectedConversation(newConversation)
    setShowNewChatModal(false)
  }

  // Handle file upload
  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (file && ['image/jpeg', 'image/png', 'application/pdf'].includes(file.type)) {
      setSelectedFile(file)
      setNewMessage(prev => prev + `[File: ${file.name}]`) // Mock file attachment
      event.target.value = null // Reset input
    } else {
      alert('Please select a valid image (JPEG/PNG) or PDF file.')
    }
  }

  // Mock emoji list
  const emojis = ['😊', '😂', '👍', '❤️', '😢']
  const handleEmojiSelect = (emoji) => {
    setNewMessage(prev => prev + emoji)
    setShowEmojiPicker(false)
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-800">
      {/* Conversations Sidebar */}
      <div className="w-full md:w-96 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Messages</h2>
          <button 
            className="p-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
            onClick={() => setShowNewChatModal(true)}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conversation, index) => (
            <motion.div
              key={conversation.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              onClick={() => {
                setSelectedConversation(conversation)
                conversation.unread > 0 && markMessageRead(conversation.id)
              }}
              className={`flex items-center p-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer ${
                selectedConversation?.id === conversation.id ? 'bg-primary-50 dark:bg-primary-900/20' : ''
              }`}
            >
              <div className="relative mr-3">
                <img
                  src={conversation.participant.avatar}
                  alt={conversation.participant.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${
                  conversation.participant.status === 'online' 
                    ? 'bg-green-500' 
                    : conversation.participant.status === 'away'
                    ? 'bg-yellow-500'
                    : 'bg-gray-400'
                }`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <h3 className="text-base font-medium text-gray-900 dark:text-white truncate">
                    {conversation.participant.name}
                  </h3>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatTime(conversation.timestamp)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                    {conversation.lastMessage}
                  </p>
                  {conversation.unread > 0 && (
                    <span className="ml-2 bg-primary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {conversation.unread}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-100 dark:bg-gray-800 bg-[url('https://web.whatsapp.com/img/bg-chat-tile_9e8a2898faedb7db9bf563840b4d05f9.png')] bg-repeat">
        {selectedConversation ? (
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={selectedConversation.participant.avatar}
                  alt={selectedConversation.participant.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                    {selectedConversation.participant.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                    {selectedConversation.participant.status}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <Phone className="h-5 w-5" />
                </button>
                <div className="relative">
                  <button 
                    className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    onClick={() => setShowMoreMenu(!showMoreMenu)}
                  >
                    <MoreVertical className="h-5 w-5" />
                  </button>
                  {showMoreMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
                      <button 
                        className="w-full text-left px-4 py-2 text-sm text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => alert('View Profile clicked')}
                      >
                        View Profile
                      </button>
                      <button 
                        className="w-full text-left px-4 py-2 text-sm text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => {
                          setSelectedConversation(null)
                          setShowMoreMenu(false)
                        }}
                      >
                        Delete Chat
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {selectedConversation.messages.map((message, index) => {
                const isOwn = message.senderId === 1
                return (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs sm:max-w-md p-3 rounded-lg shadow relative ${
                      isOwn 
                        ? 'bg-primary-500 text-white' 
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                    } ${isOwn ? 'rounded-br-none' : 'rounded-bl-none'}`}>
                      <p className="text-sm">{message.message}</p>
                      <p className="text-xs text-gray-300 dark:text-gray-400 mt-1 text-right">
                        {formatMessageTime(message.timestamp)}
                      </p>
                      <div className={`absolute bottom-0 ${isOwn ? 'right-[-6px]' : 'left-[-6px]'} w-2 h-2 ${isOwn ? 'bg-primary-500' : 'bg-gray-100 dark:bg-gray-700'} transform rotate-45`}></div>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Message Input */}
            <div className="bg-white dark:bg-gray-900 p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <button 
                  className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                >
                  <Smile className="h-5 w-5" />
                </button>
                {showEmojiPicker && (
                  <div className="absolute bottom-16 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2 shadow-lg z-10">
                    {emojis.map((emoji, idx) => (
                      <button 
                        key={idx}
                        className="text-xl mx-1"
                        onClick={() => handleEmojiSelect(emoji)}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}
                <label className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer">
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileSelect}
                    accept="image/jpeg,image/png,application/pdf"
                  />
                  <Paperclip className="h-5 w-5" />
                </label>
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="p-2 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-lg transition-colors disabled:cursor-not-allowed"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-primary-100 to-secondary-100 dark:from-primary-900/30 dark:to-secondary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-8 w-8 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Select a conversation
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Choose a conversation from the list to start messaging
              </p>
            </div>
          </div>
        )}
      </div>

      {/* New Chat Modal */}
      {showNewChatModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">New Chat</h3>
            <input
              type="text"
              placeholder="Search users..."
              className="w-full px-4 py-2 mb-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <div className="max-h-64 overflow-y-auto">
              {mockUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer rounded"
                  onClick={() => handleNewChat(user)}
                >
                  <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full mr-3" />
                  <span className="text-gray-900 dark:text-white">{user.name}</span>
                </div>
              ))}
            </div>
            <button
              className="mt-4 w-full py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
              onClick={() => setShowNewChatModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Messages