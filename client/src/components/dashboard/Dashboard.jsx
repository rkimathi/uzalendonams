import React, { useState, useEffect } from 'react';
import {
  TicketIcon,
  ServerIcon,
  UsersIcon,
  AlertTriangleIcon,
  TrendingUpIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  RefreshCwIcon
} from 'lucide-react';
import { useTicketStore } from '../../stores/ticketStore';
import { useDeviceStore } from '../../stores/deviceStore';
import { useSocketStore } from '../../stores/socketStore';
import TicketChart from './TicketChart';
import RecentTickets from './RecentTickets';
import DeviceStatus from './DeviceStatus';
import AlertsPanel from './AlertsPanel';

const Dashboard = () => {
  const { tickets, fetchTickets } = useTicketStore();
  const { devices, fetchDevices } = useDeviceStore();
  const { socket } = useSocketStore();
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalTickets: 0,
    openTickets: 0,
    resolvedTickets: 0,
    criticalTickets: 0,
    onlineDevices: 0,
    offlineDevices: 0,
    avgResolutionTime: 0
  });

  useEffect(() => {
    fetchTickets();
    fetchDevices();
  }, [fetchTickets, fetchDevices]);

  useEffect(() => {
    if (tickets.length > 0 || devices.length > 0) {
      calculateStats();
    }
  }, [tickets, devices]);

  useEffect(() => {
    if (socket) {
      socket.on('ticket_updated', (ticket) => {
        fetchTickets();
      });

      socket.on('device_updated', () => {
        fetchDevices();
      });

      return () => {
        socket.off('ticket_updated');
        socket.off('device_updated');
      };
    }
  }, [socket, fetchTickets, fetchDevices]);

  const calculateStats = () => {
    const openStatuses = ['new', 'assigned', 'in_progress', 'pending'];
    const resolvedStatuses = ['resolved', 'closed'];
    
    const openTickets = tickets.filter(t => openStatuses.includes(t.status));
    const resolvedTickets = tickets.filter(t => resolvedStatuses.includes(t.status));
    const criticalTickets = tickets.filter(t => t.priority === 'critical');
    const onlineDevices = devices.filter(d => d.status === 'online');
    const offlineDevices = devices.filter(d => d.status === 'offline');

    // Calculate average resolution time
    const resolvedWithTime = resolvedTickets.filter(t => t.resolvedDate && t.createdAt);
    const avgResolutionTime = resolvedWithTime.length > 0
      ? resolvedWithTime.reduce((acc, ticket) => {
          const diff = new Date(ticket.resolvedDate) - new Date(ticket.createdAt);
          return acc + diff;
        }, 0) / resolvedWithTime.length / (1000 * 60 * 60) // Convert to hours
      : 0;

    setStats({
      totalTickets: tickets.length,
      openTickets: openTickets.length,
      resolvedTickets: resolvedTickets.length,
      criticalTickets: criticalTickets.length,
      onlineDevices: onlineDevices.length,
      offlineDevices: offlineDevices.length,
      avgResolutionTime: Math.round(avgResolutionTime * 10) / 10
    });
  };

  const refreshData = async () => {
    setRefreshing(true);
    await Promise.all([fetchTickets(), fetchDevices()]);
    setTimeout(() => setRefreshing(false), 800); // Add a slight delay for visual feedback
  };

  const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <div className="stat-card">
      <div className="flex items-center justify-between w-full">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
          {trend && (
            <div className="flex items-center mt-1">
              <TrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600 dark:text-green-400">{trend}</span>
            </div>
          )}
        </div>
        <div className={`stat-icon ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  // Mock data for demo
  const mockTickets = [
    { _id: '1', title: 'Server down', status: 'new', priority: 'critical', ticketNumber: 'TKT-001', createdAt: new Date(Date.now() - 3600000) },
    { _id: '2', title: 'Network latency', status: 'in_progress', priority: 'high', ticketNumber: 'TKT-002', createdAt: new Date(Date.now() - 7200000) },
    { _id: '3', title: 'Update firmware', status: 'pending', priority: 'medium', ticketNumber: 'TKT-003', createdAt: new Date(Date.now() - 86400000) },
    { _id: '4', title: 'Replace UPS battery', status: 'resolved', priority: 'low', ticketNumber: 'TKT-004', createdAt: new Date(Date.now() - 172800000), resolvedDate: new Date() },
    { _id: '5', title: 'Configure firewall', status: 'closed', priority: 'medium', ticketNumber: 'TKT-005', createdAt: new Date(Date.now() - 259200000), resolvedDate: new Date(Date.now() - 86400000) },
  ];

  const ticketsToUse = tickets.length > 0 ? tickets : mockTickets;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back! Here's what's happening.
          </p>
        </div>
        <button
          onClick={refreshData}
          className="btn-icon"
          disabled={refreshing}
        >
          <RefreshCwIcon className={`h-5 w-5 text-gray-600 dark:text-gray-400 ${refreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Tickets"
          value={stats.totalTickets || 5}
          icon={TicketIcon}
          color="bg-gradient-to-br from-blue-500 to-blue-600"
          trend="+12% from last week"
        />
        <StatCard
          title="Open Tickets"
          value={stats.openTickets || 3}
          icon={AlertTriangleIcon}
          color="bg-gradient-to-br from-orange-500 to-orange-600"
        />
        <StatCard
          title="Resolved Tickets"
          value={stats.resolvedTickets || 2}
          icon={CheckCircleIcon}
          color="bg-gradient-to-br from-green-500 to-green-600"
          trend="+8% resolution rate"
        />
        <StatCard
          title="Critical Issues"
          value={stats.criticalTickets || 1}
          icon={XCircleIcon}
          color="bg-gradient-to-br from-red-500 to-red-600"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Online Devices"
          value={stats.onlineDevices || 12}
          icon={ServerIcon}
          color="bg-gradient-to-br from-green-500 to-green-600"
        />
        <StatCard
          title="Offline Devices"
          value={stats.offlineDevices || 3}
          icon={XCircleIcon}
          color="bg-gradient-to-br from-red-500 to-red-600"
        />
        <StatCard
          title="Avg Resolution Time"
          value={`${stats.avgResolutionTime || 4.5}h`}
          icon={ClockIcon}
          color="bg-gradient-to-br from-purple-500 to-purple-600"
        />
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-full">
          <TicketChart tickets={ticketsToUse} />
        </div>
        <div className="h-full">
          <RecentTickets tickets={ticketsToUse.slice(0, 5)} />
        </div>
      </div>

      {/* Device Status and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-full">
          <DeviceStatus devices={devices} />
        </div>
        <div className="h-full">
          <AlertsPanel />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;