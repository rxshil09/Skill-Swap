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
  TrendingUp
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

  // Mock user data - in real app, fetch based on id
  const profileUser = user || {
    id: 1,
    name: 'Alex Johnson',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400',
    location: 'San Francisco, CA',
    rating: 4.8,
    reviewCount: 24,
    memberSince: '2023',
    bio: 'Full-stack developer passionate about creating amazing web experiences. I love sharing knowledge and learning new skills from the community.',
    skillsOffered: [
      { name: 'Web Development', level: 'Expert', students: 15 },
      { name: 'React', level: 'Expert', students: 12 },
      { name: 'Node.js', level: 'Advanced', students: 8 },
      { name: 'JavaScript', level: 'Expert', students: 20 }
    ],
    skillsWanted: [
      { name: 'UI/UX Design', level: 'Beginner' },
      { name: 'Photography', level: 'Intermediate' },
      { name: 'Spanish', level: 'Beginner' },
      { name: 'Digital Marketing', level: 'Beginner' }
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

  const tabs = [
    { id: 'offered', label: 'Skills Offered', count: profileUser.skillsOffered.length },
    { id: 'wanted', label: 'Skills Wanted', count: profileUser.skillsWanted.length },
    { id: 'reviews', label: 'Reviews', count: profileUser.reviewCount },
    { id: 'activity', label: 'Activity', count: null }
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Sidebar */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="card p-6 sticky top-24"
          >
            {/* Avatar and Basic Info */}
            <div className="text-center mb-6">
              <div className="relative inline-block">
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
                    className="w-32 h-32 rounded-full object-cover ring-4 ring-white dark:ring-gray-700 shadow-lg"
                  />
                )}
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-4">
                {profileUser.name}
              </h1>
              <div className="flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-400 mt-2">
                <MapPin className="h-4 w-4" />
                <span>{profileUser.location}</span>
              </div>
              <div className="flex items-center justify-center space-x-2 mt-2">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-gray-900 dark:text-white font-medium">
                    {profileUser.rating}
                  </span>
                </div>
                <span className="text-gray-500 dark:text-gray-400">
                  ({profileUser.reviewCount} reviews)
                </span>
              </div>
            </div>

            {/* Contact Info */}
            {!isOwnProfile && (
              <div className="mb-6 space-y-2">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Contact Information
                </h3>
                {profileUser.website && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <Globe className="h-4 w-4" />
                    <a 
                      href={profileUser.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary-600 dark:text-primary-400 hover:underline"
                    >
                      Website
                    </a>
                  </div>
                )}
                {profileUser.phone && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <Phone className="h-4 w-4" />
                    <span>{profileUser.phone}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {profileUser.memberSince}</span>
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-3 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-lg">
                <div className="text-xl font-bold text-primary-600 dark:text-primary-400">
                  {profileUser.completedSwaps}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Completed
                </div>
              </div>
              <div className="text-center p-3 bg-gradient-to-r from-secondary-50 to-accent-50 dark:from-secondary-900/20 dark:to-accent-900/20 rounded-lg">
                <div className="text-xl font-bold text-secondary-600 dark:text-secondary-400">
                  {profileUser.activeSwaps}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Active
                </div>
              </div>
            </div>

            {/* Badges */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Badges
              </h3>
              <div className="flex flex-wrap gap-2">
                {profileUser.badges.map((badge, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center space-x-1 px-3 py-1 bg-gradient-to-r from-accent-100 to-primary-100 dark:from-accent-900/30 dark:to-primary-900/30 text-accent-800 dark:text-accent-200 text-sm font-medium rounded-full"
                  >
                    <Award className="h-3 w-3" />
                    <span>{badge}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Bio */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                About
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                {profileUser.bio}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Member since {profileUser.memberSince}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {isOwnProfile ? (
                <button
                  onClick={() => setShowEditModal(true)}
                  className="w-full btn-primary flex items-center justify-center space-x-2"
                >
                  <Edit3 className="h-4 w-4" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <>
                  <button className="w-full btn-primary flex items-center justify-center space-x-2">
                    <MessageCircle className="h-4 w-4" />
                    <span>Send Message</span>
                  </button>
                  <button className="w-full btn-secondary flex items-center justify-center space-x-2">
                    <Plus className="h-4 w-4" />
                    <span>Request Swap</span>
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="card p-6"
          >
            <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1 mb-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.count !== null && (
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      activeTab === tab.id
                        ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-200'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'offered' && (
              <div className="space-y-4">
                {profileUser.skillsOffered.map((skill, index) => (
                  <motion.div key={skill.name}>
                    <SkillBadge
                      skill={skill}
                      type="offered"
                      showStats={true}
                      onEdit={isOwnProfile ? (skill) => console.log('Edit skill:', skill) : null}
                      onDelete={isOwnProfile ? handleSkillDelete : null}
                    />
                  </motion.div>
                ))}
                {isOwnProfile && (
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                    onClick={() => setShowEditModal(true)}
                    className="w-full p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-primary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 flex items-center justify-center space-x-2"
                  >
                    <Plus className="h-5 w-5" />
                    <span>Add Skill</span>
                  </motion.button>
                )}
              </div>
            )}

            {activeTab === 'wanted' && (
              <div className="space-y-4">
                {profileUser.skillsWanted.map((skill, index) => (
                  <motion.div key={skill.name}>
                    <SkillBadge
                      skill={skill}
                      type="wanted"
                      onEdit={isOwnProfile ? (skill) => console.log('Edit skill:', skill) : null}
                      onDelete={isOwnProfile ? handleSkillDelete : null}
                    />
                  </motion.div>
                ))}
                {isOwnProfile && (
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                    onClick={() => setShowEditModal(true)}
                    className="w-full p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-accent-400 hover:text-accent-600 dark:hover:text-accent-400 transition-colors duration-200 flex items-center justify-center space-x-2"
                  >
                    <Plus className="h-5 w-5" />
                    <span>Add Wanted Skill</span>
                  </motion.button>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {/* Review Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                      {profileUser.rating}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Average Rating
                    </div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-r from-secondary-50 to-accent-50 dark:from-secondary-900/20 dark:to-accent-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-secondary-600 dark:text-secondary-400">
                      {profileUser.reviewCount}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Total Reviews
                    </div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-r from-accent-50 to-primary-50 dark:from-accent-900/20 dark:to-primary-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-accent-600 dark:text-accent-400">
                      95%
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Positive
                    </div>
                  </div>
                </div>

                {/* Mock reviews */}
                {[
                  {
                    reviewer: 'Sarah Chen',
                    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400',
                    rating: 5,
                    skill: 'Web Development',
                    comment: 'Alex is an amazing teacher! Really helped me understand React concepts.',
                    date: '2024-01-15'
                  },
                  {
                    reviewer: 'Mike Rodriguez',
                    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400',
                    rating: 5,
                    skill: 'JavaScript',
                    comment: 'Excellent communication and very patient. Highly recommend!',
                    date: '2024-01-10'
                  }
                ].map((review, index) => (
                  <motion.div
                    key={review.reviewer}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                  >
                    <div className="flex items-start space-x-3">
                      <img
                        src={review.avatar}
                        alt={review.reviewer}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h5 className="font-medium text-gray-900 dark:text-white">
                              {review.reviewer}
                            </h5>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {review.skill}
                            </p>
                          </div>
                          <div className="flex items-center space-x-1">
                            {[...Array(review.rating)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 text-sm">
                          {review.comment}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                          {review.date}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="space-y-4">
                {/* Activity Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="p-4 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <TrendingUp className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                      <div>
                        <div className="text-lg font-bold text-gray-900 dark:text-white">
                          {profileUser.completedSwaps}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Successful Swaps
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-secondary-50 to-accent-50 dark:from-secondary-900/20 dark:to-accent-900/20 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Clock className="h-8 w-8 text-secondary-600 dark:text-secondary-400" />
                      <div>
                        <div className="text-lg font-bold text-gray-900 dark:text-white">
                          {profileUser.activeSwaps}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Active Swaps
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mock activity */}
                {[
                  {
                    type: 'swap_completed',
                    description: 'Completed a skill swap: Web Development ↔ Photography',
                    time: '2 days ago',
                    icon: CheckCircle,
                    color: 'text-green-500'
                  },
                  {
                    type: 'review_received',
                    description: 'Received a 5-star review for JavaScript tutoring',
                    time: '1 week ago',
                    icon: Star,
                    color: 'text-yellow-500'
                  },
                  {
                    type: 'skill_added',
                    description: 'Added Node.js to offered skills',
                    time: '2 weeks ago',
                    icon: Plus,
                    color: 'text-blue-500'
                  }
                ].map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <activity.icon className={`h-5 w-5 ${activity.color}`} />
                    <div className="flex-1">
                      <p className="text-gray-900 dark:text-white text-sm">
                        {activity.description}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
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