import React from 'react';
import AdminStats from './AdminStats';
import AdminAnalytics from './AdminAnalytics';
import AdminActivities from './AdminActivities';
import AdminApprovals from './AdminApprovals';
import AdminHealth from './AdminHealth';

const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      <AdminStats />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AdminAnalytics />
        </div>
        <AdminActivities />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdminApprovals />
        <AdminHealth />
      </div>
    </div>
  );
};

export default AdminDashboard;