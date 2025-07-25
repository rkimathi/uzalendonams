import React, { useState, useEffect } from 'react';
import { 
  ServerIcon, 
  WifiIcon, 
  AlertTriangleIcon, 
  CheckCircleIcon,
  RefreshCwIcon,
  SearchIcon,
  FilterIcon
} from 'lucide-react';
import { useDeviceStore } from '../../stores/deviceStore';

const DeviceMonitoring = () => {
  const { devices, fetchDevices, loading } = useDeviceStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  // Filter devices based on search and filters
  const filteredDevices = devices.filter(device => {
    // Search filter
    if (searchTerm && !device.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Status filter
    if (statusFilter !== 'all' && device.status !== statusFilter) {
      return false;
    }
    
    // Type filter
    if (typeFilter !== 'all' && device.type !== typeFilter) {
      return false;
    }
    
    return true;
  });

  // Get unique device types for filter
  const deviceTypes = [...new Set(devices.map(device => device.type))];

  // Mock data for the charts
  const mockDevices = [
    { id: 1, name: 'Core Router', type: 'router', status: 'online', ip: '192.168.1.1', location: 'Server Room', lastSeen: new Date(), cpu: 45, memory: 62, uptime: '45d 12h 36m' },
    { id: 2, name: 'Main Switch', type: 'switch', status: 'online', ip: '192.168.1.2', location: 'Server Room', lastSeen: new Date(), cpu: 28, memory: 45, uptime: '120d 5h 12m' },
    { id: 3, name: 'Backup Server', type: 'server', status: 'warning', ip: '192.168.1.10', location: 'Server Room', lastSeen: new Date(), cpu: 89, memory: 92, uptime: '15d 8h 42m' },
    { id: 4, name: 'Access Point 1', type: 'access_point', status: 'offline', ip: '192.168.1.100', location: 'Floor 1', lastSeen: new Date(Date.now() - 86400000), cpu: 0, memory: 0, uptime: '0d 0h 0m' },
    { id: 5, name: 'Access Point 2', type: 'access_point', status: 'online', ip: '192.168.1.101', location: 'Floor 2', lastSeen: new Date(), cpu: 22, memory: 35, uptime: '30d 14h 22m' },
  ];

  const getStatusColor = (status) => {
    const colors = {
      online: 'bg-green-100 text-green-800',
      offline: 'bg-red-100 text-red-800',
      warning: 'bg-yellow-100 text-yellow-800',
      maintenance: 'bg-blue-100 text-blue-800'
    };
    return colors[status] || colors.offline;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'online':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'offline':
        return <AlertTriangleIcon className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangleIcon className="h-5 w-5 text-yellow-500" />;
      default:
        return <ServerIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getDeviceIcon = (type) => {
    switch (type) {
      case 'router':
        return <ServerIcon className="h-5 w-5" />;
      case 'switch':
        return <ServerIcon className="h-5 w-5" />;
      case 'server':
        return <ServerIcon className="h-5 w-5" />;
      case 'access_point':
        return <WifiIcon className="h-5 w-5" />;
      default:
        return <ServerIcon className="h-5 w-5" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Device Monitoring</h1>
          <p className="text-gray-600">
            Monitor and manage network devices
          </p>
        </div>
        <button 
          onClick={() => fetchDevices()}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <RefreshCwIcon className="h-5 w-5 mr-2" />
          Refresh
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search devices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
            <option value="warning">Warning</option>
            <option value="maintenance">Maintenance</option>
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            <option value="router">Routers</option>
            <option value="switch">Switches</option>
            <option value="server">Servers</option>
            <option value="access_point">Access Points</option>
          </select>
        </div>
      </div>

      {/* Devices List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Device
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  IP Address
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CPU
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Memory
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Uptime
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockDevices.map((device) => (
                <tr key={device.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-gray-100 rounded-full">
                        {getDeviceIcon(device.type)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{device.name}</div>
                        <div className="text-sm text-gray-500">{device.type.replace('_', ' ')}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(device.status)}
                      <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(device.status)}`}>
                        {device.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {device.ip}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {device.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-24 bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${
                          device.cpu > 80 ? 'bg-red-500' : device.cpu > 60 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${device.cpu}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500">{device.cpu}%</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-24 bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${
                          device.memory > 80 ? 'bg-red-500' : device.memory > 60 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${device.memory}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500">{device.memory}%</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {device.uptime}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DeviceMonitoring;