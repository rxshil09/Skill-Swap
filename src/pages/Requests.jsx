import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  MessageCircle, 
  User,
  Calendar,
  ArrowRight,
  Filter
} from 'lucide-react'
import { useApp } from '../contexts/AppContext'

function Requests() {
  const { swapRequests, updateSwapRequest } = useApp()
  const [activeTab, setActiveTab] = useState('received')
  const [filterStatus, setFilterStatus] = useState('all')

  // Mock additional requests for demo
  const allRequests = [
    ...swapRequests,
    {
      id: 3,
      requester: {
        id: 4,
        name: 'Maria Garcia',
        avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=400'
      },
      skillRequested: 'JavaScript',
      skillOffered: 'Spanish Tutoring',
      status: 'rejected',
      message: 'I can help you with Spanish in exchange for JavaScript lessons.',
      createdAt: '2024-01-13T09:15:00Z'
    },
    {
      id: 4,
      requester: {
        id: 5,
        name: 'David Kim',
        avatar: 'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=400'
      },
      skillRequested: 'React',
      skillOffered: 'Photography',
      status: 'completed',
      message: 'Would love to exchange photography tips for React knowledge!',
      createdAt: '2024-01-10T16:30:00Z'
    }
  ]

  // Mock sent requests
  const sentRequests = [
    {
      id: 5,
      recipient: {
        id: 6,
        name: 'Emma Wilson',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400'
      },
      skillRequested: 'Yoga',
      skillOffered: 'Web Development',
      status: 'pending',
      message: 'Hi! I\'d love to learn yoga in exchange for web development tutoring.',
      createdAt: '2024-01-16T12:00:00Z'
    },
    {
      id: 6,
      recipient: {
        id: 7,
        name: 'John Smith',
        avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400'
      },
      skillRequested: 'Cooking',
      skillOffered: 'JavaScript',
      status: 'accepted',
      message: 'Would you be interested in teaching cooking for JavaScript lessons?',
      createdAt: '2024-01-14T14:45:00Z'
    }
  ]

  const requests = activeTab === 'received' ? allRequests : sentRequests
  const filteredRequests = filterStatus === 'all' 
    ? requests 
    : requests.filter(req => req.status === filterStatus)

  const handleUpdateRequest = (requestId, status) => {
    updateSwapRequest({ id: requestId, status })
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'accepted':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-blue-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200'
      case 'accepted':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
      case 'rejected':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
      case 'completed':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200'
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const tabs = [
    { id: 'received', label: 'Received', count: allRequests.length },
    { id: 'sent', label: 'Sent', count: sentRequests.length }
  ]

  const statusFilters = [
    { id: 'all', label: 'All' },
    { id: 'pending', label: 'Pending' },
    { id: 'accepted', label: 'Accepted' },
    { id: 'rejected', label: 'Rejected' },
    { id: 'completed', label: 'Completed' }
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Swap Requests
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Manage your skill exchange requests
        </p>
      </motion.div>

      {/* Tabs and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="card p-6 mb-8"
      >
        {/* Tab Navigation */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1 mb-4 sm:mb-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  activeTab === tab.id
                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-200'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {statusFilters.map((filter) => (
                <option key={filter.id} value={filter.id}>
                  {filter.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {filteredRequests.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-r from-primary-100 to-secondary-100 dark:from-primary-900/30 dark:to-secondary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-8 w-8 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No requests found
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {filterStatus === 'all' 
                  ? `No ${activeTab} requests yet.`
                  : `No ${filterStatus} requests found.`
                }
              </p>
            </div>
          ) : (
            filteredRequests.map((request, index) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex items-start justify-between">
                  {/* Request Info */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-4">
                      <img
                        src={activeTab === 'received' ? request.requester.avatar : request.recipient.avatar}
                        alt={activeTab === 'received' ? request.requester.name : request.recipient.name}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-white dark:ring-gray-700"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {activeTab === 'received' ? request.requester.name : request.recipient.name}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                            {request.status}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                          <span className="font-medium text-primary-600 dark:text-primary-400">
                            {request.skillRequested}
                          </span>
                          <ArrowRight className="h-3 w-3" />
                          <span className="font-medium text-secondary-600 dark:text-secondary-400">
                            {request.skillOffered}
                          </span>
                        </div>
                      </div>
                      {getStatusIcon(request.status)}
                    </div>

                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                      {request.message}
                    </p>

                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(request.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  {activeTab === 'received' && request.status === 'pending' && (
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => handleUpdateRequest(request.id, 'accepted')}
                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleUpdateRequest(request.id, 'rejected')}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                      >
                        Decline
                      </button>
                    </div>
                  )}

                  {(request.status === 'accepted' || request.status === 'completed') && (
                    <button className="flex items-center space-x-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium rounded-lg transition-colors duration-200">
                      <MessageCircle className="h-4 w-4" />
                      <span>Message</span>
                    </button>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {[
          { label: 'Total Requests', value: allRequests.length + sentRequests.length, color: 'primary' },
          { label: 'Pending', value: [...allRequests, ...sentRequests].filter(r => r.status === 'pending').length, color: 'warning' },
          { label: 'Accepted', value: [...allRequests, ...sentRequests].filter(r => r.status === 'accepted').length, color: 'success' },
          { label: 'Completed', value: [...allRequests, ...sentRequests].filter(r => r.status === 'completed').length, color: 'secondary' }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
            className="card p-6 text-center"
          >
            <div className={`text-3xl font-bold mb-2 ${
              stat.color === 'primary' ? 'text-primary-600 dark:text-primary-400' :
              stat.color === 'warning' ? 'text-warning-600 dark:text-warning-400' :
              stat.color === 'success' ? 'text-success-600 dark:text-success-400' :
              'text-secondary-600 dark:text-secondary-400'
            }`}>
              {stat.value}
            </div>
            <div className="text-gray-600 dark:text-gray-400 text-sm">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

export default Requests