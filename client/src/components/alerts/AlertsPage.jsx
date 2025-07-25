import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  Typography,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  Divider,
  Button,
  useTheme,
  alpha
} from '@mui/material';
import {
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  FilterList as FilterListIcon
} from '@mui/icons-material';

const AlertsPage = () => {
  const theme = useTheme();
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock alerts data
  const alerts = [
    {
      id: 1,
      title: 'Server CPU usage above 90%',
      device: 'Main Server',
      deviceId: 'srv-001',
      severity: 'critical',
      status: 'active',
      timestamp: new Date(Date.now() - 15 * 60000), // 15 minutes ago
      description: 'CPU usage has been above 90% for more than 5 minutes',
      metric: 'CPU',
      value: '92%',
      threshold: '90%'
    },
    {
      id: 2,
      title: 'High memory usage detected',
      device: 'Database Server',
      deviceId: 'srv-002',
      severity: 'warning',
      status: 'active',
      timestamp: new Date(Date.now() - 45 * 60000), // 45 minutes ago
      description: 'Memory usage has reached 85%, above the warning threshold of 80%',
      metric: 'Memory',
      value: '85%',
      threshold: '80%'
    },
    {
      id: 3,
      title: 'Disk space running low',
      device: 'Storage Server',
      deviceId: 'srv-003',
      severity: 'warning',
      status: 'active',
      timestamp: new Date(Date.now() - 120 * 60000), // 2 hours ago
      description: 'Disk usage has reached 92%, above the warning threshold of 90%',
      metric: 'Disk',
      value: '92%',
      threshold: '90%'
    },
    {
      id: 4,
      title: 'Access Point offline',
      device: 'Floor 1 AP',
      deviceId: 'ap-001',
      severity: 'critical',
      status: 'active',
      timestamp: new Date(Date.now() - 180 * 60000), // 3 hours ago
      description: 'Access point has been offline for more than 15 minutes',
      metric: 'Connectivity',
      value: 'Offline',
      threshold: 'Online'
    },
    {
      id: 5,
      title: 'System update available',
      device: 'Core Router',
      deviceId: 'rtr-001',
      severity: 'info',
      status: 'active',
      timestamp: new Date(Date.now() - 240 * 60000), // 4 hours ago
      description: 'A new firmware update (v1.2.4) is available for the core router',
      metric: 'Firmware',
      value: 'v1.2.3',
      threshold: 'v1.2.4'
    },
    {
      id: 6,
      title: 'Network latency spike',
      device: 'WAN Link',
      deviceId: 'wan-001',
      severity: 'warning',
      status: 'resolved',
      timestamp: new Date(Date.now() - 360 * 60000), // 6 hours ago
      resolvedAt: new Date(Date.now() - 300 * 60000), // 5 hours ago
      description: 'Network latency spiked to 250ms, above the warning threshold of 150ms',
      metric: 'Latency',
      value: '250ms',
      threshold: '150ms'
    },
    {
      id: 7,
      title: 'Backup failure',
      device: 'Backup Server',
      deviceId: 'bkp-001',
      severity: 'critical',
      status: 'resolved',
      timestamp: new Date(Date.now() - 1440 * 60000), // 24 hours ago
      resolvedAt: new Date(Date.now() - 1380 * 60000), // 23 hours ago
      description: 'Scheduled backup failed due to insufficient disk space',
      metric: 'Backup',
      value: 'Failed',
      threshold: 'Success'
    }
  ];

  // Filter alerts based on search and filters
  const filteredAlerts = alerts.filter(alert => {
    // Search filter
    if (searchTerm && !alert.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !alert.device.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Status filter
    if (statusFilter !== 'all' && alert.status !== statusFilter) {
      return false;
    }
    
    // Type/severity filter
    if (typeFilter !== 'all' && alert.severity !== typeFilter) {
      return false;
    }
    
    return true;
  });

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

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical':
        return <ErrorIcon sx={{ color: theme.palette.error.main }} />;
      case 'warning':
        return <WarningIcon sx={{ color: theme.palette.warning.main }} />;
      case 'info':
        return <InfoIcon sx={{ color: theme.palette.info.main }} />;
      default:
        return <InfoIcon sx={{ color: theme.palette.info.main }} />;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return theme.palette.error;
      case 'warning':
        return theme.palette.warning;
      case 'info':
        return theme.palette.info;
      default:
        return theme.palette.info;
    }
  };

  const getStatusChip = (status) => {
    switch (status) {
      case 'active':
        return (
          <Chip 
            label="Active" 
            size="small"
            sx={{ 
              bgcolor: alpha(theme.palette.error.main, 0.1),
              color: theme.palette.error.main,
              fontWeight: 500
            }}
          />
        );
      case 'resolved':
        return (
          <Chip 
            label="Resolved" 
            size="small"
            sx={{ 
              bgcolor: alpha(theme.palette.success.main, 0.1),
              color: theme.palette.success.main,
              fontWeight: 500
            }}
          />
        );
      default:
        return (
          <Chip 
            label={status} 
            size="small"
            sx={{ 
              bgcolor: alpha(theme.palette.grey[500], 0.1),
              color: theme.palette.grey[700],
              fontWeight: 500
            }}
          />
        );
    }
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
              Alerts
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Monitor and manage system alerts
            </Typography>
          </Box>
        </Box>

        {/* Filters */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              {/* Search */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  placeholder="Search alerts..."
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
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="resolved">Resolved</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Type Filter */}
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel id="type-filter-label">Severity</InputLabel>
                  <Select
                    labelId="type-filter-label"
                    id="type-filter"
                    value={typeFilter}
                    label="Severity"
                    onChange={(e) => setTypeFilter(e.target.value)}
                  >
                    <MenuItem value="all">All Severities</MenuItem>
                    <MenuItem value="critical">Critical</MenuItem>
                    <MenuItem value="warning">Warning</MenuItem>
                    <MenuItem value="info">Info</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Alerts Summary */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Box sx={{ 
                  display: 'inline-flex', 
                  p: 1.5, 
                  borderRadius: '50%', 
                  bgcolor: alpha(theme.palette.error.main, 0.1),
                  color: theme.palette.error.main,
                  mb: 2
                }}>
                  <ErrorIcon fontSize="large" />
                </Box>
                <Typography variant="h4" fontWeight="bold">
                  {alerts.filter(a => a.severity === 'critical' && a.status === 'active').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Critical Alerts
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Box sx={{ 
                  display: 'inline-flex', 
                  p: 1.5, 
                  borderRadius: '50%', 
                  bgcolor: alpha(theme.palette.warning.main, 0.1),
                  color: theme.palette.warning.main,
                  mb: 2
                }}>
                  <WarningIcon fontSize="large" />
                </Box>
                <Typography variant="h4" fontWeight="bold">
                  {alerts.filter(a => a.severity === 'warning' && a.status === 'active').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Warning Alerts
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Box sx={{ 
                  display: 'inline-flex', 
                  p: 1.5, 
                  borderRadius: '50%', 
                  bgcolor: alpha(theme.palette.info.main, 0.1),
                  color: theme.palette.info.main,
                  mb: 2
                }}>
                  <InfoIcon fontSize="large" />
                </Box>
                <Typography variant="h4" fontWeight="bold">
                  {alerts.filter(a => a.severity === 'info' && a.status === 'active').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Info Alerts
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Alerts List */}
        <Card>
          <CardHeader 
            title="Alert History" 
            action={
              <Button 
                variant="outlined" 
                startIcon={<FilterListIcon />}
                size="small"
              >
                Filter
              </Button>
            }
          />
          <Divider />
          <CardContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {filteredAlerts.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <NotificationsIcon sx={{ fontSize: 48, color: theme.palette.text.disabled, mb: 2 }} />
                  <Typography color="text.secondary">No alerts found</Typography>
                </Box>
              ) : (
                filteredAlerts.map((alert) => (
                  <Card 
                    key={alert.id} 
                    sx={{ 
                      p: 2,
                      borderLeft: `4px solid ${getSeverityColor(alert.severity).main}`,
                      bgcolor: alpha(theme.palette.background.paper, 0.5),
                      '&:hover': {
                        bgcolor: alpha(theme.palette.background.paper, 0.8)
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Box 
                          sx={{ 
                            p: 1, 
                            borderRadius: '50%',
                            bgcolor: alpha(getSeverityColor(alert.severity).main, 0.1),
                            color: getSeverityColor(alert.severity).main,
                            height: 40,
                            width: 40,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          {getSeverityIcon(alert.severity)}
                        </Box>
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <Typography variant="subtitle1" fontWeight="medium">
                              {alert.title}
                            </Typography>
                            {getStatusChip(alert.status)}
                          </Box>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            {alert.device} • {getTimeAgo(alert.timestamp)}
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            {alert.description}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                            <Typography variant="caption" color="text.secondary">
                              <strong>Metric:</strong> {alert.metric}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              <strong>Value:</strong> {alert.value}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              <strong>Threshold:</strong> {alert.threshold}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                      <Box>
                        <Button 
                          variant="outlined" 
                          size="small" 
                          color={alert.status === 'active' ? 'success' : 'primary'}
                        >
                          {alert.status === 'active' ? 'Resolve' : 'View Details'}
                        </Button>
                      </Box>
                    </Box>
                  </Card>
                ))
              )}
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default AlertsPage;