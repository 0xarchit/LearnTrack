import React from 'react';
import { Activity, Server, Users, AlertTriangle } from 'lucide-react';

export default function AdminHealth() {
  const metrics = [
    {
      label: 'System Status',
      value: 'Operational',
      icon: <Server className="h-5 w-5 text-success-500" />,
      status: 'success',
    },
    {
      label: 'Active Users',
      value: '1,234',
      icon: <Users className="h-5 w-5 text-primary-500" />,
      status: 'normal',
    },
    {
      label: 'Response Time',
      value: '124ms',
      icon: <Activity className="h-5 w-5 text-warning-500" />,
      status: 'warning',
    },
    {
      label: 'Error Rate',
      value: '0.02%',
      icon: <AlertTriangle className="h-5 w-5 text-success-500" />,
      status: 'success',
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">System Health</h2>
      <div className="grid grid-cols-2 gap-4">
        {metrics.map((metric, index) => (
          <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {metric.icon}
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{metric.label}</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{metric.value}</p>
                </div>
              </div>
              <div className={`h-2 w-2 rounded-full ${
                metric.status === 'success' ? 'bg-success-500' :
                metric.status === 'warning' ? 'bg-warning-500' :
                'bg-primary-500'
              }`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}