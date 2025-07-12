import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  MapPin,
  Star,
  MessageCircle,
  Plus,
  Edit3,
  Camera,
  Award,
  Users,
  Clock,
  CheckCircle,
  Globe,
  Phone,
  Mail,
  Calendar,
  TrendingUp,
  Save,
  X
} from 'lucide-react'
import { useApp } from '../contexts/AppContext'
import ProfileEditModal from '../components/ui/ProfileEditModal'
import AvatarUpload from '../components/ui/AvatarUpload'
import SkillBadge from '../components/ui/SkillBadge'

function Profile() {
  const { id } = useParams()
  const { user, isAuthenticated, updateProfile, deleteSkill } = useApp()
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState('offered')
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingField, setEditingField] = useState(null)
  const [tempValues, setTempValues] = useState({})

  const profileUser = user || {
    id: 1,
    name: 'Alex Johnson',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400',
    location: 'San Francisco, CA',
    rating: 4.8,
    reviewCount: 24,
    memberSince: '2023',
    bio: 'Full-stack developer passionate about creating amazing web experiences.',
    website: 'https://alexjohnson.dev',
    phone: '+1 (555) 123-4567',
    skillsOffered: [
      { id: 1, name: 'Web Development', level: 'Expert', students: 15, category: 'Technology' },
      { id: 2, name: 'React', level: 'Expert', students: 12, category: 'Technology' },
      { id: 3, name: 'Node.js', level: 'Advanced', students: 8, category: 'Technology' },
      { id: 4, name: 'JavaScript', level: 'Expert', students: 20, category: 'Technology' }
    ],
    skillsWanted: [
      { id: 5, name: 'UI/UX Design', level: 'Beginner', category: 'Design' },
      { id: 6, name: 'Photography', level: 'Intermediate', category: 'Creative' },
      { id: 7, name: 'Spanish', level: 'Beginner', category: 'Language' },
      { id: 8, name: 'Digital Marketing', level: 'Beginner', category: 'Business' }
    ],
    completedSwaps: 18,
    activeSwaps: 3,
    badges: ['Verified', 'Top Rated', 'Quick Responder']
  }

  const isOwnProfile = !id || (user && user.id === parseInt(id))

  const handleAvatarChange = (newAvatarUrl) => {
    updateProfile({ avatar: newAvatarUrl })
  }

  const handleSkillDelete = (skillId) => {
    deleteSkill(skillId)
  }

  const startEditing = (field, currentValue) => {
    setEditingField(field)
    setTempValues({ [field]: currentValue })
  }

  const saveField = (field) => {
    updateProfile({ [field]: tempValues[field] })
    setEditingField(null)
    setTempValues({})
  }

  const cancelEditing = () => {
    setEditingField(null)
    setTempValues({})
  }

  const tabs = [
    { id: 'offered', label: 'Skills Offered', count: profileUser?.skillsOffered?.length ?? 0 },
    { id: 'wanted', label: 'Skills Wanted', count: profileUser?.skillsWanted?.length ?? 0 },
    { id: 'reviews', label: 'Reviews', count: profileUser?.reviewCount ?? 0 },
    { id: 'activity', label: 'Activity', count: null }
  ]

  if (!profileUser) {
    return (
      <div className="text-center py-20 text-gray-600 dark:text-gray-300">
        Loading profile...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 via-secondary-500 to-accent-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col lg:flex-row items-start lg:items-center space-y-6 lg:space-y-0 lg:space-x-8"
          >
            {/* Avatar */}
            <div className="relative">
              {isOwnProfile ? (
                <AvatarUpload 
                  currentAvatar={profileUser.avatar} 
                  onAvatarChange={handleAvatarChange} 
                  size="large" 
                />
              ) : (
                <img 
                  src={profileUser.avatar} 
                  alt={profileUser.name} 
                  className="w-32 h-32 rounded-full object-cover ring-4 ring-white shadow-lg" 
                />
              )}
            </div>

            {/* Basic Info */}
            <div className="flex-1 text-white">
              <div className="flex items-center space-x-4 mb-2">
                <h1 className="text-3xl md:text-4xl font-bold">{profileUser.name}</h1>
                {profileUser.badges?.map((badge, index) => (
                  <span key={index} className="inline-flex items-center space-x-1 px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm font-medium rounded-full">
                    <Award className="h-3 w-3" />
                    <span>{badge}</span>
                  </span>
                ))}
              </div>
              
              <div className="flex items-center space-x-6 mb-4">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span className="text-lg">{profileUser.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 fill-current text-yellow-300" />
                  <span className="text-lg font-medium">{profileUser.rating}</span>
                  <span className="text-white/80">({profileUser.reviewCount} reviews)</span>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center space-x-8">
                <div className="text-center">
                  <div className="text-2xl font-bold">{profileUser.completedSwaps}</div>
                  <div className="text-white/80 text-sm">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{profileUser.activeSwaps}</div>
                  <div className="text-white/80 text-sm">Active</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{profileUser.skillsOffered?.length ?? 0}</div>
                  <div className="text-white/80 text-sm">Skills Offered</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col space-y-3">
              {isOwnProfile ? (
                <button 
                  onClick={() => setShowEditModal(true)} 
                  className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 flex items-center space-x-2"
                >
                  <Edit3 className="h-4 w-4" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <>
                  <button className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 flex items-center space-x-2">
                    <MessageCircle className="h-4 w-4" />
                    <span>Send Message</span>
                  </button>
                  <button className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center space-x-2">
                    <Plus className="h-4 w-4" />
                    <span>Request Swap</span>
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - About & Contact */}
          <div className="lg:col-span-1 space-y-6">
            {/* About Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">About</h3>
                {isOwnProfile && (
                  <button
                    onClick={() => startEditing('bio', profileUser.bio)}
                    className="p-2 text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                )}
              </div>
              
              {editingField === 'bio' ? (
                <div className="space-y-3">
                  <textarea
                    value={tempValues.bio || ''}
                    onChange={(e) => setTempValues({ ...tempValues, bio: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={() => saveField('bio')}
                      className="flex items-center space-x-1 px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
                    >
                      <Save className="h-3 w-3" />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="flex items-center space-x-1 px-3 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
                    >
                      <X className="h-3 w-3" />
                      <span>Cancel</span>
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {profileUser.bio}
                </p>
              )}
              
              <div className="mt-4 flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <Calendar className="h-4 w-4" />
                <span>Member since {profileUser.memberSince}</span>
              </div>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contact Information</h3>
              <div className="space-y-3">
                {profileUser.website && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                      <Globe className="h-4 w-4" />
                      <a href={profileUser.website} target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">
                        Website
                      </a>
                    </div>
                    {isOwnProfile && (
                      <button
                        onClick={() => startEditing('website', profileUser.website)}
                        className="p-1 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                      >
                        <Edit3 className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                )}
                
                {profileUser.phone && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                      <Phone className="h-4 w-4" />
                      <span>{profileUser.phone}</span>
                    </div>
                    {isOwnProfile && (
                      <button
                        onClick={() => startEditing('phone', profileUser.phone)}
                        className="p-1 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                      >
                        <Edit3 className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                )}
                
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                  <Mail className="h-4 w-4" />
                  <span>{profileUser.email}</span>
                </div>
              </div>

              {/* Quick Edit Fields */}
              {editingField === 'website' && (
                <div className="mt-4 space-y-3">
                  <input
                    type="url"
                    value={tempValues.website || ''}
                    onChange={(e) => setTempValues({ ...tempValues, website: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="https://your-website.com"
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={() => saveField('website')}
                      className="flex items-center space-x-1 px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
                    >
                      <Save className="h-3 w-3" />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="flex items-center space-x-1 px-3 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
                    >
                      <X className="h-3 w-3" />
                      <span>Cancel</span>
                    </button>
                  </div>
                </div>
              )}

              {editingField === 'phone' && (
                <div className="mt-4 space-y-3">
                  <input
                    type="tel"
                    value={tempValues.phone || ''}
                    onChange={(e) => setTempValues({ ...tempValues, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="+1 (555) 123-4567"
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={() => saveField('phone')}
                      className="flex items-center space-x-1 px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
                    >
                      <Save className="h-3 w-3" />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="flex items-center space-x-1 px-3 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
                    >
                      <X className="h-3 w-3" />
                      <span>Cancel</span>
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Right Column - Skills & Activity */}
          <div className="lg:col-span-2">
            {/* Tab Navigation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg mb-6"
            >
              <div className="flex space-x-1 p-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-primary-500 text-white shadow-lg'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span>{tab.label}</span>
                    {tab.count !== null && (
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        activeTab === tab.id
                          ? 'bg-white/20 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                      }`}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Tab Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
            >
              {activeTab === 'offered' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Skills I Can Teach
                    </h3>
                    {isOwnProfile && (
                      <button
                        onClick={() => setShowEditModal(true)}
                        className="flex items-center space-x-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors duration-200"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Add Skill</span>
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profileUser.skillsOffered?.map((skill) => (
                      <SkillBadge
                        key={skill.id}
                        skill={skill}
                        type="offered"
                        showStats={true}
                        onDelete={isOwnProfile ? handleSkillDelete : undefined}
                      />
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'wanted' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Skills I Want to Learn
                    </h3>
                    {isOwnProfile && (
                      <button
                        onClick={() => setShowEditModal(true)}
                        className="flex items-center space-x-2 px-4 py-2 bg-secondary-500 hover:bg-secondary-600 text-white rounded-lg transition-colors duration-200"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Add Skill</span>
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profileUser.skillsWanted?.map((skill) => (
                      <SkillBadge
                        key={skill.id}
                        skill={skill}
                        type="wanted"
                        onDelete={isOwnProfile ? handleSkillDelete : undefined}
                      />
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="text-center py-12">
                  <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Reviews Coming Soon
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Review system will be available in the next update
                  </p>
                </div>
              )}

              {activeTab === 'activity' && (
                <div className="text-center py-12">
                  <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Activity Feed Coming Soon
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Activity tracking will be available in the next update
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Profile Edit Modal */}
      <ProfileEditModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        user={profileUser}
      />
    </div>
  )
}

export default Profile