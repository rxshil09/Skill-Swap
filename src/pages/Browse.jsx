import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Filter, SortAsc, Grid, List } from 'lucide-react'
import { useApp } from '../contexts/AppContext'
import SkillCard from '../components/ui/SkillCard'
import SearchFilters from '../components/ui/SearchFilters'

function Browse() {
  const { skills, isAuthenticated, searchFilters, categories } = useApp()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState('rating')
  const [viewMode, setViewMode] = useState('grid')

  // Filter and sort skills
  const filteredSkills = skills.filter(skill => {
    // Search query filter
    if (searchQuery && !skill.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !skill.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !skill.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))) {
      return false
    }

    // Category filter
    if (searchFilters.category && skill.category !== searchFilters.category) {
      return false
    }

    // Rating filter
    if (searchFilters.rating && skill.rating < searchFilters.rating) {
      return false
    }

    // Location filter
    if (searchFilters.location && !skill.user.location.toLowerCase().includes(searchFilters.location.toLowerCase())) {
      return false
    }

    // Availability filter
    if (searchFilters.availability && skill.status !== searchFilters.availability) {
      return false
    }

    return true
  })

  // Sort skills
  const sortedSkills = [...filteredSkills].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating
      case 'reviews':
        return b.reviews - a.reviews
      case 'title':
        return a.title.localeCompare(b.title)
      case 'newest':
        return b.id - a.id
      default:
        return 0
    }
  })

  const handleRequestSwap = (skill) => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    
    // Create swap request
    const requestData = {
      requester: {
        id: 1, // Current user ID
        name: 'Current User',
        avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400'
      },
      skillRequested: skill.title,
      skillOffered: 'Your Skill', // This would come from a modal/form
      status: 'pending',
      message: `Hi! I'm interested in learning ${skill.title}. Would you like to exchange skills?`,
      createdAt: new Date().toISOString()
    }
    
    sendSwapRequest(requestData)
    navigate('/requests')
  }

  const handleMessage = (skill) => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    navigate('/messages')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2"
        >
          Browse Skills
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-gray-600 dark:text-gray-300"
        >
          Discover amazing skills shared by our community members
        </motion.p>
      </div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mb-6 md:mb-8"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1 relative order-1">
            <input
              type="text"
              placeholder="Search for skills, descriptions, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 md:px-4 py-2 md:py-3 pl-10 md:pl-12 text-sm md:text-base border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
            />
            <Search className="absolute left-3 md:left-4 top-2.5 md:top-3.5 h-4 w-4 md:h-5 md:w-5 text-gray-400" />
          </div>

          {/* Filter and Sort Controls */}
          <div className="flex items-center space-x-2 md:space-x-3 order-2">
            <button
              onClick={() => setShowFilters(true)}
              className="flex items-center space-x-1 md:space-x-2 px-3 md:px-4 py-2 md:py-3 text-sm border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <Filter className="h-4 w-4 md:h-5 md:w-5" />
              <span className="hidden sm:inline">Filters</span>
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-2 md:px-4 py-2 md:py-3 text-sm border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="rating">Highest Rated</option>
              <option value="reviews">Most Reviews</option>
              <option value="title">A-Z</option>
              <option value="newest">Newest</option>
            </select>

            <div className="hidden md:flex border border-gray-300 dark:border-gray-600 rounded-xl overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 md:p-3 ${viewMode === 'grid' ? 'bg-primary-500 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'} transition-colors duration-200`}
              >
                <Grid className="h-4 w-4 md:h-5 md:w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 md:p-3 ${viewMode === 'list' ? 'bg-primary-500 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'} transition-colors duration-200`}
              >
                <List className="h-4 w-4 md:h-5 md:w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Active Filters */}
        {(searchFilters.category || searchFilters.rating > 0 || searchFilters.location || searchFilters.availability) && (
          <div className="flex flex-wrap items-center gap-2 mt-3 md:mt-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">Active filters:</span>
            {searchFilters.category && (
              <span className="skill-tag text-xs">
                Category: {searchFilters.category}
              </span>
            )}
            {searchFilters.rating > 0 && (
              <span className="skill-tag text-xs">
                Rating: {searchFilters.rating}+
              </span>
            )}
            {searchFilters.location && (
              <span className="skill-tag text-xs">
                Location: {searchFilters.location}
              </span>
            )}
            {searchFilters.availability && (
              <span className="skill-tag text-xs">
                Status: {searchFilters.availability}
              </span>
            )}
          </div>
        )}
      </motion.div>

      {/* Results Count */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mb-4 md:mb-6"
      >
        <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">
          Showing {sortedSkills.length} of {skills.length} skills
        </p>
      </motion.div>

      {/* Skills Grid/List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className={viewMode === 'grid' 
          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6' 
          : 'space-y-3 md:space-y-4'
        }
      >
        {sortedSkills.map((skill, index) => (
          <motion.div
            key={skill.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <SkillCard
              skill={skill}
              onRequestSwap={handleRequestSwap}
              onMessage={handleMessage}
              className={viewMode === 'list' ? 'flex flex-row items-center space-x-6' : ''}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Empty State */}
      {sortedSkills.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center py-16"
        >
          <div className="w-24 h-24 bg-gradient-to-r from-primary-100 to-secondary-100 dark:from-primary-900/30 dark:to-secondary-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="h-12 w-12 text-primary-600 dark:text-primary-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No skills found
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Try adjusting your search criteria or filters
          </p>
          <button
            onClick={() => {
              setSearchQuery('')
              setShowFilters(true)
            }}
            className="btn-primary"
          >
            Clear Search & Filters
          </button>
        </motion.div>
      )}

      {/* Search Filters Modal */}
      <SearchFilters
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
      />
    </div>
  )
}

export default Browse