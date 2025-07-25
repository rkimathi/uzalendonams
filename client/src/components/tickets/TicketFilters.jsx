import React from 'react';
import { XIcon } from 'lucide-react';

const TicketFilters = ({ filters, setFilters, onClearFilters }) => {
  const statusOptions = [
    { value: 'new', label: 'New' },
    { value: 'assigned', label: 'Assigned' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'pending', label: 'Pending' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'closed', label: 'Closed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'critical', label: 'Critical' }
  ];

  const typeOptions = [
    { value: 'incident', label: 'Incident' },
    { value: 'problem', label: 'Problem' },
    { value: 'request', label: 'Request' },
    { value: 'change', label: 'Change' },
    { value: 'maintenance', label: 'Maintenance' }
  ];

  const handleStatusChange = (status) => {
    if (filters.status.includes(status)) {
      setFilters({
        ...filters,
        status: filters.status.filter(s => s !== status)
      });
    } else {
      setFilters({
        ...filters,
        status: [...filters.status, status]
      });
    }
  };

  const handlePriorityChange = (priority) => {
    if (filters.priority.includes(priority)) {
      setFilters({
        ...filters,
        priority: filters.priority.filter(p => p !== priority)
      });
    } else {
      setFilters({
        ...filters,
        priority: [...filters.priority, priority]
      });
    }
  };

  const handleTypeChange = (type) => {
    if (filters.type.includes(type)) {
      setFilters({
        ...filters,
        type: filters.type.filter(t => t !== type)
      });
    } else {
      setFilters({
        ...filters,
        type: [...filters.type, type]
      });
    }
  };

  const handleAssignedToChange = (value) => {
    setFilters({
      ...filters,
      assignedTo: value
    });
  };

  const hasActiveFilters = () => {
    return (
      filters.status.length > 0 ||
      filters.priority.length > 0 ||
      filters.type.length > 0 ||
      filters.assignedTo !== ''
    );
  };

  return (
    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Filters</h3>
        {hasActiveFilters() && (
          <button
            onClick={onClearFilters}
            className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
          >
            <XIcon className="h-4 w-4 mr-1" />
            Clear all filters
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Status Filter */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</h4>
          <div className="space-y-2">
            {statusOptions.map(option => (
              <label key={option.value} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.status.includes(option.value)}
                  onChange={() => handleStatusChange(option.value)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Priority Filter */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Priority</h4>
          <div className="space-y-2">
            {priorityOptions.map(option => (
              <label key={option.value} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.priority.includes(option.value)}
                  onChange={() => handlePriorityChange(option.value)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Type Filter */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Type</h4>
          <div className="space-y-2">
            {typeOptions.map(option => (
              <label key={option.value} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.type.includes(option.value)}
                  onChange={() => handleTypeChange(option.value)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Assigned To Filter */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Assigned To</h4>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                checked={filters.assignedTo === ''}
                onChange={() => handleAssignedToChange('')}
                className="rounded-full border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Anyone</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                checked={filters.assignedTo === 'me'}
                onChange={() => handleAssignedToChange('me')}
                className="rounded-full border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Assigned to me</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                checked={filters.assignedTo === 'unassigned'}
                onChange={() => handleAssignedToChange('unassigned')}
                className="rounded-full border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Unassigned</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketFilters;