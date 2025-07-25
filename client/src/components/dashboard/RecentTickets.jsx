import React from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  ChevronRightIcon,
  TicketIcon
} from 'lucide-react';

const RecentTickets = ({ tickets }) => {
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
        return <ClockIcon className="h-4 w-4 text-yellow-500" />;
      case 'resolved':
      case 'closed':
        return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
      case 'cancelled':
        return <AlertTriangleIcon className="h-4 w-4 text-red-500" />;
      default:
        return <ClockIcon className="h-4 w-4 text-blue-500" />;
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'bg-blue-100/80 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
      medium: 'bg-yellow-100/80 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
      high: 'bg-orange-100/80 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300',
      critical: 'bg-red-100/80 text-red-800 dark:bg-red-900/50 dark:text-red-300'
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
    <div className="dashboard-card h-full">
      <div className="dashboard-card-header">
        <h2 className="dashboard-card-title">Recent Tickets</h2>
        <Link
          to="/tickets"
          className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
        >
          View all
        </Link>
      </div>
      <div className="space-y-3 mt-4">
        {ticketsToShow.length === 0 ? (
          <div className="text-center py-10 glass rounded-lg">
            <TicketIcon className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600 mb-3" />
            <p className="text-gray-500 dark:text-gray-400">No recent tickets</p>
          </div>
        ) : (
          ticketsToShow.map((ticket) => (
            <Link
              key={ticket._id}
              to={`/tickets/${ticket._id}`}
              className="block p-4 glass-card hover:bg-white/20 dark:hover:bg-black/20 transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-full bg-white/20 dark:bg-white/10">
                    {getStatusIcon(ticket.status)}
                  </div>
                  <div>
                    <div className="flex items-center">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {ticket.title}
                      </span>
                      <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {ticket.ticketNumber} • {formatDate(ticket.createdAt)}
                    </div>
                  </div>
                </div>
                <ChevronRightIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentTickets;