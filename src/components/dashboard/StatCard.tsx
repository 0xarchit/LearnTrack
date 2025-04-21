import React from 'react';
import Card from '../ui/Card';

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  icon: React.ReactNode;
  iconBgColor?: string;
  changeColor?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  icon,
  iconBgColor = 'bg-primary-100 dark:bg-primary-900',
  changeColor = 'text-success-600'
}) => {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</h3>
          {change && <p className={`text-sm ${changeColor} mt-1`}>{change}</p>}
        </div>
        <div className={`p-3 rounded-full ${iconBgColor}`}>
          {icon}
        </div>
      </div>
    </Card>
  );
};

export default StatCard;