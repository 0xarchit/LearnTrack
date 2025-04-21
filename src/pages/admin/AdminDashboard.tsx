import { motion } from 'framer-motion';
import Card from '../../components/ui/Card';
import { Users, BookOpen, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link to="/admin/users">
          <Card className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
            <div className="flex items-center space-x-4">
              <Users size={24} className="text-primary-600" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Manage Users</h3>
            </div>
          </Card>
        </Link>
        <Link to="/admin/courses">
          <Card className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
            <div className="flex items-center space-x-4">
              <BookOpen size={24} className="text-primary-600" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Manage Courses</h3>
            </div>
          </Card>
        </Link>
        <Link to="/admin/reports">
          <Card className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
            <div className="flex items-center space-x-4">
              <BarChart3 size={24} className="text-primary-600" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">View Reports</h3>
            </div>
          </Card>
        </Link>
      </div>

      {/* Add more admin dashboard content here */}
    </motion.div>
  );
};

export default AdminDashboard;