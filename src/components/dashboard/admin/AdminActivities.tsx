import React from 'react';
import { Activity, User, BookOpen } from 'lucide-react';

export default function AdminActivities() {
  const activities = [
    {
      user: 'Dr. Sarah Johnson',
      action: 'Created new course',
      target: 'Advanced Machine Learning',
      time: '2 hours ago',
      icon: <BookOpen className="h-5 w-5 text-blue-500" />,
    },
    {
      user: 'Prof. Michael Chen',
      action: 'Updated course materials',
      target: 'Database Systems',
      time: '4 hours ago',
      icon: <Activity className="h-5 w-5 text-green-500" />,
    },
    {
      user: 'Admin',
      action: 'Approved new faculty',
      target: 'Dr. Emily Rodriguez',
      time: '6 hours ago',
      icon: <User className="h-5 w-5 text-purple-500" />,
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activities</h2>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="p-2 bg-white dark:bg-gray-600 rounded-full">
              {activity.icon}
            </div>
            <div>
              <p className="text-sm text-gray-900 dark:text-white">
                <span className="font-medium">{activity.user}</span> {activity.action}
                <span className="font-medium"> {activity.target}</span>
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}