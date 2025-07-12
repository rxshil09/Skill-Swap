import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  Filter, 
  Clock, 
  CheckCircle, 
  XCircle, 
  ArrowRight,
  Calendar,
  User,
  MoreVertical
} from 'lucide-react'
import { useAdmin } from '../../contexts/AdminContext'

function SwapMonitoring() {
  const { swapRequests, updateSwapStatus } = useAdmin()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedSwap, setSelectedSwap] = useState(null)
  const [showActionModal, setShowActionModal] = useState(false)
  const [newStatus, setNewStatus] = useState('')

  const filteredSwaps = swapRequests.filter(swap => {
    const matchesSearch = swap.requester.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         swap.recipient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         swap.skillRequested.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         swap.skillOffered.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || swap.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleStatusChange = (swap, status) => {
    setSelectedSwap(swap)
    setNewStatus(status)
    setShowActionModal(true)
  }

  const confirmStatusChange = () => {
    updateSwapStatus(selectedSwap.id, newStatus)
    setShowActionModal(false)
    setSelectedSwap(null)
    setNewStatus('')
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'accepted':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-blue-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200',
      accepted: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200',
      cancelled: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200',
      completed: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200'
    }
    return styles[status] || styles.pending
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

  const getAvailableActions = (status) => {
    switch (status) {
      case 'pending':
        return ['accepted', 'cancelled']
      case 'accepted':
        return ['completed', 'cancelled']
      case 'cancelled':
        return ['pending']
      case 'completed':
        return ['cancelled'] // In case of disputes
      default:
        return []
    }
  }

  const statusCounts = {
    all: swapRequests.length,
    pending: swapRequests.filter(s => s.status === 'pending').length,
    accepted: swapRequests.filter(s => s.status === 'accepted').length,
    completed: swapRequests.filter(s => s.status === 'completed').length,
    cancelled: swapRequests.filter(s => s.status === 'cancelled').length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Swap Monitoring
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Monitor and manage skill exchange requests
        </p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-5 gap-4"
      >
        {[
          { label: 'Total', value: statusCounts.all, color: 'gray' },
          { label: 'Pending', value: statusCounts.pending, color: 'yellow' },
          { label: 'Accepted', value: statusCounts.accepted, color: 'green' },
          { label: 'Completed', value: statusCounts.completed, color: 'blue' },
          { label: 'Cancelled', value: statusCounts.cancelled, color: 'red' }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
            className="card p-4 text-center"
          >
            <div className={`text-2xl font-bold mb-1 ${
              stat.color === 'yellow' ? 'text-yellow-600 dark:text-yellow-400' :
              stat.color === 'green' ? 'text-green-600 dark:text-green-400' :
              stat.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
              stat.color === 'red' ? 'text-red-600 dark:text-red-400' :
              'text-gray-600 dark:text-gray-400'
            }`}>
              {stat.value}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="card p-6"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search by user names or skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-12 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Swaps List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="space-y-4"
      >
        {filteredSwaps.map((swap, index) => (
          <motion.div
            key={swap.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between">
              {/* Swap Info */}
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-3">
                  {/* Requester */}
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="font-medium text-gray-900 dark:text-white">
                      {swap.requester.name}
                    </span>
                  </div>
                  
                  {/* Arrow and Skills */}
                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-200 rounded-full text-sm font-medium">
                      {swap.skillRequested}
                    </span>
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                    <span className="px-3 py-1 bg-secondary-100 dark:bg-secondary-900/30 text-secondary-800 dark:text-secondary-200 rounded-full text-sm font-medium">
                      {swap.skillOffered}
                    </span>
                  </div>
                  
                  {/* Recipient */}
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="font-medium text-gray-900 dark:text-white">
                      {swap.recipient.name}
                    </span>
                  </div>
                </div>

                {/* Status and Dates */}
                <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(swap.status)}
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(swap.status)}`}>
                      {swap.status}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>Created: {formatDate(swap.createdAt)}</span>
                  </div>
                  {swap.lastUpdated !== swap.createdAt && (
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>Updated: {formatDate(swap.lastUpdated)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2">
                {getAvailableActions(swap.status).map((action) => (
                  <button
                    key={action}
                    onClick={() => handleStatusChange(swap, action)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      action === 'accepted' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-900/50' :
                      action === 'completed' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-900/50' :
                      action === 'cancelled' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-900/50' :
                      'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 hover:bg-yellow-200 dark:hover:bg-yellow-900/50'
                    }`}
                  >
                    Mark as {action}
                  </button>
                ))}
                <button className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {filteredSwaps.length === 0 && (
          <div className="card p-12 text-center">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No swaps found
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              No swaps match your current search and filter criteria.
            </p>
          </div>
        )}
      </motion.div>

      {/* Status Change Modal */}
      {showActionModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md p-6"
          >
            <div className="flex items-center space-x-3 mb-4">
              {getStatusIcon(newStatus)}
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Update Swap Status
              </h3>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Are you sure you want to mark this swap as <strong>{newStatus}</strong>?
            </p>

            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-4">
              <div className="flex items-center space-x-2 text-sm">
                <span className="font-medium">{selectedSwap?.requester.name}</span>
                <ArrowRight className="h-3 w-3" />
                <span className="font-medium">{selectedSwap?.recipient.name}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mt-1">
                <span>{selectedSwap?.skillRequested}</span>
                <span>↔</span>
                <span>{selectedSwap?.skillOffered}</span>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowActionModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmStatusChange}
                className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors duration-200 ${
                  newStatus === 'accepted' ? 'bg-green-600 hover:bg-green-700' :
                  newStatus === 'completed' ? 'bg-blue-600 hover:bg-blue-700' :
                  newStatus === 'cancelled' ? 'bg-red-600 hover:bg-red-700' :
                  'bg-yellow-600 hover:bg-yellow-700'
                }`}
              >
                Confirm
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default SwapMonitoring