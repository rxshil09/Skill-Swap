import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, Zap } from 'lucide-react'
import { useApp } from '../contexts/AppContext'
import toast from 'react-hot-toast'

function Login() {
  const { login } = useApp()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Simple validation
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields')
      return
    }

    // Mock login - in real app, this would be an API call
    const userData = {
      id: 1,
      name: 'Alex Johnson',
      email: formData.email,
      avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400',
      location: 'San Francisco, CA',
      rating: 4.8,
      skillsOffered: [
        { id: 1, name: 'Web Development', category: 'Technology', level: 'Expert' },
        { id: 2, name: 'React', category: 'Technology', level: 'Expert' },
        { id: 3, name: 'Node.js', category: 'Technology', level: 'Advanced' }
      ],
      skillsWanted: [
        { id: 4, name: 'Design', category: 'Creative', level: 'Beginner' },
        { id: 5, name: 'Photography', category: 'Creative', level: 'Intermediate' },
        { id: 6, name: 'Spanish', category: 'Language', level: 'Beginner' }
      ],
      bio: 'Full-stack developer passionate about creating amazing web experiences.'
    }

    login(userData)
    navigate('/')
  }

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Zap className="h-12 w-12 text-primary-600 dark:text-primary-400" />
              <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-secondary-500 rounded-full blur-lg opacity-30" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome Back
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Sign in to your SkillSwap account
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="card p-8"
        >
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="Enter your email"
                />
                <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field pl-10 pr-10"
                  placeholder="Enter your password"
                />
                <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300">
                  Forgot password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              className="w-full btn-primary py-3"
            >
              Sign In
            </button>

            <div className="text-center">
              <span className="text-gray-600 dark:text-gray-400">
                Don't have an account?{' '}
                <Link
                  to="/signup"
                  className="text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300 font-medium"
                >
                  Sign up
                </Link>
              </span>
            </div>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              <strong>Demo Credentials:</strong>
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              Email: demo@skillswap.com<br />
              Password: demo123
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Login