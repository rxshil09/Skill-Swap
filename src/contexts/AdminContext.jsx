import React, { createContext, useContext, useReducer, useEffect } from 'react'
import toast from 'react-hot-toast'

const AdminContext = createContext()

const initialState = {
  isAdminAuthenticated: false,
  adminUser: null,
  users: [
    {
      id: 1,
      name: 'Alex Johnson',
      email: 'alex@example.com',
      avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400',
      location: 'San Francisco, CA',
      status: 'active',
      joinDate: '2023-01-15',
      skillsOffered: 3,
      skillsWanted: 2,
      completedSwaps: 18,
      rating: 4.8,
      reportCount: 0
    },
    {
      id: 2,
      name: 'Sarah Chen',
      email: 'sarah@example.com',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400',
      location: 'New York, NY',
      status: 'active',
      joinDate: '2023-02-20',
      skillsOffered: 2,
      skillsWanted: 3,
      completedSwaps: 12,
      rating: 4.9,
      reportCount: 0
    },
    {
      id: 3,
      name: 'Mike Rodriguez',
      email: 'mike@example.com',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400',
      location: 'Austin, TX',
      status: 'suspended',
      joinDate: '2023-03-10',
      skillsOffered: 1,
      skillsWanted: 1,
      completedSwaps: 5,
      rating: 3.2,
      reportCount: 3
    }
  ],
  pendingSkills: [
    {
      id: 1,
      userId: 2,
      userName: 'Sarah Chen',
      skillName: 'Advanced Photoshop Techniques',
      description: 'Learn professional photo editing, digital art creation, and advanced compositing techniques.',
      category: 'Design',
      level: 'Advanced',
      status: 'pending',
      submittedAt: '2024-01-16T10:30:00Z',
      flagged: false
    },
    {
      id: 2,
      userId: 4,
      userName: 'Spam User',
      skillName: 'GET RICH QUICK!!!',
      description: 'Make $5000 per day with this one simple trick! Click here to learn more! Buy my course now!!!',
      category: 'Business',
      level: 'Expert',
      status: 'pending',
      submittedAt: '2024-01-16T09:15:00Z',
      flagged: true
    }
  ],
  swapRequests: [
    {
      id: 1,
      requester: { id: 2, name: 'Sarah Chen' },
      recipient: { id: 1, name: 'Alex Johnson' },
      skillRequested: 'Web Development',
      skillOffered: 'Graphic Design',
      status: 'pending',
      createdAt: '2024-01-15T10:30:00Z',
      lastUpdated: '2024-01-15T10:30:00Z'
    },
    {
      id: 2,
      requester: { id: 3, name: 'Mike Rodriguez' },
      recipient: { id: 1, name: 'Alex Johnson' },
      skillRequested: 'Photography',
      skillOffered: 'Guitar Lessons',
      status: 'accepted',
      createdAt: '2024-01-14T15:45:00Z',
      lastUpdated: '2024-01-14T16:00:00Z'
    },
    {
      id: 3,
      requester: { id: 1, name: 'Alex Johnson' },
      recipient: { id: 2, name: 'Sarah Chen' },
      skillRequested: 'UI/UX Design',
      skillOffered: 'React Development',
      status: 'cancelled',
      createdAt: '2024-01-13T12:00:00Z',
      lastUpdated: '2024-01-13T14:30:00Z'
    }
  ],
  platformMessages: [
    {
      id: 1,
      title: 'Welcome to SkillSwap 2.0!',
      content: 'We\'re excited to announce new features including improved matching algorithms and enhanced messaging.',
      type: 'feature_update',
      status: 'sent',
      createdAt: '2024-01-10T09:00:00Z',
      sentTo: 'all_users'
    }
  ],
  reports: {
    userActivity: {
      totalUsers: 1250,
      activeUsers: 890,
      newUsersThisMonth: 45,
      bannedUsers: 12
    },
    swapStats: {
      totalSwaps: 2340,
      completedSwaps: 1980,
      pendingSwaps: 180,
      cancelledSwaps: 180
    },
    contentModeration: {
      pendingReviews: 8,
      approvedContent: 156,
      rejectedContent: 23,
      flaggedContent: 5
    }
  }
}

function adminReducer(state, action) {
  switch (action.type) {
    case 'ADMIN_LOGIN':
      return {
        ...state,
        isAdminAuthenticated: true,
        adminUser: action.payload
      }
    case 'ADMIN_LOGOUT':
      return {
        ...state,
        isAdminAuthenticated: false,
        adminUser: null
      }
    case 'UPDATE_USER_STATUS':
      return {
        ...state,
        users: state.users.map(user =>
          user.id === action.payload.userId
            ? { ...user, status: action.payload.status }
            : user
        )
      }
    case 'APPROVE_SKILL':
      return {
        ...state,
        pendingSkills: state.pendingSkills.map(skill =>
          skill.id === action.payload
            ? { ...skill, status: 'approved' }
            : skill
        )
      }
    case 'REJECT_SKILL':
      return {
        ...state,
        pendingSkills: state.pendingSkills.map(skill =>
          skill.id === action.payload.skillId
            ? { ...skill, status: 'rejected', rejectionReason: action.payload.reason }
            : skill
        )
      }
    case 'ADD_PLATFORM_MESSAGE':
      return {
        ...state,
        platformMessages: [action.payload, ...state.platformMessages]
      }
    case 'UPDATE_SWAP_STATUS':
      return {
        ...state,
        swapRequests: state.swapRequests.map(swap =>
          swap.id === action.payload.swapId
            ? { ...swap, status: action.payload.status, lastUpdated: new Date().toISOString() }
            : swap
        )
      }
    default:
      return state
  }
}

export function AdminProvider({ children }) {
  const [state, dispatch] = useReducer(adminReducer, initialState)

  // Admin authentication persistence
  useEffect(() => {
    const savedAdmin = localStorage.getItem('adminUser')
    if (savedAdmin) {
      dispatch({ type: 'ADMIN_LOGIN', payload: JSON.parse(savedAdmin) })
    }
  }, [])

  useEffect(() => {
    if (state.adminUser) {
      localStorage.setItem('adminUser', JSON.stringify(state.adminUser))
    } else {
      localStorage.removeItem('adminUser')
    }
  }, [state.adminUser])

  const adminLogin = (credentials) => {
    // Mock admin login - in real app, this would be an API call
    if (credentials.email === 'admin@skillswap.com' && credentials.password === 'admin123') {
      const adminData = {
        id: 'admin_1',
        name: 'Admin User',
        email: 'admin@skillswap.com',
        role: 'admin',
        permissions: ['user_management', 'content_moderation', 'swap_monitoring', 'messaging', 'reports']
      }
      dispatch({ type: 'ADMIN_LOGIN', payload: adminData })
      toast.success('Admin login successful')
      return true
    } else {
      toast.error('Invalid admin credentials')
      return false
    }
  }

  const adminLogout = () => {
    dispatch({ type: 'ADMIN_LOGOUT' })
    toast.success('Admin logged out successfully')
  }

  const banUser = (userId, reason) => {
    dispatch({ type: 'UPDATE_USER_STATUS', payload: { userId, status: 'banned' } })
    toast.success(`User banned: ${reason}`)
  }

  const suspendUser = (userId, reason) => {
    dispatch({ type: 'UPDATE_USER_STATUS', payload: { userId, status: 'suspended' } })
    toast.success(`User suspended: ${reason}`)
  }

  const reactivateUser = (userId) => {
    dispatch({ type: 'UPDATE_USER_STATUS', payload: { userId, status: 'active' } })
    toast.success('User reactivated successfully')
  }

  const approveSkill = (skillId) => {
    dispatch({ type: 'APPROVE_SKILL', payload: skillId })
    toast.success('Skill approved successfully')
  }

  const rejectSkill = (skillId, reason) => {
    dispatch({ type: 'REJECT_SKILL', payload: { skillId, reason } })
    toast.success('Skill rejected')
  }

  const sendPlatformMessage = (messageData) => {
    const message = {
      ...messageData,
      id: Date.now(),
      status: 'sent',
      createdAt: new Date().toISOString()
    }
    dispatch({ type: 'ADD_PLATFORM_MESSAGE', payload: message })
    toast.success('Platform message sent successfully')
  }

  const updateSwapStatus = (swapId, status) => {
    dispatch({ type: 'UPDATE_SWAP_STATUS', payload: { swapId, status } })
    toast.success(`Swap status updated to ${status}`)
  }

  const generateReport = (reportType) => {
    // Mock report generation
    const timestamp = new Date().toISOString().split('T')[0]
    const filename = `${reportType}_report_${timestamp}.csv`
    
    let csvContent = ''
    
    switch (reportType) {
      case 'user_activity':
        csvContent = 'User ID,Name,Email,Status,Join Date,Completed Swaps,Rating\n'
        state.users.forEach(user => {
          csvContent += `${user.id},${user.name},${user.email},${user.status},${user.joinDate},${user.completedSwaps},${user.rating}\n`
        })
        break
      case 'swap_stats':
        csvContent = 'Swap ID,Requester,Recipient,Skill Requested,Skill Offered,Status,Created At\n'
        state.swapRequests.forEach(swap => {
          csvContent += `${swap.id},${swap.requester.name},${swap.recipient.name},${swap.skillRequested},${swap.skillOffered},${swap.status},${swap.createdAt}\n`
        })
        break
      case 'content_moderation':
        csvContent = 'Skill ID,User,Skill Name,Category,Status,Submitted At,Flagged\n'
        state.pendingSkills.forEach(skill => {
          csvContent += `${skill.id},${skill.userName},${skill.skillName},${skill.category},${skill.status},${skill.submittedAt},${skill.flagged}\n`
        })
        break
    }

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.click()
    window.URL.revokeObjectURL(url)
    
    toast.success(`${reportType.replace('_', ' ')} report downloaded`)
  }

  const value = {
    ...state,
    adminLogin,
    adminLogout,
    banUser,
    suspendUser,
    reactivateUser,
    approveSkill,
    rejectSkill,
    sendPlatformMessage,
    updateSwapStatus,
    generateReport
  }

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider')
  }
  return context
}