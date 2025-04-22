import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import AdminDashboard from './admin/AdminDashboard';
import FacultyDashboard from './faculty/FacultyDashboard';
import StudentDashboard from './student/StudentDashboard';

const Dashboard = () => {
  const { userRole, isAuthenticated, user } = useAuth();

  useEffect(() => {
    console.log('Current user:', user);
    console.log('Current user role:', userRole);
  }, [user, userRole]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const getDashboardComponent = () => {
    console.log('Getting dashboard for role:', userRole);
    
    switch (userRole) {
      case 'admin':
        return <AdminDashboard />;
      case 'faculty':
        return <FacultyDashboard />;
      case 'student':
        return <StudentDashboard />;
      default:
        console.log('No matching role found, defaulting to login');
        return <Navigate to="/login" replace />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {getDashboardComponent()}
    </motion.div>
  );
};

export default Dashboard;