import React from 'react';
import { BookOpen, Clock, Award, Target } from 'lucide-react';
import StatCard from '../StatCard';

export default function StudentStats() {
  const stats = [
    {
      title: 'Enrolled Courses',
      value: '6',
      icon: <BookOpen className="h-6 w-6 text-primary-600" />,
      change: '2 in progress',
      iconBgColor: 'bg-primary-100 dark:bg-primary-900',
    },
    {
      title: 'Study Hours',
      value: '24h',
      icon: <Clock className="h-6 w-6 text-secondary-600" />,
      change: '+3h this week',
      iconBgColor: 'bg-secondary-100 dark:bg-secondary-900',
    },
    {
      title: 'Current GPA',
      value: '3.8',
      icon: <Award className="h-6 w-6 text-accent-600" />,
      change: '+0.2 from last term',
      iconBgColor: 'bg-accent-100 dark:bg-accent-900',
    },
    {
      title: 'Completion Rate',
      value: '85%',
      icon: <Target className="h-6 w-6 text-success-600" />,
      change: 'On track',
      iconBgColor: 'bg-success-100 dark:bg-success-900',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
}