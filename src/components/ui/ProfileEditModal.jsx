import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Save, Plus, Trash2, Camera } from 'lucide-react'
import { useApp } from '../../contexts/AppContext'
import toast from 'react-hot-toast'

function ProfileEditModal({ isOpen, onClose, user }) {
  const { updateProfile, categories } = useApp()
  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    location: user?.location || '',
    website: user?.website || '',
    phone: user?.phone || '',
    skillsOffered: user?.skillsOffered || [],
    skillsWanted: user?.skillsWanted || []
  })
  const [newSkillOffered, setNewSkillOffered] = useState({ name: '', level: 'Beginner', category: '' })
  const [newSkillWanted, setNewSkillWanted] = useState({ name: '', level: 'Beginner', category: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    updateProfile(formData)
    onClose()
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const addSkillOffered = () => {
    if (!newSkillOffered.name.trim()) {
      toast.error('Please enter a skill name')
      return
    }
    
    const skill = {
      ...newSkillOffered,
      id: Date.now(),
      students: 0
    }
    
    setFormData(prev => ({
      ...prev,
      skillsOffered: [...prev.skillsOffered, skill]
    }))
    setNewSkillOffered({ name: '', level: 'Beginner', category: '' })
  }

  const addSkillWanted = () => {
    if (!newSkillWanted.name.trim()) {
      toast.error('Please enter a skill name')
      return
    }
    
    const skill = {
      ...newSkillWanted,
      id: Date.now()
    }
    
    setFormData(prev => ({
      ...prev,
      skillsWanted: [...prev.skillsWanted, skill]
    }))
    setNewSkillWanted({ name: '', level: 'Beginner', category: '' })
  }

  const removeSkillOffered = (skillId) => {
    setFormData(prev => ({
      ...prev,
      skillsOffered: prev.skillsOffered.filter(skill => skill.id !== skillId)
    }))
  }

  const removeSkillWanted = (skillId) => {
    setFormData(prev => ({
      ...prev,
      skillsWanted: prev.skillsWanted.filter(skill => skill.id !== skillId)
    }))
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
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Edit Profile
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              {/* Content */}
              <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
                <form onSubmit={handleSubmit} className="p-6 space-y-8">
                  {/* Basic Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Basic Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => handleChange('name', e.target.value)}
                          className="input-field"
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Location
                        </label>
                        <input
                          type="text"
                          value={formData.location}
                          onChange={(e) => handleChange('location', e.target.value)}
                          className="input-field"
                          placeholder="City, State/Country"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Website
                        </label>
                        <input
                          type="url"
                          value={formData.website}
                          onChange={(e) => handleChange('website', e.target.value)}
                          className="input-field"
                          placeholder="https://your-website.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Phone
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleChange('phone', e.target.value)}
                          className="input-field"
                          placeholder="Your phone number"
                        />
                      </div>
                    </div>
                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Bio
                      </label>
                      <textarea
                        value={formData.bio}
                        onChange={(e) => handleChange('bio', e.target.value)}
                        rows={4}
                        className="input-field"
                        placeholder="Tell us about yourself..."
                      />
                    </div>
                  </div>

                  {/* Skills Offered */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Skills I Can Teach
                    </h3>
                    
                    {/* Add New Skill */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <input
                        type="text"
                        value={newSkillOffered.name}
                        onChange={(e) => setNewSkillOffered(prev => ({ ...prev, name: e.target.value }))}
                        className="input-field"
                        placeholder="Skill name"
                      />
                      <select
                        value={newSkillOffered.category}
                        onChange={(e) => setNewSkillOffered(prev => ({ ...prev, category: e.target.value }))}
                        className="input-field"
                      >
                        <option value="">Select category</option>
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                      <select
                        value={newSkillOffered.level}
                        onChange={(e) => setNewSkillOffered(prev => ({ ...prev, level: e.target.value }))}
                        className="input-field"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                        <option value="Expert">Expert</option>
                      </select>
                      <button
                        type="button"
                        onClick={addSkillOffered}
                        className="btn-primary flex items-center justify-center space-x-2"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Add</span>
                      </button>
                    </div>

                    {/* Skills List */}
                    <div className="space-y-3">
                      {formData.skillsOffered.map((skill) => (
                        <div
                          key={skill.id}
                          className="flex items-center justify-between p-3 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-lg border border-primary-200 dark:border-primary-800"
                        >
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {skill.name}
                            </h4>
                            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                              <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-200 rounded-full text-xs">
                                {skill.level}
                              </span>
                              {skill.category && (
                                <span className="px-2 py-1 bg-secondary-100 dark:bg-secondary-900/30 text-secondary-800 dark:text-secondary-200 rounded-full text-xs">
                                  {skill.category}
                                </span>
                              )}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeSkillOffered(skill.id)}
                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Skills Wanted */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Skills I Want to Learn
                    </h3>
                    
                    {/* Add New Skill */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <input
                        type="text"
                        value={newSkillWanted.name}
                        onChange={(e) => setNewSkillWanted(prev => ({ ...prev, name: e.target.value }))}
                        className="input-field"
                        placeholder="Skill name"
                      />
                      <select
                        value={newSkillWanted.category}
                        onChange={(e) => setNewSkillWanted(prev => ({ ...prev, category: e.target.value }))}
                        className="input-field"
                      >
                        <option value="">Select category</option>
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                      <select
                        value={newSkillWanted.level}
                        onChange={(e) => setNewSkillWanted(prev => ({ ...prev, level: e.target.value }))}
                        className="input-field"
                      >
                        <option value="Beginner">Beginner Level</option>
                        <option value="Intermediate">Intermediate Level</option>
                        <option value="Advanced">Advanced Level</option>
                      </select>
                      <button
                        type="button"
                        onClick={addSkillWanted}
                        className="btn-secondary flex items-center justify-center space-x-2"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Add</span>
                      </button>
                    </div>

                    {/* Skills List */}
                    <div className="space-y-3">
                      {formData.skillsWanted.map((skill) => (
                        <div
                          key={skill.id}
                          className="flex items-center justify-between p-3 bg-gradient-to-r from-accent-50 to-secondary-50 dark:from-accent-900/20 dark:to-secondary-900/20 rounded-lg border border-accent-200 dark:border-accent-800"
                        >
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {skill.name}
                            </h4>
                            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                              <span className="px-2 py-1 bg-accent-100 dark:bg-accent-900/30 text-accent-800 dark:text-accent-200 rounded-full text-xs">
                                Seeking {skill.level}
                              </span>
                              {skill.category && (
                                <span className="px-2 py-1 bg-secondary-100 dark:bg-secondary-900/30 text-secondary-800 dark:text-secondary-200 rounded-full text-xs">
                                  {skill.category}
                                </span>
                              )}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeSkillWanted(skill.id)}
                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </form>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end space-x-4 p-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="btn-primary flex items-center space-x-2 px-6 py-2"
                >
                  <Save className="h-4 w-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default ProfileEditModal