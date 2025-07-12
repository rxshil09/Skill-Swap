import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
  MessageCircle,
  User,
  MapPin,
  Star,
  Award,
  X,
  ExternalLink
} from 'lucide-react'
import { useApp } from '../contexts/AppContext'

function Messages() {
  const { messages, markMessageRead, sendMessage } = useApp()
  const navigate = useNavigate()
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [newMessage, setNewMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [showNewChatModal, setShowNewChatModal] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [selectedUserProfile, setSelectedUserProfile] = useState(null)
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
        status: 'online',
        location: 'New York, NY',
        rating: 4.9,
        reviewCount: 31,
        bio: 'Graphic designer with 8+ years of experience. I love creating beautiful designs and teaching others the art of visual communication.',
        skillsOffered: ['Graphic Design', 'Adobe Photoshop', 'UI/UX Design', 'Branding'],
        skillsWanted: ['Web Development', 'React', 'JavaScript'],
        completedSwaps: 12,
        memberSince: '2022',
        badges: ['Verified', 'Top Rated']
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
        status: 'away',
        location: 'Austin, TX',
        rating: 4.7,
        reviewCount: 18,
        bio: 'Professional guitarist and music teacher. I\'ve been playing for 15 years and love sharing my passion for music with others.',
        skillsOffered: ['Guitar Lessons', 'Music Theory', 'Songwriting'],
        skillsWanted: ['Photography', 'Video Editing', 'Digital Marketing'],
        completedSwaps: 8,
        memberSince: '2023',
        badges: ['Verified']
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
        status: 'offline',
        location: 'Miami, FL',
        rating: 4.9,
        reviewCount: 42,
        bio: 'Native Spanish speaker and certified language teacher. I help people learn Spanish through conversation and cultural immersion.',
        skillsOffered: ['Spanish Tutoring', 'Language Exchange', 'Cultural Training'],
        skillsWanted: ['JavaScript', 'Web Development', 'Digital Marketing'],
        completedSwaps: 25,
        memberSince: '2021',
        badges: ['Verified', 'Top Rated', 'Quick Responder']
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

  // Handle profile view
  const handleViewProfile = (user) => {
    setSelectedUserProfile(user)
    setShowProfileModal(true)
  }

  const handleGoToProfile = (userId) => {
    setShowProfileModal(false)
    navigate(`/profile/${userId}`)
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
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleViewProfile(conversation.participant)
                  }}
                  className="relative hover:ring-2 hover:ring-primary-500 rounded-full transition-all duration-200"
                >
                  <img
                    src={conversation.participant.avatar}
                    alt={conversation.participant.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                </button>
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
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleViewProfile(conversation.participant)
                    }}
                    className="text-base font-medium text-gray-900 dark:text-white truncate hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
                  >
                    {conversation.participant.name}
                  </button>
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
                <button
                  onClick={() => handleViewProfile(selectedConversation.participant)}
                  className="relative hover:ring-2 hover:ring-primary-500 rounded-full transition-all duration-200"
                >
                  <img
                    src={selectedConversation.participant.avatar}
                    alt={selectedConversation.participant.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </button>
                <div>
                  <button
                    onClick={() => handleViewProfile(selectedConversation.participant)}
                    className="text-base font-semibold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
                  >
                    {selectedConversation.participant.name}
                  </button>
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
                        onClick={() => {
                          handleViewProfile(selectedConversation.participant)
                          setShowMoreMenu(false)
                        }}
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

      {/* Profile Modal */}
      {showProfileModal && selectedUserProfile && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-primary-600 to-secondary-600 p-6 text-white">
              <button
                onClick={() => setShowProfileModal(false)}
                className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors duration-200"
              >
                <X className="h-5 w-5" />
              </button>
              
              <div className="flex items-center space-x-4">
                <img
                  src={selectedUserProfile.avatar}
                  alt={selectedUserProfile.name}
                  className="w-20 h-20 rounded-full object-cover ring-4 ring-white/20"
                />
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-1">{selectedUserProfile.name}</h2>
                  <div className="flex items-center space-x-4 text-white/90">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{selectedUserProfile.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-current text-yellow-300" />
                      <span>{selectedUserProfile.rating}</span>
                      <span className="text-white/70">({selectedUserProfile.reviewCount} reviews)</span>
                    </div>
                  </div>
                  
                  {/* Badges */}
                  <div className="flex items-center space-x-2 mt-2">
                    {selectedUserProfile.badges?.map((badge, index) => (
                      <span key={index} className="inline-flex items-center space-x-1 px-2 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-medium rounded-full">
                        <Award className="h-3 w-3" />
                        <span>{badge}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                    {selectedUserProfile.completedSwaps}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Completed Swaps</div>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold text-secondary-600 dark:text-secondary-400">
                    {selectedUserProfile.skillsOffered?.length || 0}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Skills Offered</div>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold text-accent-600 dark:text-accent-400">
                    {selectedUserProfile.memberSince}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Member Since</div>
                </div>
              </div>

              {/* Bio */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">About</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {selectedUserProfile.bio}
                </p>
              </div>

              {/* Skills Offered */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Skills Offered</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedUserProfile.skillsOffered?.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gradient-to-r from-primary-100 to-secondary-100 dark:from-primary-900/30 dark:to-secondary-900/30 text-primary-800 dark:text-primary-200 text-sm font-medium rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Skills Wanted */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Skills Wanted</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedUserProfile.skillsWanted?.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gradient-to-r from-accent-100 to-secondary-100 dark:from-accent-900/30 dark:to-secondary-900/30 text-accent-800 dark:text-accent-200 text-sm font-medium rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowProfileModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  Close
                </button>
                <button
                  onClick={() => handleGoToProfile(selectedUserProfile.id)}
                  className="flex-1 btn-primary flex items-center justify-center space-x-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>View Full Profile</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

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