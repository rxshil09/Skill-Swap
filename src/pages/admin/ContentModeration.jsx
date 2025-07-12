import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Eye,
  Flag,
  Clock
} from 'lucide-react'
import { useAdmin } from '../../contexts/AdminContext'

function ContentModeration() {
  const { pendingSkills, approveSkill, rejectSkill } = useAdmin()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedSkill, setSelectedSkill] = useState(null)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')

  const filteredSkills = pendingSkills.filter(skill => {
    const matchesSearch = skill.skillName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         skill.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         skill.userName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || skill.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleApprove = (skillId) => {
    approveSkill(skillId)
  }

  const handleReject = (skill) => {
    setSelectedSkill(skill)
    setShowRejectModal(true)
  }

  const confirmReject = () => {
    if (!rejectionReason.trim()) return
    rejectSkill(selectedSkill.id, rejectionReason)
    setShowRejectModal(false)
    setSelectedSkill(null)
    setRejectionReason('')
  }

  const getStatusBadge = (status, flagged) => {
    if (flagged) {
      return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 border border-red-300 dark:border-red-700'
    }
    
    const styles = {
      pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200',
      approved: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200',
      rejected: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
    }
    return styles[status] || styles.pending
  }

  const getLevelColor = (level) => {
    const colors = {
      'Beginner': 'text-green-600 dark:text-green-400',
      'Intermediate': 'text-yellow-600 dark:text-yellow-400',
      'Advanced': 'text-orange-600 dark:text-orange-400',
      'Expert': 'text-red-600 dark:text-red-400'
    }
    return colors[level] || colors.Beginner
  }

  const isSpammy = (description) => {
    const spamKeywords = ['get rich quick', 'make money fast', 'click here', 'buy now', '!!!', '$$$']
    return spamKeywords.some(keyword => description.toLowerCase().includes(keyword))
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
          Content Moderation
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Review and moderate skill submissions
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
              placeholder="Search skills by name, description, or user..."
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
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Skills List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="space-y-4"
      >
        {filteredSkills.map((skill, index) => (
          <motion.div
            key={skill.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`card p-6 ${skill.flagged ? 'border-2 border-red-300 dark:border-red-700' : ''}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {/* Header */}
                <div className="flex items-center space-x-3 mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {skill.skillName}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(skill.status, skill.flagged)}`}>
                    {skill.flagged ? (
                      <div className="flex items-center space-x-1">
                        <Flag className="h-3 w-3" />
                        <span>Flagged</span>
                      </div>
                    ) : (
                      skill.status
                    )}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(skill.level)}`}>
                    {skill.level}
                  </span>
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-xs">
                    {skill.category}
                  </span>
                </div>

                {/* User Info */}
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Submitted by:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{skill.userName}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    on {new Date(skill.submittedAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Description */}
                <div className="mb-4">
                  <p className={`text-gray-700 dark:text-gray-300 ${isSpammy(skill.description) ? 'bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800' : ''}`}>
                    {skill.description}
                  </p>
                  {isSpammy(skill.description) && (
                    <div className="flex items-center space-x-2 mt-2 text-red-600 dark:text-red-400">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="text-sm font-medium">Potential spam detected</span>
                    </div>
                  )}
                </div>

                {/* Rejection Reason (if rejected) */}
                {skill.status === 'rejected' && skill.rejectionReason && (
                  <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800">
                    <p className="text-sm text-red-800 dark:text-red-200">
                      <strong>Rejection Reason:</strong> {skill.rejectionReason}
                    </p>
                  </div>
                )}
              </div>

              {/* Actions */}
              {skill.status === 'pending' && (
                <div className="flex items-center space-x-2 ml-4">
                  <button className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200">
                    <Eye className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleApprove(skill.id)}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors duration-200"
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>Approve</span>
                  </button>
                  <button
                    onClick={() => handleReject(skill)}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200"
                  >
                    <XCircle className="h-4 w-4" />
                    <span>Reject</span>
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        ))}

        {filteredSkills.length === 0 && (
          <div className="card p-12 text-center">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No skills found
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              No skills match your current search and filter criteria.
            </p>
          </div>
        )}
      </motion.div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md p-6"
          >
            <div className="flex items-center space-x-3 mb-4">
              <XCircle className="h-6 w-6 text-red-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Reject Skill
              </h3>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              You are about to reject "{selectedSkill?.skillName}". Please provide a reason:
            </p>

            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter reason for rejection..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent mb-4"
            />

            <div className="flex space-x-3">
              <button
                onClick={() => setShowRejectModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmReject}
                disabled={!rejectionReason.trim()}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reject Skill
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default ContentModeration