import React from 'react';

const TicketChart = ({ tickets }) => {
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
      new: 'rgba(59, 130, 246, 0.9)', // blue
      assigned: 'rgba(139, 92, 246, 0.9)', // purple
      in_progress: 'rgba(245, 158, 11, 0.9)', // amber
      pending: 'rgba(249, 115, 22, 0.9)', // orange
      resolved: 'rgba(16, 185, 129, 0.9)', // green
      closed: 'rgba(107, 114, 128, 0.9)', // gray
      cancelled: 'rgba(239, 68, 68, 0.9)' // red
    };
    return colors[status] || colors.new;
  };
  
  const getPriorityColor = (priority) => {
    const colors = {
      low: 'rgba(59, 130, 246, 0.9)', // blue
      medium: 'rgba(245, 158, 11, 0.9)', // amber
      high: 'rgba(249, 115, 22, 0.9)', // orange
      critical: 'rgba(239, 68, 68, 0.9)' // red
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
    <div className="dashboard-card h-full">
      <div className="dashboard-card-header">
        <h2 className="dashboard-card-title">Ticket Overview</h2>
      </div>
      <div className="space-y-6 mt-4">
        {/* Status Distribution */}
        <div>
          <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Status Distribution</h4>
          <div className="h-5 w-full glass rounded-full overflow-hidden">
            {Object.entries(effectiveStatusCounts).map(([status, count], index) => {
              const width = (count / totalTickets) * 100;
              return (
                <div
                  key={status}
                  className="h-full float-left"
                  style={{
                    width: `${width}%`,
                    background: `linear-gradient(to right, ${getStatusColor(status)}, ${getStatusColor(status)}cc)`
                  }}
                  title={`${statusLabels[status]}: ${count} (${width.toFixed(1)}%)`}
                />
              );
            })}
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3">
            {Object.entries(effectiveStatusCounts).map(([status, count]) => (
              <div key={status} className="flex items-center">
                <div
                  className="w-3 h-3 rounded-full mr-1"
                  style={{ backgroundColor: getStatusColor(status) }}
                />
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  {statusLabels[status]}: {count}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Priority Distribution */}
        <div>
          <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Priority Distribution</h4>
          <div className="grid grid-cols-4 gap-2">
            {Object.entries(effectivePriorityCounts).map(([priority, count]) => {
              const percentage = (count / totalTickets) * 100;
              return (
                <div key={priority} className="flex flex-col items-center">
                  <div className="w-full glass rounded-full h-24 relative overflow-hidden">
                    <div
                      className="absolute bottom-0 w-full"
                      style={{
                        height: `${percentage}%`,
                        background: `linear-gradient(to top, ${getPriorityColor(priority)}, ${getPriorityColor(priority)}80)`
                      }}
                    />
                  </div>
                  <span className="text-xs font-medium mt-1 text-gray-700 dark:text-gray-300">
                    {priorityLabels[priority]}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {count} ({percentage.toFixed(1)}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Weekly Trend */}
        <div>
          <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Weekly Trend</h4>
          <div className="glass rounded-lg p-4">
            <div className="flex items-end h-32 space-x-2">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
                // Generate random heights for demo
                const height = Math.floor(Math.random() * 70) + 10;
                return (
                  <div key={day} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full rounded-t-sm bg-gradient-to-t from-blue-500/80 to-blue-400/50"
                      style={{ height: `${height}%` }}
                    ></div>
                    <span className="text-xs mt-1 text-gray-500 dark:text-gray-400">{day}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketChart;