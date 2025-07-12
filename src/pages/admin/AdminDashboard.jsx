import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  FileText, 
  MessageSquare, 
  BarChart3, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Download
} from 'lucide-react'
import { useAdmin } from '../../contexts/AdminContext'

function AdminDashboard() {
  const { reports, users, pendingSkills, swapRequests, generateReport } = useAdmin()
  const [activeTab, setActiveTab] = useState('overview')

  const stats = [
    {
      title: 'Total Users',
      value: reports.userActivity.totalUsers,
      change: '+12%',
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Active Swaps',
      value: reports.swapStats.pendingSwaps,
      change: '+5%',
      icon: FileText,
      color: 'green'
    },
    {
      title: 'Pending Reviews',
      value: reports.contentModeration.pendingReviews,
      change: '-8%',
      icon: AlertTriangle,
      color: 'yellow'
    },
    {
      title: 'Completion Rate',
      value: '84.6%',
      change: '+2.1%',
      icon: TrendingUp,
      color: 'purple'
    }
  ]

  const recentActivity = [
    {
      id: 1,
      type: 'user_joined',
      message: 'New user Sarah Chen joined the platform',
      timestamp: '2 hours ago',
      icon: Users,
      color: 'green'
    },
    {
      id: 2,
      type: 'skill_flagged',
      message: 'Skill "GET RICH QUICK!!!" flagged for review',
      timestamp: '4 hours ago',
      icon: AlertTriangle,
      color: 'red'
    },
    {
      id: 3,
      type: 'swap_completed',
      message: 'Swap between Alex and Mike completed successfully',
      timestamp: '6 hours ago',
      icon: CheckCircle,
      color: 'blue'
    },
    {
      id: 4,
      type: 'user_reported',
      message: 'User reported for inappropriate behavior',
      timestamp: '8 hours ago',
      icon: Shield,
      color: 'orange'
    }
  ]

  const getStatColor = (color) => {
    const colors = {
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      yellow: 'from-yellow-500 to-yellow-600',
      purple: 'from-purple-500 to-purple-600'
    }
    return colors[color] || colors.blue
  }

  const getActivityColor = (color) => {
    const colors = {
      green: 'text-green-500 bg-green-100 dark:bg-green-900/30',
      red: 'text-red-500 bg-red-100 dark:bg-red-900/30',
      blue: 'text-blue-500 bg-blue-100 dark:bg-blue-900/30',
      orange: 'text-orange-500 bg-orange-100 dark:bg-orange-900/30'
    }
    return colors[color] || colors.blue
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Monitor and manage the SkillSwap platform
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
                <p className={`text-sm ${
                  stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change} from last month
                </p>
              </div>
              <div className={`p-3 rounded-lg bg-gradient-to-r ${getStatColor(stat.color)}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="card p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Activity
          </h3>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`p-2 rounded-full ${getActivityColor(activity.color)}`}>
                  <activity.icon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900 dark:text-white">
                    {activity.message}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {activity.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="card p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <button
              onClick={() => generateReport('user_activity')}
              className="w-full flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors duration-200"
            >
              <Download className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <span className="text-blue-900 dark:text-blue-100">Download User Report</span>
            </button>
            <button
              onClick={() => generateReport('swap_stats')}
              className="w-full flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors duration-200"
            >
              <Download className="h-5 w-5 text-green-600 dark:text-green-400" />
              <span className="text-green-900 dark:text-green-100">Download Swap Report</span>
            </button>
            <button
              onClick={() => generateReport('content_moderation')}
              className="w-full flex items-center space-x-3 p-3 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg transition-colors duration-200"
            >
              <Download className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <span className="text-purple-900 dark:text-purple-100">Download Content Report</span>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
        {/* User Growth Chart */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            User Growth
          </h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 dark:text-gray-400">Chart visualization would go here</p>
            </div>
          </div>
        </div>

        {/* Swap Status Distribution */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Swap Status Distribution
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700 dark:text-gray-300">Completed</span>
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {reports.swapStats.completedSwaps}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-gray-700 dark:text-gray-300">Pending</span>
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {reports.swapStats.pendingSwaps}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-700 dark:text-gray-300">Cancelled</span>
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {reports.swapStats.cancelledSwaps}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default AdminDashboard