import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import './App.css'

// Material UI imports
import { ThemeProvider, CssBaseline } from '@mui/material'
import theme, { darkTheme } from './theme'

// Layout components
import Navbar from './components/layout/Navbar'
import Sidebar from './components/layout/Sidebar'

// Page components
import Dashboard from './components/dashboard/Dashboard'
import TicketList from './components/tickets/TicketList'
import DeviceMonitoring from './components/monitoring/DeviceMonitoring'
import AlertsPage from './components/alerts/AlertsPage'
import ReportsPage from './components/reports/ReportsPage'
import SettingsPage from './components/settings/SettingsPage'
import AdminPanel from './components/admin/AdminPanel'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import ForgotPassword from './components/auth/ForgotPassword'
import ResetPassword from './components/auth/ResetPassword'

// Auth store
import { useAuthStore } from './stores/authStore'

// Protected route component
const ProtectedLayout = () => {
  const { user } = useAuthStore();
  
  // If not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return (
    <>
      <Outlet />
    </>
  );
};

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

  // Mock login for development purposes only
  // This should be removed or disabled in production
  const mockLogin = () => {
    // Check if we're in development mode
    if (import.meta.env.DEV) {
      useAuthStore.setState({
        user: {
          id: '1',
          name: 'Demo User',
          email: 'demo@example.com',
          role: 'admin'
        },
        token: 'mock-token'
      });
      console.log('Development mode: Auto-login enabled');
    }
  }

  // Auto-login for development only - can be enabled by uncommenting
  /*
  useEffect(() => {
    if (!user && import.meta.env.DEV) {
      mockLogin();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array to run only once
  */

  return (
    <ThemeProvider theme={darkMode ? darkTheme : theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          
          {/* Root route - redirect based on auth status */}
          <Route
            path="/"
            element={user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />}
          />
          
          {/* Protected routes with layout */}
          <Route element={
            <div className="app-layout">
              <div className="sidebar-container">
                <Sidebar
                  collapsed={sidebarCollapsed}
                  toggleSidebar={toggleSidebar}
                  darkMode={darkMode}
                />
              </div>
              <div className={`main-content ${sidebarCollapsed ? 'main-content-expanded' : ''}`}>
                <div className="navbar-container">
                  <Navbar
                    toggleSidebar={toggleSidebar}
                    darkMode={darkMode}
                    toggleDarkMode={toggleDarkMode}
                  />
                </div>
                <main className="content-area">
                  <Outlet />
                </main>
              </div>
            </div>
          }>
            <Route element={<ProtectedLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/tickets" element={<TicketList />} />
              <Route path="/monitoring" element={<DeviceMonitoring />} />
              <Route path="/alerts" element={<AlertsPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/admin" element={<AdminPanel />} />
            </Route>
          </Route>
          
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: darkMode ? '#1e1e1e' : '#ffffff',
              color: darkMode ? '#ffffff' : '#1e1e1e',
              border: darkMode ? '1px solid #333' : '1px solid #e0e0e0',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              borderRadius: '8px',
            },
          }}
        />
      </Router>
    </ThemeProvider>
  )
}

export default App
