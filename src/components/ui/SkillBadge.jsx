import React from 'react'
import { Star, Users, Award } from 'lucide-react'

function SkillBadge({ skill, type = 'offered', showStats = false, onEdit, onDelete }) {
  const getSkillIcon = (level) => {
    switch (level) {
      case 'Expert':
        return <Award className="h-3 w-3" />
      case 'Advanced':
        return <Star className="h-3 w-3" />
      default:
        return null
    }
  }

  const getLevelColor = (level) => {
    switch (level) {
      case 'Expert':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
      case 'Advanced':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200'
      case 'Intermediate':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200'
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'
    }
  }

  const containerClass = type === 'offered' 
    ? 'bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 border-primary-200 dark:border-primary-800'
    : 'bg-gradient-to-r from-accent-50 to-secondary-50 dark:from-accent-900/20 dark:to-secondary-900/20 border-accent-200 dark:border-accent-800'

  return (
    <div className={`p-4 rounded-lg border ${containerClass} group hover:shadow-md transition-shadow duration-200`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h4 className="font-semibold text-gray-900 dark:text-white">
              {skill.name}
            </h4>
            {skill.category && (
              <span className="px-2 py-1 bg-secondary-100 dark:bg-secondary-900/30 text-secondary-800 dark:text-secondary-200 rounded-full text-xs">
                {skill.category}
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-3 mb-2">
            <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(skill.level)}`}>
              {getSkillIcon(skill.level)}
              <span>{type === 'wanted' ? `Seeking ${skill.level}` : skill.level}</span>
            </span>
            
            {showStats && skill.students !== undefined && (
              <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
                <Users className="h-3 w-3" />
                <span>{skill.students} students</span>
              </div>
            )}
          </div>

          {skill.description && (
            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
              {skill.description}
            </p>
          )}
        </div>

        {/* Action buttons */}
        {(onEdit || onDelete) && (
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {onEdit && (
              <button
                onClick={() => onEdit(skill)}
                className="p-1 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
              >
                <Star className="h-4 w-4" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(skill.id)}
                className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
              >
                <Award className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default SkillBadge