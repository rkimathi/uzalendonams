import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Grid,
  Typography,
  useTheme,
  alpha
} from '@mui/material';
import {
  Storage as ServerIcon,
  Wifi as WifiIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as XCircleIcon,
  Warning as AlertTriangleIcon,
  ChevronRight as ChevronRightIcon,
  Memory as HardDriveIcon
} from '@mui/icons-material';

const DeviceStatus = ({ devices }) => {
  const theme = useTheme();
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
      online: theme.palette.success,
      offline: theme.palette.error,
      warning: theme.palette.warning,
      maintenance: theme.palette.info
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
    <Card elevation={2} sx={{ height: '100%' }}>
      <CardHeader
        title="Device Status"
        action={
          <Link
            to="/monitoring"
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
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={4}>
            <Card
              sx={{
                p: 2,
                textAlign: 'center',
                bgcolor: alpha(theme.palette.background.paper, 0.5)
              }}
            >
              <Typography
                variant="h4"
                fontWeight="bold"
                sx={{ color: theme.palette.success.main }}
              >
                {statusSummary.online || 0}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: theme.palette.success.dark }}
              >
                Online
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card
              sx={{
                p: 2,
                textAlign: 'center',
                bgcolor: alpha(theme.palette.background.paper, 0.5)
              }}
            >
              <Typography
                variant="h4"
                fontWeight="bold"
                sx={{ color: theme.palette.warning.main }}
              >
                {statusSummary.warning || 0}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: theme.palette.warning.dark }}
              >
                Warning
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card
              sx={{
                p: 2,
                textAlign: 'center',
                bgcolor: alpha(theme.palette.background.paper, 0.5)
              }}
            >
              <Typography
                variant="h4"
                fontWeight="bold"
                sx={{ color: theme.palette.error.main }}
              >
                {statusSummary.offline || 0}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: theme.palette.error.dark }}
              >
                Offline
              </Typography>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {devicesToShow.map((device) => (
            <Card
              key={device.id}
              component={Link}
              to={`/monitoring/devices/${device.id}`}
              sx={{
                p: 2,
                display: 'block',
                textDecoration: 'none',
                bgcolor: alpha(theme.palette.background.paper, 0.5),
                transition: 'all 0.2s',
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
                      bgcolor: alpha(
                        device.status === 'online'
                          ? theme.palette.success.main
                          : device.status === 'warning'
                            ? theme.palette.warning.main
                            : theme.palette.error.main,
                        0.1
                      )
                    }}
                  >
                    {getDeviceIcon(device.type)}
                  </Box>
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body1" fontWeight="medium" color="text.primary">
                        {device.name}
                      </Typography>
                      <Chip
                        label={device.status}
                        size="small"
                        sx={{
                          ml: 1,
                          bgcolor: alpha(getStatusColor(device.status).main, 0.1),
                          color: getStatusColor(device.status).main,
                          fontWeight: 500,
                          fontSize: '0.75rem'
                        }}
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {device.ip} • {device.location}
                    </Typography>
                  </Box>
                </Box>
                <ChevronRightIcon sx={{ color: theme.palette.text.disabled }} />
              </Box>
            </Card>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default DeviceStatus;