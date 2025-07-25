import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  TicketIcon,
  ServerIcon,
  UsersIcon,
  SettingsIcon,
  BarChartIcon,
  AlertTriangleIcon,
  MenuIcon,
  XIcon,
  ShieldIcon,
  LogOutIcon
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

const Sidebar = ({ collapsed, toggleSidebar }) => {
  const { user, logout } = useAuthStore();
  const location = useLocation();

  const isAdmin = user?.role === 'admin';

  const menuItems = [
    {
      name: 'Dashboard',
      icon: HomeIcon,
      path: '/',
      exact: true
    },
    {
      name: 'Tickets',
      icon: TicketIcon,
      path: '/tickets'
    },
    {
      name: 'Monitoring',
      icon: ServerIcon,
      path: '/monitoring'
    },
    {
      name: 'Alerts',
      icon: AlertTriangleIcon,
      path: '/alerts'
    },
    {
      name: 'Reports',
      icon: BarChartIcon,
      path: '/reports'
    },
    {
      name: 'Users',
      icon: UsersIcon,
      path: '/users',
      adminOnly: true
    },
    {
      name: 'Admin',
      icon: ShieldIcon,
      path: '/admin',
      adminOnly: true
    },
    {
      name: 'Settings',
      icon: SettingsIcon,
      path: '/settings'
    }
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <aside className={`sidebar ${collapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Sidebar header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-white/10 dark:border-white/5">
        {!collapsed && (
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-tertiary-600 flex items-center justify-center text-white font-bold">
              U
            </div>
            <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-tertiary-600">
              Uzalendo NMS
            </span>
          </Link>
        )}
        <button
          onClick={toggleSidebar}
          className="btn-icon p-2 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-lg"
          aria-label="Toggle sidebar"
        >
          {collapsed ? <MenuIcon size={20} /> : <XIcon size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="mt-6 px-3">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            if (item.adminOnly && !isAdmin) return null;
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center py-3 px-4 rounded-lg transition-all duration-200 group ${
                    isActive(item.path)
                      ? 'bg-primary-500/20 text-primary-600 dark:text-primary-400 shadow-sm'
                      : 'text-secondary-700 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-900/30'
                  }`}
                >
                  <item.icon className={`h-5 w-5 ${collapsed ? 'mx-auto' : 'mr-3'} ${
                    isActive(item.path)
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'text-secondary-500 dark:text-secondary-400 group-hover:text-secondary-700 dark:group-hover:text-secondary-300'
                  }`} />
                  {!collapsed && (
                    <span className={`text-sm font-medium ${
                      isActive(item.path)
                        ? 'text-primary-700 dark:text-primary-400'
                        : 'text-secondary-700 dark:text-secondary-300'
                    }`}>
                      {item.name}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 w-full p-4 border-t border-white/10 dark:border-white/5 bg-white/5 dark:bg-black/5">
        {!collapsed ? (
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                <UsersIcon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-secondary-900 dark:text-white truncate">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-secondary-500 dark:text-secondary-400 truncate">
                  {user?.email || 'user@example.com'}
                </p>
              </div>
            </div>
            
            <button
              onClick={logout}
              className="flex items-center justify-center w-full py-2.5 px-4 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-800 rounded-lg shadow-sm transition-colors"
            >
              <LogOutIcon className="h-4 w-4 mr-2" />
              Sign out
            </button>
            
            <div className="text-xs text-center text-secondary-500 dark:text-secondary-400 pt-2">
              <p>Uzalendo NMS v1.0</p>
              <p>© 2025 Uzalendo Systems</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-4">
            <button
              onClick={logout}
              className="p-2 bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-800 text-white rounded-lg shadow-sm transition-colors"
              aria-label="Sign out"
            >
              <LogOutIcon className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;