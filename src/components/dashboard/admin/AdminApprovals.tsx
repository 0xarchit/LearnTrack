import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import Button from '../../ui/Button';

export default function AdminApprovals() {
  const pendingApprovals = [
    {
      id: 1,
      type: 'Course',
      title: 'Advanced Data Science',
      requestedBy: 'Dr. Sarah Johnson',
      department: 'Computer Science',
      status: 'pending',
    },
    {
      id: 2,
      type: 'Faculty',
      title: 'Dr. Michael Chen',
      requestedBy: 'Department Head',
      department: 'Mathematics',
      status: 'pending',
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Pending Approvals</h2>
      <div className="space-y-4">
        {pendingApprovals.map((approval) => (
          <div key={approval.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{approval.type}</span>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mt-1">{approval.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Requested by {approval.requestedBy} • {approval.department}
                </p>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" variant="ghost" className="text-success-600">
                  <CheckCircle size={18} />
                </Button>
                <Button size="sm" variant="ghost" className="text-error-600">
                  <XCircle size={18} />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}