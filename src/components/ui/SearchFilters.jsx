import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Filter, X, Star } from 'lucide-react'
import { useApp } from '../../contexts/AppContext'

function SearchFilters({ isOpen, onClose }) {
  const { searchFilters, updateSearchFilters, categories } = useApp()

  const handleFilterChange = (key, value) => {
    updateSearchFilters({ [key]: value })
  }

  const clearFilters = () => {
    updateSearchFilters({
      category: '',
      rating: 0,
      location: '',
      availability: ''
    })
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />

          {/* Filter Panel */}
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl z-50 overflow-y-auto"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <Filter className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Filters
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Category
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      value=""
                      checked={searchFilters.category === ''}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                      className="text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">All Categories</span>
                  </label>
                  {categories.map((category) => (
                    <label key={category} className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        value={category}
                        checked={searchFilters.category === category}
                        onChange={(e) => handleFilterChange('category', e.target.value)}
                        className="text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Rating Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Minimum Rating
                </label>
                <div className="space-y-2">
                  {[0, 3, 4, 4.5].map((rating) => (
                    <label key={rating} className="flex items-center">
                      <input
                        type="radio"
                        name="rating"
                        value={rating}
                        checked={searchFilters.rating === rating}
                        onChange={(e) => handleFilterChange('rating', parseFloat(e.target.value))}
                        className="text-primary-600 focus:ring-primary-500"
                      />
                      <div className="ml-2 flex items-center space-x-1">
                        {rating === 0 ? (
                          <span className="text-sm text-gray-700 dark:text-gray-300">Any Rating</span>
                        ) : (
                          <>
                            <span className="text-sm text-gray-700 dark:text-gray-300">{rating}+</span>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 w-3 ${
                                    i < Math.floor(rating)
                                      ? 'text-yellow-400 fill-current'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Location Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="Enter city or region"
                  value={searchFilters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  className="input-field"
                />
              </div>

              {/* Availability Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Availability
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="availability"
                      value=""
                      checked={searchFilters.availability === ''}
                      onChange={(e) => handleFilterChange('availability', e.target.value)}
                      className="text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Any Availability</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="availability"
                      value="available"
                      checked={searchFilters.availability === 'available'}
                      onChange={(e) => handleFilterChange('availability', e.target.value)}
                      className="text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Available Now</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="availability"
                      value="busy"
                      checked={searchFilters.availability === 'busy'}
                      onChange={(e) => handleFilterChange('availability', e.target.value)}
                      className="text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Limited Availability</span>
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                <button
                  onClick={clearFilters}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                >
                  Clear All
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 btn-primary py-2 px-4"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default SearchFilters