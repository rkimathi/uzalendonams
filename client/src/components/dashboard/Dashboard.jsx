import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  IconButton,
  Typography,
  useTheme,
  alpha
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  ConfirmationNumber as TicketIcon,
  Storage as ServerIcon,
  People as UsersIcon,
  Warning as AlertTriangleIcon,
  TrendingUp as TrendingUpIcon,
  AccessTime as ClockIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as XCircleIcon
} from '@mui/icons-material';
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

  const theme = useTheme();

  const StatCard = ({ title, value, icon: Icon, color, trend }) => {
    const gradientStyle = {
      background: color,
      borderRadius: '50%',
      width: 48,
      height: 48,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white'
    };

    return (
      <Card elevation={2} sx={{ height: '100%' }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                {title}
              </Typography>
              <Typography variant="h4" fontWeight="bold" sx={{ mt: 1 }}>
                {value}
              </Typography>
              {trend && (
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <TrendingUpIcon sx={{ fontSize: 16, color: 'success.main', mr: 0.5 }} />
                  <Typography variant="caption" color="success.main">
                    {trend}
                  </Typography>
                </Box>
              )}
            </Box>
            <Box sx={gradientStyle}>
              <Icon />
            </Box>
          </Box>
        </CardContent>
      </Card>
    );
  };

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
    <Container maxWidth="xl">
      <Box sx={{ py: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography
              variant="h4"
              component="h1"
              fontWeight="bold"
              sx={{
                background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                color: 'transparent'
              }}
            >
              Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Welcome back! Here's what's happening.
            </Typography>
          </Box>
          <IconButton
            onClick={refreshData}
            disabled={refreshing}
            color="primary"
          >
            <RefreshIcon className={refreshing ? 'animate-spin' : ''} />
          </IconButton>
        </Box>

        {/* Stats Grid */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <StatCard
              title="Total Tickets"
              value={stats.totalTickets || 5}
              icon={TicketIcon}
              color={`linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`}
              trend="+12% from last week"
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <StatCard
              title="Open Tickets"
              value={stats.openTickets || 3}
              icon={AlertTriangleIcon}
              color={`linear-gradient(135deg, ${theme.palette.warning.main}, ${theme.palette.warning.dark})`}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <StatCard
              title="Resolved Tickets"
              value={stats.resolvedTickets || 2}
              icon={CheckCircleIcon}
              color={`linear-gradient(135deg, ${theme.palette.success.main}, ${theme.palette.success.dark})`}
              trend="+8% resolution rate"
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <StatCard
              title="Critical Issues"
              value={stats.criticalTickets || 1}
              icon={XCircleIcon}
              color={`linear-gradient(135deg, ${theme.palette.error.main}, ${theme.palette.error.dark})`}
            />
          </Grid>
        </Grid>

        {/* Secondary Stats */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <StatCard
              title="Online Devices"
              value={stats.onlineDevices || 12}
              icon={ServerIcon}
              color={`linear-gradient(135deg, ${theme.palette.success.main}, ${theme.palette.success.dark})`}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <StatCard
              title="Offline Devices"
              value={stats.offlineDevices || 3}
              icon={XCircleIcon}
              color={`linear-gradient(135deg, ${theme.palette.error.main}, ${theme.palette.error.dark})`}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <StatCard
              title="Avg Resolution Time"
              value={`${stats.avgResolutionTime || 4.5}h`}
              icon={ClockIcon}
              color={`linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark})`}
            />
          </Grid>
        </Grid>

        {/* Charts and Recent Activity */}
        <Grid container spacing={3}>
          <Grid item xs={12} lg={6}>
            <Box sx={{ height: '100%' }}>
              <TicketChart tickets={ticketsToUse} />
            </Box>
          </Grid>
          <Grid item xs={12} lg={6}>
            <Box sx={{ height: '100%' }}>
              <RecentTickets tickets={ticketsToUse.slice(0, 5)} />
            </Box>
          </Grid>
        </Grid>

        {/* Device Status and Alerts */}
        <Grid container spacing={3}>
          <Grid item xs={12} lg={6}>
            <Box sx={{ height: '100%' }}>
              <DeviceStatus devices={devices} />
            </Box>
          </Grid>
          <Grid item xs={12} lg={6}>
            <Box sx={{ height: '100%' }}>
              <AlertsPanel />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Dashboard;