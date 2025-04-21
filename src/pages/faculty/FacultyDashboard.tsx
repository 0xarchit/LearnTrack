import { motion } from 'framer-motion';
import Card from '../../components/ui/Card';
import { Users, BookOpen, Clock, CheckCircle } from 'lucide-react';

const FacultyDashboard = () => {
  const stats = [
    { title: 'Total Students', value: '156', icon: <Users />, change: '+12 this week' },
    { title: 'Active Courses', value: '4', icon: <BookOpen />, change: 'All running' },
    { title: 'Hours Taught', value: '24', icon: <Clock />, change: 'This week' },
    { title: 'Assignments Graded', value: '45', icon: <CheckCircle />, change: '12 pending' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Faculty Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{stat.change}</p>
              </div>
              <div className="p-3 bg-primary-100 dark:bg-primary-900 rounded-full">
                {stat.icon}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Add more faculty dashboard content here */}
    </motion.div>
  );
};

export default FacultyDashboard;