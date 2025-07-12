import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Shield, 
  BarChart3, 
  Users, 
  FileText, 
  MessageSquare, 
  Settings,
  LogOut,
  Menu,
  X,
  Home,
  Eye
} from 'lucide-react'
import { useAdmin } from '../../contexts/AdminContext'

function AdminLayout({ children }) {
  const { adminUser, adminLogout } = useAdmin()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const navigationItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: BarChart3 },
    { path: '/admin/users', label: 'User Management', icon: Users },
    { path: '/admin/content', label: 'Content Moderation', icon: FileText },
    { path: '/admin/swaps', label: 'Swap Monitoring', icon: Eye },
    { path: '/admin/messaging', label: 'Platform Messaging', icon: MessageSquare },
    { path: '/admin/reports', label: 'Reports', icon: Settings }
  ]

  const handleLogout = () => {
    adminLogout()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-red-600 dark:text-red-400" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">Admin Panel</span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  location.pathname === item.path
                    ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                onClick={() => setIsSidebarOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Divider */}
          <div className="my-6 border-t border-gray-200 dark:border-gray-700"></div>

          {/* Additional Links */}
          <div className="space-y-1">
            <Link
              to="/"
              className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              onClick={() => setIsSidebarOpen(false)}
            >
              <Home className="h-5 w-5" />
              <span>Back to Platform</span>
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </nav>

        {/* Admin Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
              <Shield className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {adminUser?.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Administrator
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Top Bar */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between h-16 px-6">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Menu className="h-5 w-5" />
            </button>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Welcome back, {adminUser?.name}
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default AdminLayout