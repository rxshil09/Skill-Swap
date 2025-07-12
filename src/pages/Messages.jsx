import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  Plus, 
  Send, 
  Paperclip, 
  Smile,
  Phone,
  Video,
  MoreVertical,
  Circle
} from 'lucide-react'
import { useApp } from '../contexts/AppContext'


function Messages() {
  const { messages, markMessageRead, sendMessage } = useApp()
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [newMessage, setNewMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8"
      >
        {/* Conversations Sidebar */}
        <div className="lg:col-span-1 h-full">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="card p-0 h-full flex flex-col max-h-full"
          >
            {/* Header */}
            <div className="p-4 md:p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white">
                  Messages
                </h2>
                <button className="p-1.5 md:p-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors duration-200">
                  <Plus className="h-3 w-3 md:h-4 md:w-4" />
                </button>
              </div>

              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 md:px-4 py-2 pl-8 md:pl-10 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <Search className="absolute left-2.5 md:left-3 top-2.5 h-3 w-3 md:h-4 md:w-4 text-gray-400" />
              </div>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto min-h-0">
              {filteredConversations.map((conversation, index) => (
                <motion.div
                  key={conversation.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  onClick={() => setSelectedConversation(conversation)}
                  className={`p-3 md:p-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 ${
                    selectedConversation?.id === conversation.id 
                      ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800' 
                      : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <img
                        src={conversation.participant.avatar}
                        alt={conversation.participant.name}
                        className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover flex-shrink-0"
                      />
                      <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 md:w-3 md:h-3 rounded-full border-2 border-white dark:border-gray-800 ${
                        conversation.participant.status === 'online' 
                          ? 'bg-green-500' 
                          : conversation.participant.status === 'away'
                          ? 'bg-yellow-500'
                          : 'bg-gray-400'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5 md:mb-1">
                        <h3 className="text-sm md:text-base font-medium text-gray-900 dark:text-white truncate">
                          {conversation.participant.name}
                        </h3>
                        <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0 ml-2">
                          {formatTime(conversation.timestamp)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 truncate">
                          {conversation.lastMessage}
                        </p>
                        {conversation.unread > 0 && (
                          <span className="ml-2 bg-primary-500 text-white text-xs rounded-full h-4 w-4 md:h-5 md:w-5 flex items-center justify-center flex-shrink-0">
                            {conversation.unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-2 h-full">
          {selectedConversation ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="card p-0 h-full flex flex-col max-h-full"
            >
              {/* Chat Header */}
              <div className="p-4 md:p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <img
                        src={selectedConversation.participant.avatar}
                        alt={selectedConversation.participant.name}
                        className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover"
                      />
                      <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 md:w-3 md:h-3 rounded-full border-2 border-white dark:border-gray-800 ${
                        selectedConversation.participant.status === 'online' 
                          ? 'bg-green-500' 
                          : selectedConversation.participant.status === 'away'
                          ? 'bg-yellow-500'
                          : 'bg-gray-400'
                      }`} />
                    </div>
                    <div>
                      <h3 className="text-sm md:text-base font-semibold text-gray-900 dark:text-white">
                        {selectedConversation.participant.name}
                      </h3>
                      <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 capitalize">
                        {selectedConversation.participant.status}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 md:space-x-2">
                    <button className="p-1.5 md:p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200 hidden sm:block">
                      <Phone className="h-4 w-4 md:h-5 md:w-5" />
                    </button>
                    <button className="p-1.5 md:p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200 hidden sm:block">
                      <Video className="h-4 w-4 md:h-5 md:w-5" />
                    </button>
                    <button className="p-1.5 md:p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200">
                      <MoreVertical className="h-4 w-4 md:h-5 md:w-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-3 md:p-6 space-y-3 md:space-y-4 min-h-0">
                {selectedConversation.messages.map((message, index) => {
                  const isOwn = message.senderId === 1 // Current user ID
                  return (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg ${
                        isOwn ? 'order-2' : 'order-1'
                      }`}>
                        <div className={`px-3 md:px-4 py-2 rounded-2xl ${
                          isOwn 
                            ? 'bg-primary-500 text-white' 
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                        }`}>
                          <p className="text-sm md:text-base">{message.message}</p>
                        </div>
                        <p className={`text-xs text-gray-500 dark:text-gray-400 mt-1 ${
                          isOwn ? 'text-right' : 'text-left'
                        }`}>
                          {formatMessageTime(message.timestamp)}
                        </p>
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              {/* Message Input */}
              <div className="p-3 md:p-6 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
                <div className="flex items-center space-x-2 md:space-x-3">
                  <button className="p-1.5 md:p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200 hidden sm:block">
                    <Paperclip className="h-4 w-4 md:h-5 md:w-5" />
                  </button>
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="w-full px-3 md:px-4 py-2 md:py-3 pr-10 md:pr-12 text-sm md:text-base border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <button className="absolute right-2 md:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hidden sm:block">
                      <Smile className="h-4 w-4 md:h-5 md:w-5" />
                    </button>
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="p-2 md:p-3 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-xl transition-colors duration-200 disabled:cursor-not-allowed"
                  >
                    <Send className="h-4 w-4 md:h-5 md:w-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            // Empty State
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="card h-full flex items-center justify-center p-6"
            >
              <div className="text-center">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-primary-100 to-secondary-100 dark:from-primary-900/30 dark:to-secondary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="h-6 w-6 md:h-8 md:w-8 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Select a conversation
                </h3>
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">
                  Choose a conversation from the list to start messaging
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default Messages