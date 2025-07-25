import React from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangleIcon,
  ServerIcon,
  CpuIcon,
  HardDriveIcon,
  ThermometerIcon,
  WifiIcon,
  BellIcon,
  ChevronRightIcon,
  ShieldIcon
} from 'lucide-react';

const AlertsPanel = () => {
  // Mock alerts data
  const alerts = [
    {
      id: 1,
      type: 'critical',
      message: 'Server CPU usage above 90%',
      device: 'Main Server',
      deviceType: 'server',
      timestamp: new Date(Date.now() - 15 * 60000), // 15 minutes ago
      metric: 'CPU',
      value: '92%',
      threshold: '90%'
    },
    {
      id: 2,
      type: 'warning',
      message: 'High memory usage detected',
      device: 'Database Server',
      deviceType: 'server',
      timestamp: new Date(Date.now() - 45 * 60000), // 45 minutes ago
      metric: 'Memory',
      value: '85%',
      threshold: '80%'
    },
    {
      id: 3,
      type: 'warning',
      message: 'Disk space running low',
      device: 'Storage Server',
      deviceType: 'server',
      timestamp: new Date(Date.now() - 120 * 60000), // 2 hours ago
      metric: 'Disk',
      value: '92%',
      threshold: '90%'
    },
    {
      id: 4,
      type: 'critical',
      message: 'Access Point offline',
      device: 'Floor 1 AP',
      deviceType: 'access_point',
      timestamp: new Date(Date.now() - 180 * 60000), // 3 hours ago
      metric: 'Connectivity',
      value: 'Offline',
      threshold: 'Online'
    },
    {
      id: 5,
      type: 'info',
      message: 'System update available',
      device: 'Core Router',
      deviceType: 'router',
      timestamp: new Date(Date.now() - 240 * 60000), // 4 hours ago
      metric: 'Firmware',
      value: 'v1.2.3',
      threshold: 'v1.2.4'
    }
  ];

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const diffMs = now - timestamp;
    const diffMin = Math.floor(diffMs / 60000);
    
    if (diffMin < 60) {
      return `${diffMin} min${diffMin !== 1 ? 's' : ''} ago`;
    }
    
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    }
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  };

  const getAlertIcon = (type, metric) => {
    if (metric === 'CPU') return <CpuIcon className="h-5 w-5" />;
    if (metric === 'Memory') return <HardDriveIcon className="h-5 w-5" />;
    if (metric === 'Disk') return <HardDriveIcon className="h-5 w-5" />;
    if (metric === 'Temperature') return <ThermometerIcon className="h-5 w-5" />;
    if (metric === 'Connectivity') return <WifiIcon className="h-5 w-5" />;
    if (metric === 'Firmware') return <ShieldIcon className="h-5 w-5" />;
    
    return <AlertTriangleIcon className="h-5 w-5" />;
  };

  const getAlertColor = (type) => {
    switch (type) {
      case 'critical':
        return 'bg-red-500/20 text-red-600 dark:bg-red-900/30 dark:text-red-300';
      case 'warning':
        return 'bg-yellow-500/20 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'info':
        return 'bg-blue-500/20 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300';
      default:
        return 'bg-gray-500/20 text-gray-600 dark:bg-gray-800/50 dark:text-gray-300';
    }
  };

  const getAlertBorder = (type) => {
    switch (type) {
      case 'critical':
        return 'border-l-4 border-red-500 dark:border-red-600';
      case 'warning':
        return 'border-l-4 border-yellow-500 dark:border-yellow-600';
      case 'info':
        return 'border-l-4 border-blue-500 dark:border-blue-600';
      default:
        return '';
    }
  };

  const getDeviceIcon = (deviceType) => {
    switch (deviceType) {
      case 'server':
        return <ServerIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />;
      case 'router':
      case 'switch':
        return <ServerIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />;
      case 'access_point':
        return <WifiIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />;
      default:
        return <ServerIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />;
    }
  };

  return (
    <div className="dashboard-card h-full">
      <div className="dashboard-card-header">
        <h2 className="dashboard-card-title">Active Alerts</h2>
        <Link
          to="/alerts"
          className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
        >
          View all
        </Link>
      </div>
      
      <div className="mt-4">
        {alerts.length === 0 ? (
          <div className="text-center py-10 glass rounded-lg">
            <BellIcon className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">No active alerts</p>
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert) => (
              <Link
                key={alert.id}
                to={`/alerts/${alert.id}`}
                className={`block glass-card p-4 hover:bg-white/20 dark:hover:bg-black/20 transition-all duration-200 ${getAlertBorder(alert.type)}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${getAlertColor(alert.type)}`}>
                      {getAlertIcon(alert.type, alert.metric)}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {alert.message}
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center mr-3">
                          {getDeviceIcon(alert.deviceType)}
                          <span className="ml-1">{alert.device}</span>
                        </div>
                        <span>{getTimeAgo(alert.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRightIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertsPanel;