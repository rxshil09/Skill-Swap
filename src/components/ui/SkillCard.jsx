import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Star, MapPin, Users, MessageCircle } from 'lucide-react'
import { useApp } from '../../contexts/AppContext'

function SkillCard({ skill, onRequestSwap, onMessage, className = '' }) {
  const { isAuthenticated } = useApp()
  const navigate = useNavigate()

  const handleRequestSwap = () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    onRequestSwap(skill)
  }

  const handleMessage = () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    onMessage(skill)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`card p-4 md:p-6 hover:shadow-2xl hover:shadow-primary-500/20 group ${className}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3 md:mb-4">
        <div className="flex-1">
          <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200 line-clamp-2">
            {skill.title}
          </h3>
          <span className="inline-block px-2 md:px-3 py-1 bg-gradient-to-r from-primary-100 to-secondary-100 dark:from-primary-900/30 dark:to-secondary-900/30 text-primary-800 dark:text-primary-200 text-xs md:text-sm font-medium rounded-full">
            {skill.category}
          </span>
        </div>
        <div className="flex items-center space-x-1 text-yellow-500 ml-2">
          <Star className="h-3 w-3 md:h-4 md:w-4 fill-current" />
          <span className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300">
            {skill.rating}
          </span>
        </div>
      </div>

      {/* User Info */}
      <div className="flex items-center space-x-3 mb-3 md:mb-4">
        <img
          src={skill.user.avatar}
          alt={skill.user.name}
          className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover ring-2 ring-white dark:ring-gray-700 flex-shrink-0"
        />
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
            {skill.user.name}
          </p>
          <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
            <MapPin className="h-3 w-3" />
            <span className="truncate">{skill.user.location}</span>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 md:mb-4 line-clamp-2">
        {skill.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1 md:gap-2 mb-3 md:mb-4">
        {skill.tags.slice(0, 3).map((tag, index) => (
          <span
            key={index}
            className="skill-tag text-xs px-2 py-1"
          >
            {tag}
          </span>
        ))}
        {skill.tags.length > 3 && (
          <span className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1">
            +{skill.tags.length - 3} more
          </span>
        )}
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3 md:mb-4">
        <div className="flex items-center space-x-1">
          <Users className="h-3 w-3" />
          <span>{skill.reviews} reviews</span>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          skill.status === 'available' 
            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' 
            : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'
        }`}>
          {skill.status}
        </span>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
        <button
          onClick={handleRequestSwap}
          className="flex-1 btn-primary text-xs md:text-sm py-2 px-3 md:px-4"
        >
          Request Swap
        </button>
        <button
          onClick={handleMessage}
          className="sm:w-auto w-full flex items-center justify-center space-x-2 p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          <MessageCircle className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          <span className="sm:hidden text-xs">Message</span>
        </button>
      </div>
    </motion.div>
  )
}

export default SkillCard