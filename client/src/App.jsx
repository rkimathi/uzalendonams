import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import './App.css'

// Layout components
import Navbar from './components/layout/Navbar'
import Sidebar from './components/layout/Sidebar'

// Page components
import Dashboard from './components/dashboard/Dashboard'
import TicketList from './components/tickets/TicketList'
import DeviceMonitoring from './components/monitoring/DeviceMonitoring'
import AdminPanel from './components/admin/AdminPanel'

// Auth store
import { useAuthStore } from './stores/authStore'

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [darkMode, setDarkMode] = useState(
    window.matchMedia('(prefers-color-scheme: dark)').matches
  )
  const { user, checkAuth } = useAuthStore()

  // Check authentication status on app load
  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  // Apply dark mode class to html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  // Mock login for demo purposes
  const mockLogin = () => {
    useAuthStore.setState({
      user: {
        id: '1',
        name: 'Demo User',
        email: 'demo@example.com',
        role: 'admin'
      },
      token: 'mock-token'
    })
  }

  // Auto-login for demo
  useEffect(() => {
    if (!user) {
      mockLogin()
    }
  }, [user])

  return (
    <Router>
      <div className="app-layout">
        <Sidebar
          collapsed={sidebarCollapsed}
          toggleSidebar={toggleSidebar}
          darkMode={darkMode}
        />
        <div className={`main-content ${sidebarCollapsed ? 'main-content-expanded' : ''}`}>
          <Navbar
            toggleSidebar={toggleSidebar}
            darkMode={darkMode}
            toggleDarkMode={toggleDarkMode}
          />
          <main className="content-area">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/tickets" element={<TicketList />} />
              <Route path="/monitoring" element={<DeviceMonitoring />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'glass',
          duration: 4000,
          style: {
            background: darkMode ? 'rgba(15, 23, 42, 0.7)' : 'rgba(255, 255, 255, 0.1)',
            color: darkMode ? '#f8fafc' : '#1e293b',
            border: darkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
          },
        }}
      />
    </Router>
  )
}

export default App
