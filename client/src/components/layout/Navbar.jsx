import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BellIcon,
  MoonIcon,
  SunIcon,
  UserIcon,
  SearchIcon,
  MenuIcon,
  LayoutDashboardIcon
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

const Navbar = ({ toggleSidebar, darkMode, toggleDarkMode }) => {
  const { user, logout } = useAuthStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <nav className="navbar">
      <div className="flex justify-between items-center w-full">
        {/* Left side - Menu toggle and brand */}
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="btn-icon mr-4 p-2 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-lg"
            aria-label="Toggle sidebar"
          >
            <MenuIcon className="w-5 h-5" />
          </button>
          
          <div className="flex items-center">
            <LayoutDashboardIcon className="w-5 h-5 text-primary-600 dark:text-primary-400 mr-2" />
            <span className="font-semibold text-gray-800 dark:text-white">Uzalendo NMS</span>
          </div>
        </div>

        {/* Center - Search */}
        <div className="relative max-w-md w-full mx-6 hidden md:block">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <SearchIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </div>
          <input
            type="text"
            className="input w-full pl-10"
            placeholder="Search..."
          />
        </div>

        {/* Right side icons */}
        <div className="flex items-center space-x-4">
          {/* Dark mode toggle */}
          <button
            onClick={toggleDarkMode}
            className="btn-icon p-2 bg-secondary-50 dark:bg-secondary-900/30 rounded-lg"
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <SunIcon className="w-5 h-5 text-yellow-400" />
            ) : (
              <MoonIcon className="w-5 h-5 text-secondary-700" />
            )}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="btn-icon p-2 bg-secondary-50 dark:bg-secondary-900/30 rounded-lg"
              aria-label="Notifications"
            >
              <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full animate-glow">
                3
              </span>
              <BellIcon className="w-5 h-5 text-secondary-700 dark:text-secondary-300" />
            </button>

            {/* Notifications dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 glass-card py-2 z-50 shadow-lg">
                <div className="px-4 py-2 font-medium border-b border-gray-200/20 dark:border-gray-700/30 text-primary-700 dark:text-primary-400">
                  Notifications
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {/* Notification items */}
                  <div className="px-4 py-3 hover:bg-white/10 dark:hover:bg-black/20 border-b border-gray-200/20 dark:border-gray-700/30">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">New critical alert</p>
                    <p className="text-xs text-gray-600 dark:text-gray-300">Server CPU usage above 90%</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">10 minutes ago</p>
                  </div>
                  <div className="px-4 py-3 hover:bg-white/10 dark:hover:bg-black/20">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Ticket assigned</p>
                    <p className="text-xs text-gray-600 dark:text-gray-300">Ticket #1234 has been assigned to you</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">1 hour ago</p>
                  </div>
                </div>
                <div className="px-4 py-2 text-center text-sm text-primary-600 dark:text-primary-400 border-t border-gray-200/20 dark:border-gray-700/30">
                  <Link to="/notifications" className="hover:underline">View all notifications</Link>
                </div>
              </div>
            )}
          </div>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 btn-icon px-3 py-2 bg-primary-50 dark:bg-primary-900/30 rounded-lg"
              aria-label="User menu"
            >
              <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-800/50 flex items-center justify-center">
                <UserIcon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <span className="hidden md:block text-sm font-medium text-primary-700 dark:text-primary-300">
                {user?.name || 'User'}
              </span>
            </button>

            {/* User dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 glass-card py-2 z-50 shadow-lg">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-white/10 dark:hover:bg-black/20"
                >
                  Profile
                </Link>
                <Link
                  to="/settings"
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-white/10 dark:hover:bg-black/20"
                >
                  Settings
                </Link>
                <button
                  onClick={logout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-white/10 dark:hover:bg-black/20"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;