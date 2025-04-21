import React from 'react';
import StatCard from '../StatCard';
import { Users, BookOpen, Award, TrendingUp } from 'lucide-react';

const AdminStats = () => {
  const stats = [
    { title: 'Total Users', value: '1,234', icon: <Users />, change: '+12%' },
    { title: 'Active Courses', value: '56', icon: <BookOpen />, change: '+5%' },
    { title: 'Completion Rate', value: '89%', icon: <Award />, change: '+3%' },
    { title: 'Student Growth', value: '23%', icon: <TrendingUp />, change: '+7%' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default AdminStats;