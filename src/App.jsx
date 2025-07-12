import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AppProvider } from './contexts/AppContext'
import { AdminProvider } from './contexts/AdminContext'
import Layout from './components/Layout/Layout'
import AdminLayout from './components/Layout/AdminLayout'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Profile from './pages/Profile'
import Browse from './pages/Browse'
import Requests from './pages/Requests'
import Messages from './pages/Messages'
import Settings from './pages/Settings'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import UserManagement from './pages/admin/UserManagement'
import ContentModeration from './pages/admin/ContentModeration'
import SwapMonitoring from './pages/admin/SwapMonitoring'
import PlatformMessaging from './pages/admin/PlatformMessaging'
import Reports from './pages/admin/Reports'
import { useAdmin } from './contexts/AdminContext'

function AdminRoutes() {
  const { isAdminAuthenticated } = useAdmin()
  const location = useLocation()

  if (!isAdminAuthenticated && location.pathname !== '/admin/login') {
    return <AdminLogin />
  }

  if (location.pathname === '/admin/login') {
    return <AdminLogin />
  }

  return (
    <AdminLayout>
      <Routes>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<UserManagement />} />
        <Route path="/admin/content" element={<ContentModeration />} />
        <Route path="/admin/swaps" element={<SwapMonitoring />} />
        <Route path="/admin/messaging" element={<PlatformMessaging />} />
        <Route path="/admin/reports" element={<Reports />} />
        <Route path="/admin/*" element={<AdminDashboard />} />
      </Routes>
    </AdminLayout>
  )
}

function App() {
  return (
    <AppProvider>
      <AdminProvider>
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/*" element={<AdminRoutes />} />
          
          {/* Regular App Routes */}
          <Route path="/*" element={
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-teal-50 dark:from-gray-900 dark:via-blue-900 dark:to-teal-900 transition-colors duration-300">
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/profile/:id?" element={<Profile />} />
                  <Route path="/browse" element={<Browse />} />
                  <Route path="/requests" element={<Requests />} />
                  <Route path="/messages" element={<Messages />} />
                  <Route path="/settings" element={<Settings />} />
                </Routes>
              </Layout>
            </div>
          } />
        </Routes>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
              borderRadius: '12px',
              padding: '16px',
            },
          }}
        />
      </AdminProvider>
    </AppProvider>
  )
}

export default App