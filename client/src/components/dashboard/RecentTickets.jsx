import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Typography,
  useTheme,
  alpha
} from '@mui/material';
import {
  Warning as AlertTriangleIcon,
  CheckCircle as CheckCircleIcon,
  AccessTime as ClockIcon,
  ChevronRight as ChevronRightIcon,
  ConfirmationNumber as TicketIcon
} from '@mui/icons-material';

const RecentTickets = ({ tickets }) => {
  const theme = useTheme();
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'new':
      case 'assigned':
      case 'in_progress':
      case 'pending':
        return <ClockIcon fontSize="small" sx={{ color: theme.palette.warning.main }} />;
      case 'resolved':
      case 'closed':
        return <CheckCircleIcon fontSize="small" sx={{ color: theme.palette.success.main }} />;
      case 'cancelled':
        return <AlertTriangleIcon fontSize="small" sx={{ color: theme.palette.error.main }} />;
      default:
        return <ClockIcon fontSize="small" sx={{ color: theme.palette.primary.main }} />;
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: theme.palette.primary,
      medium: theme.palette.warning,
      high: theme.palette.warning,
      critical: theme.palette.error
    };
    return colors[priority] || colors.medium;
  };

  // Mock data for demo if no tickets provided
  const mockTickets = [
    {
      _id: '1',
      title: 'Server down',
      status: 'new',
      priority: 'critical',
      ticketNumber: 'TKT-001',
      createdAt: new Date(Date.now() - 3600000)
    },
    {
      _id: '2',
      title: 'Network latency',
      status: 'in_progress',
      priority: 'high',
      ticketNumber: 'TKT-002',
      createdAt: new Date(Date.now() - 7200000)
    },
    {
      _id: '3',
      title: 'Update firmware',
      status: 'pending',
      priority: 'medium',
      ticketNumber: 'TKT-003',
      createdAt: new Date(Date.now() - 86400000)
    },
    {
      _id: '4',
      title: 'Replace UPS battery',
      status: 'resolved',
      priority: 'low',
      ticketNumber: 'TKT-004',
      createdAt: new Date(Date.now() - 172800000)
    }
  ];

  const ticketsToShow = tickets.length > 0 ? tickets : mockTickets;

  return (
    <Card elevation={2} sx={{ height: '100%' }}>
      <CardHeader
        title="Recent Tickets"
        action={
          <Link
            to="/tickets"
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
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {ticketsToShow.length === 0 ? (
            <Box
              sx={{
                textAlign: 'center',
                py: 5,
                borderRadius: 2,
                bgcolor: alpha(theme.palette.background.paper, 0.5)
              }}
            >
              <TicketIcon
                sx={{
                  fontSize: 48,
                  color: theme.palette.text.disabled,
                  mb: 1.5
                }}
              />
              <Typography color="text.secondary">No recent tickets</Typography>
            </Box>
          ) : (
            ticketsToShow.map((ticket) => (
              <Card
                key={ticket._id}
                component={Link}
                to={`/tickets/${ticket._id}`}
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
                        bgcolor: alpha(theme.palette.background.paper, 0.7)
                      }}
                    >
                      {getStatusIcon(ticket.status)}
                    </Box>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body1" fontWeight="medium" color="text.primary">
                          {ticket.title}
                        </Typography>
                        <Chip
                          label={ticket.priority}
                          size="small"
                          sx={{
                            ml: 1,
                            bgcolor: alpha(getPriorityColor(ticket.priority).main, 0.1),
                            color: getPriorityColor(ticket.priority).main,
                            fontWeight: 500,
                            fontSize: '0.75rem'
                          }}
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {ticket.ticketNumber} • {formatDate(ticket.createdAt)}
                      </Typography>
                    </Box>
                  </Box>
                  <ChevronRightIcon sx={{ color: theme.palette.text.disabled }} />
                </Box>
              </Card>
            ))
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default RecentTickets;