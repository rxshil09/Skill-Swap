import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Send, 
  Users, 
  AlertTriangle, 
  Info, 
  Megaphone,
  Calendar,
  CheckCircle,
  Clock
} from 'lucide-react'
import { useAdmin } from '../../contexts/AdminContext'

function PlatformMessaging() {
  const { platformMessages, sendPlatformMessage } = useAdmin()
  const [showComposeModal, setShowComposeModal] = useState(false)
  const [messageData, setMessageData] = useState({
    title: '',
    content: '',
    type: 'announcement',
    sentTo: 'all_users'
  })

  const messageTypes = [
    { value: 'announcement', label: 'Announcement', icon: Megaphone, color: 'blue' },
    { value: 'feature_update', label: 'Feature Update', icon: Info, color: 'green' },
    { value: 'maintenance', label: 'Maintenance Alert', icon: AlertTriangle, color: 'yellow' },
    { value: 'security', label: 'Security Notice', icon: AlertTriangle, color: 'red' }
  ]

  const audienceOptions = [
    { value: 'all_users', label: 'All Users' },
    { value: 'active_users', label: 'Active Users Only' },
    { value: 'new_users', label: 'New Users (Last 30 days)' },
    { value: 'premium_users', label: 'Premium Users' }
  ]

  const handleSendMessage = () => {
    if (!messageData.title.trim() || !messageData.content.trim()) return
    
    sendPlatformMessage(messageData)
    setShowComposeModal(false)
    setMessageData({
      title: '',
      content: '',
      type: 'announcement',
      sentTo: 'all_users'
    })
  }

  const getTypeIcon = (type) => {
    const typeConfig = messageTypes.find(t => t.value === type)
    return typeConfig ? typeConfig.icon : Megaphone
  }

  const getTypeColor = (type) => {
    const typeConfig = messageTypes.find(t => t.value === type)
    const colors = {
      blue: 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30',
      green: 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30',
      yellow: 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30',
      red: 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30'
    }
    return colors[typeConfig?.color] || colors.blue
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Platform Messaging
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Send announcements and updates to platform users
          </p>
        </div>
        <button
          onClick={() => setShowComposeModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Send className="h-4 w-4" />
          <span>Compose Message</span>
        </button>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        {[
          { label: 'Total Messages', value: platformMessages.length, icon: Send, color: 'blue' },
          { label: 'This Month', value: 3, icon: Calendar, color: 'green' },
          { label: 'Active Users', value: '890', icon: Users, color: 'purple' },
          { label: 'Delivery Rate', value: '99.2%', icon: CheckCircle, color: 'green' }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${
                stat.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/30' :
                stat.color === 'green' ? 'bg-green-100 dark:bg-green-900/30' :
                stat.color === 'purple' ? 'bg-purple-100 dark:bg-purple-900/30' :
                'bg-gray-100 dark:bg-gray-800'
              }`}>
                <stat.icon className={`h-6 w-6 ${
                  stat.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                  stat.color === 'green' ? 'text-green-600 dark:text-green-400' :
                  stat.color === 'purple' ? 'text-purple-600 dark:text-purple-400' :
                  'text-gray-600 dark:text-gray-400'
                }`} />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Message History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="card p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Message History
        </h3>
        
        <div className="space-y-4">
          {platformMessages.map((message, index) => {
            const TypeIcon = getTypeIcon(message.type)
            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={`p-2 rounded-lg ${getTypeColor(message.type)}`}>
                        <TypeIcon className="h-4 w-4" />
                      </div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {message.title}
                      </h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(message.type)}`}>
                        {messageTypes.find(t => t.value === message.type)?.label}
                      </span>
                    </div>
                    
                    <p className="text-gray-700 dark:text-gray-300 mb-3">
                      {message.content}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(message.createdAt)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>Sent to: {audienceOptions.find(a => a.value === message.sentTo)?.label}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-green-600 dark:text-green-400">{message.status}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}

          {platformMessages.length === 0 && (
            <div className="text-center py-12">
              <Send className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No messages sent yet
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Start by composing your first platform message
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Compose Message Modal */}
      {showComposeModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl p-6"
          >
            <div className="flex items-center space-x-3 mb-6">
              <Send className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Compose Platform Message
              </h3>
            </div>

            <div className="space-y-6">
              {/* Message Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Message Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {messageTypes.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setMessageData(prev => ({ ...prev, type: type.value }))}
                      className={`flex items-center space-x-3 p-3 border rounded-lg transition-colors duration-200 ${
                        messageData.type === type.value
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      <type.icon className={`h-5 w-5 ${
                        messageData.type === type.value ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500'
                      }`} />
                      <span className={`font-medium ${
                        messageData.type === type.value ? 'text-primary-900 dark:text-primary-100' : 'text-gray-700 dark:text-gray-300'
                      }`}>
                        {type.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Audience */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Send To
                </label>
                <select
                  value={messageData.sentTo}
                  onChange={(e) => setMessageData(prev => ({ ...prev, sentTo: e.target.value }))}
                  className="input-field"
                >
                  {audienceOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Message Title
                </label>
                <input
                  type="text"
                  value={messageData.title}
                  onChange={(e) => setMessageData(prev => ({ ...prev, title: e.target.value }))}
                  className="input-field"
                  placeholder="Enter message title..."
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Message Content
                </label>
                <textarea
                  value={messageData.content}
                  onChange={(e) => setMessageData(prev => ({ ...prev, content: e.target.value }))}
                  rows={6}
                  className="input-field"
                  placeholder="Enter your message content..."
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowComposeModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSendMessage}
                disabled={!messageData.title.trim() || !messageData.content.trim()}
                className="flex-1 btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4" />
                <span>Send Message</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default PlatformMessaging