import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  useTheme,
  alpha
} from '@mui/material';
import {
  Warning as AlertTriangleIcon,
  Storage as ServerIcon,
  Memory as CpuIcon,
  SdStorage as HardDriveIcon,
  Thermostat as ThermometerIcon,
  Wifi as WifiIcon,
  Notifications as BellIcon,
  ChevronRight as ChevronRightIcon,
  Shield as ShieldIcon
} from '@mui/icons-material';

const AlertsPanel = () => {
  const theme = useTheme();
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
        return theme.palette.error;
      case 'warning':
        return theme.palette.warning;
      case 'info':
        return theme.palette.info;
      default:
        return theme.palette.grey;
    }
  };

  const getAlertBorder = (type) => {
    switch (type) {
      case 'critical':
        return `4px solid ${theme.palette.error.main}`;
      case 'warning':
        return `4px solid ${theme.palette.warning.main}`;
      case 'info':
        return `4px solid ${theme.palette.info.main}`;
      default:
        return 'none';
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
    <Card elevation={2} sx={{ height: '100%' }}>
      <CardHeader
        title="Active Alerts"
        action={
          <Link
            to="/alerts"
            style={{
              color: theme.palette.primary.main,
              textDecoration: 'none',
              fontSize: '0.875rem'
            }}
          >
            View all
          </Link>
        }
      />
      
      <CardContent sx={{ pt: 0 }}>
        {alerts.length === 0 ? (
          <Box
            sx={{
              textAlign: 'center',
              py: 5,
              borderRadius: 2,
              bgcolor: alpha(theme.palette.background.paper, 0.5)
            }}
          >
            <BellIcon
              sx={{
                fontSize: 48,
                color: theme.palette.text.disabled,
                mb: 1.5
              }}
            />
            <Typography color="text.secondary">No active alerts</Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {alerts.map((alert) => (
              <Card
                key={alert.id}
                component={Link}
                to={`/alerts/${alert.id}`}
                sx={{
                  p: 2,
                  display: 'block',
                  textDecoration: 'none',
                  bgcolor: alpha(theme.palette.background.paper, 0.5),
                  transition: 'all 0.2s',
                  borderLeft: getAlertBorder(alert.type),
                  '&:hover': {
                    bgcolor: alpha(theme.palette.background.paper, 0.8)
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: '50%',
                        bgcolor: alpha(getAlertColor(alert.type).main, 0.1),
                        color: getAlertColor(alert.type).main
                      }}
                    >
                      {getAlertIcon(alert.type, alert.metric)}
                    </Box>
                    <Box>
                      <Typography variant="body1" fontWeight="medium" color="text.primary">
                        {alert.message}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', fontSize: '0.875rem', color: 'text.secondary' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mr: 1.5 }}>
                          {getDeviceIcon(alert.deviceType)}
                          <Typography variant="body2" sx={{ ml: 0.5 }}>
                            {alert.device}
                          </Typography>
                        </Box>
                        <Typography variant="body2">
                          {getTimeAgo(alert.timestamp)}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  <ChevronRightIcon sx={{ color: theme.palette.text.disabled }} />
                </Box>
              </Card>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default AlertsPanel;