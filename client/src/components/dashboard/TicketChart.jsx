import React from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  useTheme,
  alpha
} from '@mui/material';

const TicketChart = ({ tickets }) => {
  const theme = useTheme();
  // This would normally use a charting library like Chart.js or Recharts
  // For now, we'll create a simple visual representation
  
  const statusCounts = tickets.reduce((acc, ticket) => {
    acc[ticket.status] = (acc[ticket.status] || 0) + 1;
    return acc;
  }, {});
  
  const priorityCounts = tickets.reduce((acc, ticket) => {
    acc[ticket.priority] = (acc[ticket.priority] || 0) + 1;
    return acc;
  }, {});
  
  const getStatusColor = (status) => {
    const colors = {
      new: theme.palette.primary.main,
      assigned: theme.palette.secondary.main,
      in_progress: theme.palette.warning.main,
      pending: theme.palette.warning.dark,
      resolved: theme.palette.success.main,
      closed: theme.palette.grey[500],
      cancelled: theme.palette.error.main
    };
    return colors[status] || colors.new;
  };
  
  const getPriorityColor = (priority) => {
    const colors = {
      low: theme.palette.primary.main,
      medium: theme.palette.warning.main,
      high: theme.palette.warning.dark,
      critical: theme.palette.error.main
    };
    return colors[priority] || colors.medium;
  };
  
  const statusLabels = {
    new: 'New',
    assigned: 'Assigned',
    in_progress: 'In Progress',
    pending: 'Pending',
    resolved: 'Resolved',
    closed: 'Closed',
    cancelled: 'Cancelled'
  };
  
  const priorityLabels = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    critical: 'Critical'
  };
  
  // If no tickets, use mock data
  const mockStatusCounts = {
    new: 2,
    in_progress: 1,
    pending: 1,
    resolved: 1
  };

  const mockPriorityCounts = {
    low: 1,
    medium: 2,
    high: 1,
    critical: 1
  };

  const effectiveStatusCounts = Object.keys(statusCounts).length > 0 ? statusCounts : mockStatusCounts;
  const effectivePriorityCounts = Object.keys(priorityCounts).length > 0 ? priorityCounts : mockPriorityCounts;
  
  const totalTickets = tickets.length || 5; // Use 5 as default if no tickets
  
  return (
    <Card elevation={2} sx={{ height: '100%' }}>
      <CardHeader title="Ticket Overview" />
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Status Distribution */}
        <Box>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
            Status Distribution
          </Typography>
          <Box
            sx={{
              height: 10,
              width: '100%',
              bgcolor: alpha(theme.palette.background.paper, 0.5),
              borderRadius: 5,
              overflow: 'hidden',
              display: 'flex'
            }}
          >
            {Object.entries(effectiveStatusCounts).map(([status, count]) => {
              const width = (count / totalTickets) * 100;
              return (
                <Box
                  key={status}
                  sx={{
                    height: '100%',
                    width: `${width}%`,
                    background: `linear-gradient(to right, ${getStatusColor(status)}, ${alpha(getStatusColor(status), 0.8)})`,
                  }}
                  title={`${statusLabels[status]}: ${count} (${width.toFixed(1)}%)`}
                />
              );
            })}
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 1.5 }}>
            {Object.entries(effectiveStatusCounts).map(([status, count]) => (
              <Box key={status} sx={{ display: 'flex', alignItems: 'center' }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: getStatusColor(status),
                    mr: 0.5
                  }}
                />
                <Typography variant="caption" color="text.secondary">
                  {statusLabels[status]}: {count}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
        
        {/* Priority Distribution */}
        <Box>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
            Priority Distribution
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2 }}>
            {Object.entries(effectivePriorityCounts).map(([priority, count]) => {
              const percentage = (count / totalTickets) * 100;
              return (
                <Box key={priority} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Box
                    sx={{
                      width: '100%',
                      height: 96,
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.background.paper, 0.5),
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        width: '100%',
                        height: `${percentage}%`,
                        background: `linear-gradient(to top, ${getPriorityColor(priority)}, ${alpha(getPriorityColor(priority), 0.5)})`
                      }}
                    />
                  </Box>
                  <Typography variant="caption" fontWeight="medium" sx={{ mt: 0.5 }}>
                    {priorityLabels[priority]}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {count} ({percentage.toFixed(1)}%)
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Box>
        
        {/* Weekly Trend */}
        <Box>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
            Weekly Trend
          </Typography>
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: alpha(theme.palette.background.paper, 0.5),
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'flex-end', height: 128, gap: 1 }}>
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => {
                // Generate random heights for demo
                const height = Math.floor(Math.random() * 70) + 10;
                return (
                  <Box key={day} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Box
                      sx={{
                        width: '100%',
                        height: `${height}%`,
                        borderTopLeftRadius: 2,
                        borderTopRightRadius: 2,
                        background: `linear-gradient(to top, ${theme.palette.primary.main}, ${alpha(theme.palette.primary.light, 0.5)})`
                      }}
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                      {day}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TicketChart;