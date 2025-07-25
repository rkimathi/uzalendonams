import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ClockIcon, 
  UserIcon, 
  CalendarIcon, 
  ServerIcon,
  MessageSquareIcon,
  ChevronRightIcon
} from 'lucide-react';

const TicketCard = ({ ticket, getPriorityColor, getStatusColor }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffDay > 0) {
      return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
    } else if (diffHour > 0) {
      return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
    } else if (diffMin > 0) {
      return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  return (
    <Link 
      to={`/tickets/${ticket._id}`}
      className="block bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
    >
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center mb-1">
              <span className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                {ticket.ticketNumber}
              </span>
              <span className="mx-2 text-gray-300 dark:text-gray-600">•</span>
              <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${getPriorityColor(ticket.priority)}`}>
                {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
              </span>
              <span className="mx-2 text-gray-300 dark:text-gray-600">•</span>
              <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${getStatusColor(ticket.status)}`}>
                {ticket.status.replace('_', ' ').charAt(0).toUpperCase() + ticket.status.replace('_', ' ').slice(1)}
              </span>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {ticket.title}
            </h3>
            
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
              {ticket.description}
            </p>
            
            <div className="flex flex-wrap gap-y-2 gap-x-4 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center">
                <CalendarIcon className="h-3.5 w-3.5 mr-1" />
                <span>Created {getTimeAgo(ticket.createdAt)}</span>
              </div>
              
              {ticket.assignedTo ? (
                <div className="flex items-center">
                  <UserIcon className="h-3.5 w-3.5 mr-1" />
                  <span>Assigned to {ticket.assignedTo.name}</span>
                </div>
              ) : (
                <div className="flex items-center">
                  <UserIcon className="h-3.5 w-3.5 mr-1" />
                  <span>Unassigned</span>
                </div>
              )}
              
              {ticket.device && (
                <div className="flex items-center">
                  <ServerIcon className="h-3.5 w-3.5 mr-1" />
                  <span>{ticket.device.name}</span>
                </div>
              )}
              
              <div className="flex items-center">
                <MessageSquareIcon className="h-3.5 w-3.5 mr-1" />
                <span>{ticket.comments?.length || 0} comments</span>
              </div>
              
              {ticket.updatedAt && (
                <div className="flex items-center">
                  <ClockIcon className="h-3.5 w-3.5 mr-1" />
                  <span>Updated {getTimeAgo(ticket.updatedAt)}</span>
                </div>
              )}
            </div>
          </div>
          
          <ChevronRightIcon className="h-5 w-5 text-gray-400 dark:text-gray-600 flex-shrink-0 ml-4" />
        </div>
      </div>
    </Link>
  );
};

export default TicketCard;