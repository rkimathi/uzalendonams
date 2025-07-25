import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Divider,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useTheme,
  alpha
} from '@mui/material';
import {
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  Timeline as TimelineIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
  Share as ShareIcon,
  DateRange as DateRangeIcon
} from '@mui/icons-material';

// Mock chart component (in a real app, you'd use a library like Recharts or Chart.js)
const MockChart = ({ type, height = 300 }) => {
  const theme = useTheme();
  
  return (
    <Box 
      sx={{ 
        height, 
        width: '100%', 
        bgcolor: alpha(theme.palette.background.paper, 0.5),
        borderRadius: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: `1px dashed ${theme.palette.divider}`
      }}
    >
      <Typography color="text.secondary" align="center">
        {type} Chart<br />
        <Typography variant="caption">
          (Visualization would be rendered here)
        </Typography>
      </Typography>
    </Box>
  );
};

const ReportsPage = () => {
  const theme = useTheme();
  const [reportType, setReportType] = useState('performance');
  const [timeRange, setTimeRange] = useState('7days');
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Mock data for performance metrics
  const performanceData = [
    { id: 1, device: 'Main Server', uptime: '99.98%', avgCpu: '45%', avgMemory: '62%', avgDisk: '78%', incidents: 2 },
    { id: 2, device: 'Database Server', uptime: '99.95%', avgCpu: '65%', avgMemory: '72%', avgDisk: '65%', incidents: 1 },
    { id: 3, device: 'Web Server 1', uptime: '100%', avgCpu: '38%', avgMemory: '45%', avgDisk: '52%', incidents: 0 },
    { id: 4, device: 'Web Server 2', uptime: '99.92%', avgCpu: '42%', avgMemory: '48%', avgDisk: '55%', incidents: 1 },
    { id: 5, device: 'Storage Server', uptime: '99.99%', avgCpu: '25%', avgMemory: '30%', avgDisk: '88%', incidents: 0 },
  ];

  // Mock data for incident metrics
  const incidentData = [
    { id: 1, category: 'Hardware Failure', count: 3, avgResolutionTime: '4h 12m', impactLevel: 'High' },
    { id: 2, category: 'Network Outage', count: 1, avgResolutionTime: '2h 45m', impactLevel: 'Critical' },
    { id: 3, category: 'Software Error', count: 7, avgResolutionTime: '1h 30m', impactLevel: 'Medium' },
    { id: 4, category: 'Security Alert', count: 2, avgResolutionTime: '3h 20m', impactLevel: 'High' },
    { id: 5, category: 'Performance Degradation', count: 5, avgResolutionTime: '1h 15m', impactLevel: 'Low' },
  ];

  // Mock data for network metrics
  const networkData = [
    { id: 1, segment: 'WAN Link', bandwidth: '500 Mbps', utilization: '65%', latency: '25ms', packetLoss: '0.02%' },
    { id: 2, segment: 'Core Switch', bandwidth: '10 Gbps', utilization: '45%', latency: '0.5ms', packetLoss: '0.00%' },
    { id: 3, segment: 'DMZ', bandwidth: '1 Gbps', utilization: '38%', latency: '2ms', packetLoss: '0.01%' },
    { id: 4, segment: 'Server VLAN', bandwidth: '10 Gbps', utilization: '72%', latency: '0.8ms', packetLoss: '0.00%' },
    { id: 5, segment: 'User VLAN', bandwidth: '1 Gbps', utilization: '55%', latency: '1.2ms', packetLoss: '0.01%' },
  ];

  const getReportData = () => {
    switch (reportType) {
      case 'performance':
        return performanceData;
      case 'incidents':
        return incidentData;
      case 'network':
        return networkData;
      default:
        return performanceData;
    }
  };

  const renderTableHeaders = () => {
    switch (reportType) {
      case 'performance':
        return (
          <TableRow>
            <TableCell>Device</TableCell>
            <TableCell align="right">Uptime</TableCell>
            <TableCell align="right">Avg CPU</TableCell>
            <TableCell align="right">Avg Memory</TableCell>
            <TableCell align="right">Avg Disk</TableCell>
            <TableCell align="right">Incidents</TableCell>
          </TableRow>
        );
      case 'incidents':
        return (
          <TableRow>
            <TableCell>Category</TableCell>
            <TableCell align="right">Count</TableCell>
            <TableCell align="right">Avg Resolution Time</TableCell>
            <TableCell align="right">Impact Level</TableCell>
          </TableRow>
        );
      case 'network':
        return (
          <TableRow>
            <TableCell>Segment</TableCell>
            <TableCell align="right">Bandwidth</TableCell>
            <TableCell align="right">Utilization</TableCell>
            <TableCell align="right">Latency</TableCell>
            <TableCell align="right">Packet Loss</TableCell>
          </TableRow>
        );
      default:
        return null;
    }
  };

  const renderTableRows = () => {
    const data = getReportData();
    
    switch (reportType) {
      case 'performance':
        return data.map((row) => (
          <TableRow key={row.id}>
            <TableCell component="th" scope="row">{row.device}</TableCell>
            <TableCell align="right">{row.uptime}</TableCell>
            <TableCell align="right">{row.avgCpu}</TableCell>
            <TableCell align="right">{row.avgMemory}</TableCell>
            <TableCell align="right">{row.avgDisk}</TableCell>
            <TableCell align="right">{row.incidents}</TableCell>
          </TableRow>
        ));
      case 'incidents':
        return data.map((row) => (
          <TableRow key={row.id}>
            <TableCell component="th" scope="row">{row.category}</TableCell>
            <TableCell align="right">{row.count}</TableCell>
            <TableCell align="right">{row.avgResolutionTime}</TableCell>
            <TableCell align="right">{row.impactLevel}</TableCell>
          </TableRow>
        ));
      case 'network':
        return data.map((row) => (
          <TableRow key={row.id}>
            <TableCell component="th" scope="row">{row.segment}</TableCell>
            <TableCell align="right">{row.bandwidth}</TableCell>
            <TableCell align="right">{row.utilization}</TableCell>
            <TableCell align="right">{row.latency}</TableCell>
            <TableCell align="right">{row.packetLoss}</TableCell>
          </TableRow>
        ));
      default:
        return null;
    }
  };

  const renderCharts = () => {
    switch (reportType) {
      case 'performance':
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="CPU Usage" />
                <CardContent>
                  <MockChart type="Bar" />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Memory Usage" />
                <CardContent>
                  <MockChart type="Bar" />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card>
                <CardHeader title="Performance Trends" />
                <CardContent>
                  <MockChart type="Line" height={350} />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        );
      case 'incidents':
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Incidents by Category" />
                <CardContent>
                  <MockChart type="Pie" />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Incidents by Impact" />
                <CardContent>
                  <MockChart type="Pie" />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card>
                <CardHeader title="Incident Trends" />
                <CardContent>
                  <MockChart type="Line" height={350} />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        );
      case 'network':
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Bandwidth Utilization" />
                <CardContent>
                  <MockChart type="Bar" />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Latency by Segment" />
                <CardContent>
                  <MockChart type="Bar" />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card>
                <CardHeader title="Network Trends" />
                <CardContent>
                  <MockChart type="Line" height={350} />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        );
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
              Reports
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Generate and view system performance reports
            </Typography>
          </Box>
        </Box>

        {/* Report Controls */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel id="report-type-label">Report Type</InputLabel>
                  <Select
                    labelId="report-type-label"
                    id="report-type"
                    value={reportType}
                    label="Report Type"
                    onChange={(e) => setReportType(e.target.value)}
                  >
                    <MenuItem value="performance">Performance Report</MenuItem>
                    <MenuItem value="incidents">Incident Report</MenuItem>
                    <MenuItem value="network">Network Report</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel id="time-range-label">Time Range</InputLabel>
                  <Select
                    labelId="time-range-label"
                    id="time-range"
                    value={timeRange}
                    label="Time Range"
                    onChange={(e) => setTimeRange(e.target.value)}
                  >
                    <MenuItem value="24hours">Last 24 Hours</MenuItem>
                    <MenuItem value="7days">Last 7 Days</MenuItem>
                    <MenuItem value="30days">Last 30 Days</MenuItem>
                    <MenuItem value="90days">Last 90 Days</MenuItem>
                    <MenuItem value="custom">Custom Range</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={4}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button 
                    variant="contained" 
                    startIcon={<BarChartIcon />}
                    fullWidth
                  >
                    Generate Report
                  </Button>
                  <Button 
                    variant="outlined"
                    startIcon={<DownloadIcon />}
                  >
                    Export
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Report Content */}
        <Card>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={activeTab} onChange={handleTabChange} aria-label="report tabs">
              <Tab label="Overview" />
              <Tab label="Charts" />
              <Tab label="Data Table" />
            </Tabs>
          </Box>
          
          {/* Overview Tab */}
          {activeTab === 0 && (
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                {reportType === 'performance' && 'Performance Overview'}
                {reportType === 'incidents' && 'Incident Overview'}
                {reportType === 'network' && 'Network Overview'}
              </Typography>
              
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={4}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Box sx={{ 
                        display: 'inline-flex', 
                        p: 1.5, 
                        borderRadius: '50%', 
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.main,
                        mb: 2
                      }}>
                        {reportType === 'performance' && <BarChartIcon fontSize="large" />}
                        {reportType === 'incidents' && <TimelineIcon fontSize="large" />}
                        {reportType === 'network' && <BarChartIcon fontSize="large" />}
                      </Box>
                      <Typography variant="h4" fontWeight="bold">
                        {reportType === 'performance' && '98.5%'}
                        {reportType === 'incidents' && '18'}
                        {reportType === 'network' && '55%'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {reportType === 'performance' && 'Average Uptime'}
                        {reportType === 'incidents' && 'Total Incidents'}
                        {reportType === 'network' && 'Average Utilization'}
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
                        bgcolor: alpha(theme.palette.secondary.main, 0.1),
                        color: theme.palette.secondary.main,
                        mb: 2
                      }}>
                        {reportType === 'performance' && <PieChartIcon fontSize="large" />}
                        {reportType === 'incidents' && <PieChartIcon fontSize="large" />}
                        {reportType === 'network' && <TimelineIcon fontSize="large" />}
                      </Box>
                      <Typography variant="h4" fontWeight="bold">
                        {reportType === 'performance' && '43%'}
                        {reportType === 'incidents' && '2.5h'}
                        {reportType === 'network' && '12ms'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {reportType === 'performance' && 'Average CPU Usage'}
                        {reportType === 'incidents' && 'Avg Resolution Time'}
                        {reportType === 'network' && 'Average Latency'}
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
                        bgcolor: alpha(theme.palette.success.main, 0.1),
                        color: theme.palette.success.main,
                        mb: 2
                      }}>
                        <BarChartIcon fontSize="large" />
                      </Box>
                      <Typography variant="h4" fontWeight="bold">
                        {reportType === 'performance' && '4'}
                        {reportType === 'incidents' && '3'}
                        {reportType === 'network' && '0.01%'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {reportType === 'performance' && 'Total Incidents'}
                        {reportType === 'incidents' && 'Critical Incidents'}
                        {reportType === 'network' && 'Packet Loss'}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <Card>
                    <CardHeader title="Trend Analysis" />
                    <CardContent>
                      <MockChart type="Line" height={350} />
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card>
                    <CardHeader title="Distribution" />
                    <CardContent>
                      <MockChart type="Pie" height={350} />
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}
          
          {/* Charts Tab */}
          {activeTab === 1 && (
            <Box sx={{ p: 3 }}>
              {renderCharts()}
            </Box>
          )}
          
          {/* Data Table Tab */}
          {activeTab === 2 && (
            <Box sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <Button startIcon={<DownloadIcon />} size="small" sx={{ mr: 1 }}>
                  Export CSV
                </Button>
                <Button startIcon={<PrintIcon />} size="small">
                  Print
                </Button>
              </Box>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="report data table">
                  <TableHead>
                    {renderTableHeaders()}
                  </TableHead>
                  <TableBody>
                    {renderTableRows()}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </Card>
      </Box>
    </Container>
  );
};

export default ReportsPage;