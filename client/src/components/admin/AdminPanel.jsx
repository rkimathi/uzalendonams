import React from 'react';
import { CogIcon, UsersIcon, DatabaseIcon } from 'lucide-react';

const AdminPanel = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <p className="text-gray-600">
          Manage system settings, users, and database
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <UsersIcon className="h-6 w-6 text-blue-500 mr-2" />
              <h2 className="text-xl font-semibold">User Management</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Manage users, roles, and permissions
            </p>
            <ul className="list-disc pl-5 text-sm text-gray-600">
              <li>Create and manage user accounts</li>
              <li>Assign roles and permissions</li>
              <li>View user activity logs</li>
            </ul>
          </div>

          <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <CogIcon className="h-6 w-6 text-green-500 mr-2" />
              <h2 className="text-xl font-semibold">System Settings</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Configure system-wide settings
            </p>
            <ul className="list-disc pl-5 text-sm text-gray-600">
              <li>Email and notification settings</li>
              <li>Security and authentication</li>
              <li>API integrations</li>
            </ul>
          </div>

          <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <DatabaseIcon className="h-6 w-6 text-purple-500 mr-2" />
              <h2 className="text-xl font-semibold">Database</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Database management tools
            </p>
            <ul className="list-disc pl-5 text-sm text-gray-600">
              <li>Backup and restore</li>
              <li>Data import/export</li>
              <li>Performance monitoring</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;