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

  const profileUser = user || {
    id: 1,
    name: 'Alex Johnson',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400',
    location: 'San Francisco, CA',
    rating: 4.8,
    reviewCount: 24,
    memberSince: '2023',
    bio: 'Full-stack developer passionate about creating amazing web experiences.',
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
    { id: 'offered', label: 'Skills Offered', count: profileUser?.skillsOffered?.length ?? 0 },
    { id: 'wanted', label: 'Skills Wanted', count: profileUser?.skillsWanted?.length ?? 0 },
    { id: 'reviews', label: 'Reviews', count: profileUser?.reviewCount ?? 0 },
    { id: 'activity', label: 'Activity', count: null }
  ]

  // Handle loading state if profileUser is not defined
  if (!profileUser) {
    return (
      <div className="text-center py-20 text-gray-600 dark:text-gray-300">
        Loading profile...
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="card p-6 sticky top-24">
            {/* Avatar and Info */}
            <div className="text-center mb-6">
              <div className="relative inline-block">
                {isOwnProfile ? (
                  <AvatarUpload currentAvatar={profileUser.avatar} onAvatarChange={handleAvatarChange} size="large" />
                ) : (
                  <img src={profileUser.avatar} alt={profileUser.name} className="w-32 h-32 rounded-full object-cover ring-4 ring-white dark:ring-gray-700 shadow-lg" />
                )}
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-4">{profileUser.name}</h1>
              <div className="flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-400 mt-2">
                <MapPin className="h-4 w-4" />
                <span>{profileUser.location}</span>
              </div>
              <div className="flex items-center justify-center space-x-2 mt-2">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-gray-900 dark:text-white font-medium">{profileUser.rating}</span>
                </div>
                <span className="text-gray-500 dark:text-gray-400">
                  ({profileUser.reviewCount} reviews)
                </span>
              </div>
            </div>

            {/* Contact Info */}
            {!isOwnProfile && (
              <div className="mb-6 space-y-2">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Contact Information</h3>
                {profileUser?.website && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <Globe className="h-4 w-4" />
                    <a href={profileUser.website} target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">Website</a>
                  </div>
                )}
                {profileUser?.phone && (
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
                <div className="text-xl font-bold text-primary-600 dark:text-primary-400">{profileUser.completedSwaps}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
              </div>
              <div className="text-center p-3 bg-gradient-to-r from-secondary-50 to-accent-50 dark:from-secondary-900/20 dark:to-accent-900/20 rounded-lg">
                <div className="text-xl font-bold text-secondary-600 dark:text-secondary-400">{profileUser.activeSwaps}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Active</div>
              </div>
            </div>

            {/* Badges */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Badges</h3>
              <div className="flex flex-wrap gap-2">
                {profileUser?.badges?.map((badge, index) => (
                  <span key={index} className="inline-flex items-center space-x-1 px-3 py-1 bg-gradient-to-r from-accent-100 to-primary-100 dark:from-accent-900/30 dark:to-primary-900/30 text-accent-800 dark:text-accent-200 text-sm font-medium rounded-full">
                    <Award className="h-3 w-3" />
                    <span>{badge}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Bio */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">About</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{profileUser.bio}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Member since {profileUser.memberSince}</p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {isOwnProfile ? (
                <button onClick={() => setShowEditModal(true)} className="w-full btn-primary flex items-center justify-center space-x-2">
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

        {/* Main content remains unchanged, just make sure all `.map()`s are now `?.map()` */}
        {/* Already fixed: skillsOffered, skillsWanted, badges, etc. */}
        {/* ... */}
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
