import React, { useState, useEffect } from 'react';
import { useDeviceStore } from '../../stores/deviceStore';
import { useSocketStore } from '../../stores/socketStore';

// Material UI imports
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useTheme,
  alpha
} from '@mui/material';

// Material UI icons
import {
  Refresh as RefreshIcon,
  Search as SearchIcon,
  Router as RouterIcon,
  Wifi as WifiIcon,
  Storage as StorageIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon
} from '@mui/icons-material';

const DeviceMonitoring = () => {
  const { devices, fetchDevices, loading, error, updateDeviceInStore } = useDeviceStore();
  const { socket, on, off } = useSocketStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const theme = useTheme();

  // Initial fetch of devices
  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  // Subscribe to real-time device updates
  useEffect(() => {
    if (socket) {
      // Listen for device updates
      const handleDeviceUpdate = (data) => {
        console.log('Device update received:', data);
        if (data && data.deviceId) {
          // Update the device in the store
          updateDeviceInStore(data.deviceId, data);
        }
      };

      // Subscribe to device_updated events
      on('device_updated', handleDeviceUpdate);

      // Cleanup function
      return () => {
        off('device_updated', handleDeviceUpdate);
      };
    }
  }, [socket, on, off, updateDeviceInStore]);

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

  // If no real data is available, use mock data for demonstration
  const mockDevices = [
    { id: 1, name: 'Core Router', type: 'router', status: 'online', ip: '192.168.1.1', location: 'Server Room', lastSeen: new Date(), cpu: 45, memory: 62, uptime: '45d 12h 36m' },
    { id: 2, name: 'Main Switch', type: 'switch', status: 'online', ip: '192.168.1.2', location: 'Server Room', lastSeen: new Date(), cpu: 28, memory: 45, uptime: '120d 5h 12m' },
    { id: 3, name: 'Backup Server', type: 'server', status: 'warning', ip: '192.168.1.10', location: 'Server Room', lastSeen: new Date(), cpu: 89, memory: 92, uptime: '15d 8h 42m' },
    { id: 4, name: 'Access Point 1', type: 'access_point', status: 'offline', ip: '192.168.1.100', location: 'Floor 1', lastSeen: new Date(Date.now() - 86400000), cpu: 0, memory: 0, uptime: '0d 0h 0m' },
    { id: 5, name: 'Access Point 2', type: 'access_point', status: 'online', ip: '192.168.1.101', location: 'Floor 2', lastSeen: new Date(), cpu: 22, memory: 35, uptime: '30d 14h 22m' },
  ];

  // Use real data if available, otherwise use mock data
  const displayDevices = devices.length > 0 ? filteredDevices : mockDevices;

  const getStatusColor = (status) => {
    switch (status) {
      case 'online':
        return theme.palette.success.main;
      case 'offline':
        return theme.palette.error.main;
      case 'warning':
        return theme.palette.warning.main;
      default:
        return theme.palette.grey[500];
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'online':
        return <CheckCircleIcon sx={{ color: theme.palette.success.main }} />;
      case 'offline':
        return <ErrorIcon sx={{ color: theme.palette.error.main }} />;
      case 'warning':
        return <WarningIcon sx={{ color: theme.palette.warning.main }} />;
      default:
        return <StorageIcon sx={{ color: theme.palette.grey[500] }} />;
    }
  };

  const getDeviceIcon = (type) => {
    switch (type) {
      case 'router':
        return <RouterIcon />;
      case 'switch':
        return <RouterIcon />;
      case 'server':
        return <StorageIcon />;
      case 'access_point':
        return <WifiIcon />;
      default:
        return <StorageIcon />;
    }
  };

  const getProgressColor = (value) => {
    if (value > 80) return theme.palette.error.main;
    if (value > 60) return theme.palette.warning.main;
    return theme.palette.success.main;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
              Device Monitoring
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Monitor and manage network devices
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={() => fetchDevices()}
          >
            Refresh
          </Button>
        </Box>

        {/* Error message if any */}
        {error && (
          <Paper 
            sx={{ 
              p: 2, 
              mb: 3, 
              bgcolor: alpha(theme.palette.error.main, 0.1),
              color: theme.palette.error.main,
              border: `1px solid ${theme.palette.error.light}`
            }}
          >
            <Typography variant="body2">{error}</Typography>
          </Paper>
        )}

        {/* Search and Filters */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              {/* Search */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  placeholder="Search devices..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* Status Filter */}
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel id="status-filter-label">Status</InputLabel>
                  <Select
                    labelId="status-filter-label"
                    id="status-filter"
                    value={statusFilter}
                    label="Status"
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <MenuItem value="all">All Statuses</MenuItem>
                    <MenuItem value="online">Online</MenuItem>
                    <MenuItem value="offline">Offline</MenuItem>
                    <MenuItem value="warning">Warning</MenuItem>
                    <MenuItem value="maintenance">Maintenance</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Type Filter */}
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel id="type-filter-label">Type</InputLabel>
                  <Select
                    labelId="type-filter-label"
                    id="type-filter"
                    value={typeFilter}
                    label="Type"
                    onChange={(e) => setTypeFilter(e.target.value)}
                  >
                    <MenuItem value="all">All Types</MenuItem>
                    <MenuItem value="router">Routers</MenuItem>
                    <MenuItem value="switch">Switches</MenuItem>
                    <MenuItem value="server">Servers</MenuItem>
                    <MenuItem value="access_point">Access Points</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Devices Table */}
        <TableContainer component={Paper} sx={{ boxShadow: 2 }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: theme.palette.action.hover }}>
                <TableCell>Device</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>IP Address</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>CPU</TableCell>
                <TableCell>Memory</TableCell>
                <TableCell>Uptime</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayDevices.map((device) => (
                <TableRow 
                  key={device.id} 
                  hover
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box 
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          color: theme.palette.primary.main,
                          borderRadius: '50%',
                          width: 40,
                          height: 40,
                          mr: 2
                        }}
                      >
                        {getDeviceIcon(device.type)}
                      </Box>
                      <Box>
                        <Typography variant="body1" fontWeight="medium">
                          {device.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {device.type.replace('_', ' ')}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {getStatusIcon(device.status)}
                      <Box 
                        component="span" 
                        sx={{ 
                          ml: 1,
                          px: 1.5,
                          py: 0.5,
                          borderRadius: 10,
                          fontSize: '0.75rem',
                          fontWeight: 'medium',
                          textTransform: 'capitalize',
                          bgcolor: alpha(getStatusColor(device.status), 0.1),
                          color: getStatusColor(device.status)
                        }}
                      >
                        {device.status}
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{device.ip}</TableCell>
                  <TableCell>{device.location}</TableCell>
                  <TableCell>
                    <Box sx={{ width: 100 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={device.cpu} 
                        sx={{ 
                          height: 8, 
                          borderRadius: 4,
                          mb: 0.5,
                          bgcolor: alpha(getProgressColor(device.cpu), 0.2),
                          '& .MuiLinearProgress-bar': {
                            bgcolor: getProgressColor(device.cpu)
                          }
                        }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {device.cpu}%
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ width: 100 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={device.memory} 
                        sx={{ 
                          height: 8, 
                          borderRadius: 4,
                          mb: 0.5,
                          bgcolor: alpha(getProgressColor(device.memory), 0.2),
                          '& .MuiLinearProgress-bar': {
                            bgcolor: getProgressColor(device.memory)
                          }
                        }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {device.memory}%
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{device.uptime}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
};

export default DeviceMonitoring;