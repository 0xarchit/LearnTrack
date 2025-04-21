import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const AuthLayout: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col md:flex-row">
      {/* Left pane: Background image and branding */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="md:w-1/2 bg-gradient-to-br from-primary-600 to-primary-900 p-8 md:p-12"
      >
        <div className="h-full flex flex-col">
          <div className="flex items-center space-x-2">
            <div className="bg-white rounded-lg p-1.5">
              <BookOpen className="h-6 w-6 text-primary-600" />
            </div>
            <span className="text-xl font-bold text-white">LearnTrack</span>
          </div>
          
          <div className="flex-1 flex flex-col justify-center items-center text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white max-w-md leading-tight">
              The ultimate learning experience
            </h1>
            <p className="mt-6 text-primary-100 max-w-sm text-lg">
              Track your academic journey, access materials, and collaborate with peers and faculty in one place.
            </p>
            
            <div className="mt-12 grid grid-cols-2 gap-6 w-full max-w-md">
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-lg">
                <div className="text-3xl font-bold text-white">100+</div>
                <div className="text-sm text-primary-100 mt-1">Online Courses</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-lg">
                <div className="text-3xl font-bold text-white">10k+</div>
                <div className="text-sm text-primary-100 mt-1">Happy Students</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-lg">
                <div className="text-3xl font-bold text-white">250+</div>
                <div className="text-sm text-primary-100 mt-1">Expert Instructors</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-lg">
                <div className="text-3xl font-bold text-white">95%</div>
                <div className="text-sm text-primary-100 mt-1">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Right pane: Auth forms */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="md:w-1/2 flex flex-col items-center justify-center p-8 md:p-12"
      >
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </motion.div>
    </div>
  );
};

export default AuthLayout;