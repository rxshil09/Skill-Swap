import React, { createContext, useContext, useReducer, useEffect } from 'react'
import toast from 'react-hot-toast'

const AppContext = createContext()

const initialState = {
  user: null,
  isAuthenticated: false,
  theme: 'light',
  skills: [
    {
      id: 1,
      title: 'Web Development',
      category: 'Programming',
      description: 'Full-stack web development with React and Node.js',
      user: {
        id: 1,
        name: 'Alex Johnson',
        avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400',
        rating: 4.8,
        location: 'San Francisco, CA'
      },
      rating: 4.8,
      reviews: 24,
      status: 'available',
      tags: ['React', 'Node.js', 'JavaScript', 'MongoDB']
    },
    {
      id: 2,
      title: 'Graphic Design',
      category: 'Design',
      description: 'Logo design, branding, and digital illustrations',
      user: {
        id: 2,
        name: 'Sarah Chen',
        avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400',
        rating: 4.9,
        location: 'New York, NY'
      },
      rating: 4.9,
      reviews: 31,
      status: 'available',
      tags: ['Photoshop', 'Illustrator', 'Branding', 'UI/UX']
    },
    {
      id: 3,
      title: 'Guitar Lessons',
      category: 'Music',
      description: 'Acoustic and electric guitar for beginners to intermediate',
      user: {
        id: 3,
        name: 'Mike Rodriguez',
        avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400',
        rating: 4.7,
        location: 'Austin, TX'
      },
      rating: 4.7,
      reviews: 18,
      status: 'available',
      tags: ['Acoustic', 'Electric', 'Music Theory', 'Songwriting']
    },
    {
      id: 4,
      title: 'Spanish Tutoring',
      category: 'Language',
      description: 'Native Spanish speaker offering conversation practice',
      user: {
        id: 4,
        name: 'Maria Garcia',
        avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=400',
        rating: 4.9,
        location: 'Miami, FL'
      },
      rating: 4.9,
      reviews: 42,
      status: 'available',
      tags: ['Conversation', 'Grammar', 'Business Spanish', 'Culture']
    },
    {
      id: 5,
      title: 'Photography',
      category: 'Creative',
      description: 'Portrait and landscape photography techniques',
      user: {
        id: 5,
        name: 'David Kim',
        avatar: 'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=400',
        rating: 4.6,
        location: 'Seattle, WA'
      },
      rating: 4.6,
      reviews: 15,
      status: 'available',
      tags: ['Portrait', 'Landscape', 'Lightroom', 'Composition']
    },
    {
      id: 6,
      title: 'Yoga Instruction',
      category: 'Fitness',
      description: 'Hatha and Vinyasa yoga for all levels',
      user: {
        id: 6,
        name: 'Emma Wilson',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
        rating: 4.8,
        location: 'Los Angeles, CA'
      },
      rating: 4.8,
      reviews: 28,
      status: 'available',
      tags: ['Hatha', 'Vinyasa', 'Meditation', 'Flexibility']
    }
  ],
  swapRequests: [
    {
      id: 1,
      requester: {
        id: 2,
        name: 'Sarah Chen',
        avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400'
      },
      skillRequested: 'Web Development',
      skillOffered: 'Graphic Design',
      status: 'pending',
      message: 'Hi! I\'d love to learn web development in exchange for graphic design lessons.',
      createdAt: '2024-01-15T10:30:00Z'
    },
    {
      id: 2,
      requester: {
        id: 3,
        name: 'Mike Rodriguez',
        avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400'
      },
      skillRequested: 'Photography',
      skillOffered: 'Guitar Lessons',
      status: 'accepted',
      message: 'Would love to trade guitar lessons for photography tips!',
      createdAt: '2024-01-14T15:45:00Z'
    }
  ],
  messages: [
    {
      id: 1,
      sender: {
        id: 2,
        name: 'Sarah Chen',
        avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400'
      },
      message: 'Hey! Thanks for accepting my swap request. When would be a good time to start?',
      timestamp: '2024-01-15T14:30:00Z',
      read: false
    },
    {
      id: 2,
      sender: {
        id: 3,
        name: 'Mike Rodriguez',
        avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400'
      },
      message: 'Looking forward to our photography session this weekend!',
      timestamp: '2024-01-14T18:20:00Z',
      read: true
    }
  ],
  categories: ['Programming', 'Design', 'Music', 'Language', 'Creative', 'Fitness', 'Business', 'Cooking', 'Sports', 'Art'],
  searchFilters: {
    category: '',
    rating: 0,
    location: '',
    availability: ''
  }
}

function appReducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true
      }
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false
      }
    case 'TOGGLE_THEME':
      return {
        ...state,
        theme: state.theme === 'light' ? 'dark' : 'light'
      }
    case 'UPDATE_PROFILE':
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      }
    case 'ADD_SKILL':
      return {
        ...state,
        skills: [...state.skills, { ...action.payload, id: Date.now() }]
      }
    case 'UPDATE_SKILL':
      return {
        ...state,
        skills: state.skills.map(skill =>
          skill.id === action.payload.id ? { ...skill, ...action.payload } : skill
        )
      }
    case 'DELETE_SKILL':
      return {
        ...state,
        skills: state.skills.filter(skill => skill.id !== action.payload)
      }
    case 'SEND_SWAP_REQUEST':
      return {
        ...state,
        swapRequests: [...state.swapRequests, { ...action.payload, id: Date.now() }]
      }
    case 'UPDATE_SWAP_REQUEST':
      return {
        ...state,
        swapRequests: state.swapRequests.map(request =>
          request.id === action.payload.id ? { ...request, ...action.payload } : request
        )
      }
    case 'SEND_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, { ...action.payload, id: Date.now() }]
      }
    case 'MARK_MESSAGE_READ':
      return {
        ...state,
        messages: state.messages.map(msg =>
          msg.id === action.payload ? { ...msg, read: true } : msg
        )
      }
    case 'UPDATE_SEARCH_FILTERS':
      return {
        ...state,
        searchFilters: { ...state.searchFilters, ...action.payload }
      }
    default:
      return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  // Theme persistence
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      dispatch({ type: 'TOGGLE_THEME' })
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('theme', state.theme)
    if (state.theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [state.theme])

  // Authentication persistence
  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      dispatch({ type: 'LOGIN', payload: JSON.parse(savedUser) })
    }
  }, [])

  useEffect(() => {
    if (state.user) {
      localStorage.setItem('user', JSON.stringify(state.user))
    } else {
      localStorage.removeItem('user')
    }
  }, [state.user])

  const login = (userData) => {
    dispatch({ type: 'LOGIN', payload: userData })
    toast.success(`Welcome back, ${userData.name}!`)
  }

  const logout = () => {
    dispatch({ type: 'LOGOUT' })
    toast.success('Logged out successfully')
  }

  const toggleTheme = () => {
    dispatch({ type: 'TOGGLE_THEME' })
  }

  const updateProfile = (profileData) => {
    dispatch({ type: 'UPDATE_PROFILE', payload: profileData })
    toast.success('Profile updated successfully')
  }

  const addSkill = (skillData) => {
    dispatch({ type: 'ADD_SKILL', payload: skillData })
    toast.success('Skill added successfully')
  }

  const updateSkill = (skillData) => {
    dispatch({ type: 'UPDATE_SKILL', payload: skillData })
    toast.success('Skill updated successfully')
  }

  const deleteSkill = (skillId) => {
    dispatch({ type: 'DELETE_SKILL', payload: skillId })
    toast.success('Skill deleted successfully')
  }

  const sendSwapRequest = (requestData) => {
    dispatch({ type: 'SEND_SWAP_REQUEST', payload: requestData })
    toast.success('Swap request sent successfully')
  }

  const updateSwapRequest = (requestData) => {
    dispatch({ type: 'UPDATE_SWAP_REQUEST', payload: requestData })
    toast.success(`Swap request ${requestData.status}`)
  }

  const sendMessage = (messageData) => {
    dispatch({ type: 'SEND_MESSAGE', payload: messageData })
    toast.success('Message sent')
  }

  const markMessageRead = (messageId) => {
    dispatch({ type: 'MARK_MESSAGE_READ', payload: messageId })
  }

  const updateSearchFilters = (filters) => {
    dispatch({ type: 'UPDATE_SEARCH_FILTERS', payload: filters })
  }

  const value = {
    ...state,
    login,
    logout,
    toggleTheme,
    updateProfile,
    addSkill,
    updateSkill,
    deleteSkill,
    sendSwapRequest,
    updateSwapRequest,
    sendMessage,
    markMessageRead,
    updateSearchFilters
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}