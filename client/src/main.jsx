import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App.jsx'

// Initialize any global services or configurations
import './services/api' // This will set up the axios instance

// Check for authentication on app start
import { useAuthStore } from './stores/authStore'
const checkAuth = useAuthStore.getState().checkAuth
checkAuth()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Toaster position="top-right" />
  </StrictMode>,
)
