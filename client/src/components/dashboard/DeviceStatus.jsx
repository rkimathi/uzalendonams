import React from 'react';
import { Link } from 'react-router-dom';
import {
  ServerIcon,
  WifiIcon,
  CheckCircleIcon,
  XCircleIcon,
  AlertTriangleIcon,
  ChevronRightIcon,
  HardDriveIcon
} from 'lucide-react';

const DeviceStatus = ({ devices }) => {
  const getDeviceIcon = (type) => {
    switch (type) {
      case 'router':
        return <ServerIcon className="h-5 w-5" />;
      case 'switch':
        return <HardDriveIcon className="h-5 w-5" />;
      case 'server':
        return <ServerIcon className="h-5 w-5" />;
      case 'access_point':
        return <WifiIcon className="h-5 w-5" />;
      default:
        return <ServerIcon className="h-5 w-5" />;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'online':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'offline':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangleIcon className="h-5 w-5 text-yellow-500" />;
      default:
        return <ServerIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      online: 'status-online',
      offline: 'status-offline',
      warning: 'status-warning',
      maintenance: 'bg-blue-100/80 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'
    };
    return colors[status] || colors.offline;
  };

  // Mock data for the device status
  const mockDevices = [
    { id: 1, name: 'Core Router', type: 'router', status: 'online', ip: '192.168.1.1', location: 'Server Room' },
    { id: 2, name: 'Main Switch', type: 'switch', status: 'online', ip: '192.168.1.2', location: 'Server Room' },
    { id: 3, name: 'Backup Server', type: 'server', status: 'warning', ip: '192.168.1.10', location: 'Server Room' },
    { id: 4, name: 'Access Point 1', type: 'access_point', status: 'offline', ip: '192.168.1.100', location: 'Floor 1' },
    { id: 5, name: 'Access Point 2', type: 'access_point', status: 'online', ip: '192.168.1.101', location: 'Floor 2' },
  ];

  const devicesToShow = devices.length > 0 ? devices.slice(0, 5) : mockDevices;

  // Calculate status summary
  const statusSummary = devicesToShow.reduce((acc, device) => {
    acc[device.status] = (acc[device.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="dashboard-card h-full">
      <div className="dashboard-card-header">
        <h2 className="dashboard-card-title">Device Status</h2>
        <Link
          to="/monitoring"
          className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
        >
          View all
        </Link>
      </div>
      
      <div className="mt-4">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="glass-card p-4 text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {statusSummary.online || 0}
            </div>
            <div className="text-sm text-green-800 dark:text-green-300">Online</div>
          </div>
          <div className="glass-card p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {statusSummary.warning || 0}
            </div>
            <div className="text-sm text-yellow-800 dark:text-yellow-300">Warning</div>
          </div>
          <div className="glass-card p-4 text-center">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {statusSummary.offline || 0}
            </div>
            <div className="text-sm text-red-800 dark:text-red-300">Offline</div>
          </div>
        </div>

        <div className="space-y-3">
          {devicesToShow.map((device) => (
            <Link
              key={device.id}
              to={`/monitoring/devices/${device.id}`}
              className="block glass-card p-4 hover:bg-white/20 dark:hover:bg-black/20 transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${
                    device.status === 'online'
                      ? 'bg-green-100/50 dark:bg-green-900/30'
                      : device.status === 'warning'
                        ? 'bg-yellow-100/50 dark:bg-yellow-900/30'
                        : 'bg-red-100/50 dark:bg-red-900/30'
                  }`}>
                    {getDeviceIcon(device.type)}
                  </div>
                  <div>
                    <div className="flex items-center">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {device.name}
                      </span>
                      <span className={`ml-2 status-badge ${getStatusColor(device.status)}`}>
                        {device.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {device.ip} • {device.location}
                    </div>
                  </div>
                </div>
                <ChevronRightIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DeviceStatus;