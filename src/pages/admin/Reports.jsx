import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Download, 
  Calendar, 
  Users, 
  FileText, 
  BarChart3,
  TrendingUp,
  Activity,
  Shield
} from 'lucide-react'
import { useAdmin } from '../../contexts/AdminContext'

function Reports() {
  const { reports, generateReport } = useAdmin()
  const [selectedDateRange, setSelectedDateRange] = useState('last_30_days')

  const reportTypes = [
    {
      id: 'user_activity',
      title: 'User Activity Report',
      description: 'Comprehensive user statistics including registrations, activity levels, and engagement metrics',
      icon: Users,
      color: 'blue',
      fields: ['User ID', 'Name', 'Email', 'Status', 'Join Date', 'Last Active', 'Completed Swaps', 'Rating']
    },
    {
      id: 'swap_stats',
      title: 'Swap Statistics Report',
      description: 'Detailed analysis of skill exchanges including success rates, popular skills, and completion times',
      icon: FileText,
      color: 'green',
      fields: ['Swap ID', 'Requester', 'Recipient', 'Skills', 'Status', 'Created Date', 'Completion Date']
    },
    {
      id: 'content_moderation',
      title: 'Content Moderation Report',
      description: 'Content review statistics including flagged content, approval rates, and moderation actions',
      icon: Shield,
      color: 'orange',
      fields: ['Content ID', 'Type', 'User', 'Status', 'Flagged Reason', 'Review Date', 'Action Taken']
    },
    {
      id: 'platform_analytics',
      title: 'Platform Analytics Report',
      description: 'Overall platform performance metrics including growth trends and user engagement',
      icon: BarChart3,
      color: 'purple',
      fields: ['Date', 'New Users', 'Active Users', 'Swaps Created', 'Swaps Completed', 'Revenue']
    }
  ]

  const dateRanges = [
    { value: 'last_7_days', label: 'Last 7 Days' },
    { value: 'last_30_days', label: 'Last 30 Days' },
    { value: 'last_90_days', label: 'Last 90 Days' },
    { value: 'last_year', label: 'Last Year' },
    { value: 'custom', label: 'Custom Range' }
  ]

  const getIconColor = (color) => {
    const colors = {
      blue: 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30',
      green: 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30',
      orange: 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30',
      purple: 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30'
    }
    return colors[color] || colors.blue
  }

  const handleGenerateReport = (reportType) => {
    generateReport(reportType)
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
          Reports & Analytics
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Generate and download comprehensive platform reports
        </p>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        {[
          { 
            label: 'Total Users', 
            value: reports.userActivity.totalUsers, 
            change: '+12%', 
            icon: Users,
            color: 'blue'
          },
          { 
            label: 'Active Swaps', 
            value: reports.swapStats.pendingSwaps, 
            change: '+5%', 
            icon: Activity,
            color: 'green'
          },
          { 
            label: 'Content Reviews', 
            value: reports.contentModeration.pendingReviews, 
            change: '-8%', 
            icon: Shield,
            color: 'orange'
          },
          { 
            label: 'Success Rate', 
            value: '84.6%', 
            change: '+2.1%', 
            icon: TrendingUp,
            color: 'purple'
          }
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
                <p className={`text-sm ${
                  stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change} from last month
                </p>
              </div>
              <div className={`p-3 rounded-lg ${getIconColor(stat.color)}`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Date Range Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="card p-6"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Report Date Range
          </h3>
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-gray-500" />
            <select
              value={selectedDateRange}
              onChange={(e) => setSelectedDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {dateRanges.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Report Types */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {reportTypes.map((report, index) => (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
            className="card p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-lg ${getIconColor(report.color)}`}>
                  <report.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {report.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {report.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Report Fields */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Included Fields:
              </h4>
              <div className="flex flex-wrap gap-2">
                {report.fields.slice(0, 4).map((field, fieldIndex) => (
                  <span
                    key={fieldIndex}
                    className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs rounded-full"
                  >
                    {field}
                  </span>
                ))}
                {report.fields.length > 4 && (
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs rounded-full">
                    +{report.fields.length - 4} more
                  </span>
                )}
              </div>
            </div>

            {/* Download Button */}
            <button
              onClick={() => handleGenerateReport(report.id)}
              className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-colors duration-200 ${
                report.color === 'blue' ? 'bg-blue-600 hover:bg-blue-700 text-white' :
                report.color === 'green' ? 'bg-green-600 hover:bg-green-700 text-white' :
                report.color === 'orange' ? 'bg-orange-600 hover:bg-orange-700 text-white' :
                'bg-purple-600 hover:bg-purple-700 text-white'
              }`}
            >
              <Download className="h-4 w-4" />
              <span>Download Report</span>
            </button>
          </motion.div>
        ))}
      </motion.div>

      {/* Recent Downloads */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="card p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Recent Downloads
        </h3>
        
        <div className="space-y-3">
          {[
            { name: 'User Activity Report', date: '2024-01-16', size: '2.3 MB', type: 'user_activity' },
            { name: 'Swap Statistics Report', date: '2024-01-15', size: '1.8 MB', type: 'swap_stats' },
            { name: 'Content Moderation Report', date: '2024-01-14', size: '945 KB', type: 'content_moderation' }
          ].map((download, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {download.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {download.date} • {download.size}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleGenerateReport(download.type)}
                className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium text-sm"
              >
                Download Again
              </button>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export default Reports