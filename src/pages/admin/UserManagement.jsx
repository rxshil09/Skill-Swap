import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Ban, 
  UserX, 
  UserCheck, 
  Eye,
  AlertTriangle,
  Shield
} from 'lucide-react'
import { useAdmin } from '../../contexts/AdminContext'

function UserManagement() {
  const { users, banUser, suspendUser, reactivateUser } = useAdmin()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedUser, setSelectedUser] = useState(null)
  const [showActionModal, setShowActionModal] = useState(false)
  const [actionType, setActionType] = useState('')
  const [actionReason, setActionReason] = useState('')

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleUserAction = (user, action) => {
    setSelectedUser(user)
    setActionType(action)
    setShowActionModal(true)
  }

  const confirmAction = () => {
    if (!selectedUser || !actionReason.trim()) return

    switch (actionType) {
      case 'ban':
        banUser(selectedUser.id, actionReason)
        break
      case 'suspend':
        suspendUser(selectedUser.id, actionReason)
        break
      case 'reactivate':
        reactivateUser(selectedUser.id)
        break
    }

    setShowActionModal(false)
    setSelectedUser(null)
    setActionType('')
    setActionReason('')
  }

  const getStatusBadge = (status) => {
    const styles = {
      active: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200',
      suspended: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200',
      banned: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
    }
    return styles[status] || styles.active
  }

  const getRiskLevel = (user) => {
    if (user.reportCount >= 3) return { level: 'high', color: 'text-red-500' }
    if (user.reportCount >= 1) return { level: 'medium', color: 'text-yellow-500' }
    return { level: 'low', color: 'text-green-500' }
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
          User Management
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Monitor and manage platform users
        </p>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="card p-6"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search users by name or email..."
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
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="banned">Banned</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Users Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="card p-6"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">User</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Join Date</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Activity</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Risk Level</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => {
                const risk = getRiskLevel(user)
                return (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(user.status)}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-700 dark:text-gray-300">
                      {new Date(user.joinDate).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm">
                        <p className="text-gray-900 dark:text-white">{user.completedSwaps} swaps</p>
                        <p className="text-gray-500 dark:text-gray-400">★ {user.rating}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className={`h-4 w-4 ${risk.color}`} />
                        <span className={`text-sm font-medium ${risk.color}`}>
                          {risk.level}
                        </span>
                        {user.reportCount > 0 && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            ({user.reportCount} reports)
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200">
                          <Eye className="h-4 w-4" />
                        </button>
                        {user.status === 'active' && (
                          <>
                            <button
                              onClick={() => handleUserAction(user, 'suspend')}
                              className="p-2 text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg transition-colors duration-200"
                            >
                              <UserX className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleUserAction(user, 'ban')}
                              className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                            >
                              <Ban className="h-4 w-4" />
                            </button>
                          </>
                        )}
                        {(user.status === 'suspended' || user.status === 'banned') && (
                          <button
                            onClick={() => handleUserAction(user, 'reactivate')}
                            className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors duration-200"
                          >
                            <UserCheck className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Action Modal */}
      {showActionModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md p-6"
          >
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="h-6 w-6 text-red-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {actionType === 'ban' ? 'Ban User' : 
                 actionType === 'suspend' ? 'Suspend User' : 'Reactivate User'}
              </h3>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {actionType === 'reactivate' 
                ? `Are you sure you want to reactivate ${selectedUser?.name}?`
                : `You are about to ${actionType} ${selectedUser?.name}. Please provide a reason:`
              }
            </p>

            {actionType !== 'reactivate' && (
              <textarea
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                placeholder="Enter reason for this action..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent mb-4"
              />
            )}

            <div className="flex space-x-3">
              <button
                onClick={() => setShowActionModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                disabled={actionType !== 'reactivate' && !actionReason.trim()}
                className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors duration-200 ${
                  actionType === 'ban' 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : actionType === 'suspend'
                    ? 'bg-yellow-600 hover:bg-yellow-700'
                    : 'bg-green-600 hover:bg-green-700'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                Confirm {actionType === 'ban' ? 'Ban' : actionType === 'suspend' ? 'Suspend' : 'Reactivate'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default UserManagement