import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { 
  Menu, 
  X, 
  Home, 
  BookOpen, 
  FileText, 
  BookMarked, 
  BarChart3, 
  User,
  Sun, 
  Moon,
  ChevronDown,
  Bell,
  Users,
  CheckCircle,
  Plus
} from 'lucide-react';

const MainLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { user, logout, userRole } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<any[]>([]);
  
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Sidebar links vary by role
  let navigationLinks: { name: string; to: string; icon: JSX.Element }[] = [];
  if (userRole === 'admin') {
    navigationLinks = [
      { name: 'Admin Dashboard', to: '/admin', icon: <User size={20} /> },
      { name: 'Manage Courses', to: '/admin/courses', icon: <BookOpen size={20} /> },
      { name: 'Manage Users', to: '/admin/users', icon: <Users size={20} /> },
      { name: 'Reports', to: '/admin/reports', icon: <BarChart3 size={20} /> },
      { name: 'Notifications', to: '/admin/notifications', icon: <Bell size={20} /> },
    ];
  } else if (userRole === 'faculty') {
    navigationLinks = [
      { name: 'Faculty Panel', to: '/faculty', icon: <User size={20} /> },
      { name: 'Grade Assignments', to: '/faculty/grade', icon: <CheckCircle size={20} /> },
      { name: 'Manage Materials', to: '/faculty/materials', icon: <FileText size={20} /> },
      { name: 'New Assignment', to: '/faculty/new-assignment', icon: <Plus size={20} /> },
      { name: 'Notifications', to: '/faculty/notifications', icon: <Bell size={20} /> },
    ];
  } else {
    // Student links
    navigationLinks = [
      { name: 'Dashboard', to: '/dashboard', icon: <Home size={20} /> },
      { name: 'Courses', to: '/courses', icon: <BookOpen size={20} /> },
      { name: 'Assignments', to: '/assignments', icon: <FileText size={20} /> },
      { name: 'Study Materials', to: '/materials', icon: <BookMarked size={20} /> },
      { name: 'Grades', to: '/grades', icon: <BarChart3 size={20} /> },
    ];
  }

  // fetch notifications for this userRole
  useEffect(() => {
    fetch(`${API_URL}/api/notifications?target_role=${userRole}`)
      .then(res => res.json())
      .then(data => setNotifications(data))
      .catch(() => {});
  }, [userRole]);

  // delete notification handler
  const handleDeleteNotification = async (id: number) => {
    const res = await fetch(`${API_URL}/api/notifications/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setNotifications(prev => prev.filter(n => n.id !== id));
    } else {
      alert('Failed to delete notification');
    }
  };

  const handleSendNotification = async () => {
    const message = prompt('Notification message:');
    if (!message) return;
    const type = prompt('Type (success|error|warning|info):', 'info');
    const target = prompt('Target role (student|faculty|admin|all):', 'student');
    const res = await fetch(`${API_URL}/api/notifications`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, type, target_role: target })
    });
    if (res.ok) {
      // refresh notifications
      fetch(`${API_URL}/api/notifications?target_role=${userRole}`)
        .then(r => r.json()).then(data => setNotifications(data)).catch(() => {});
    } else {
      alert('Failed to send notification');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          {/* Logo and mobile menu button */}
          <div className="flex items-center">
            <button
              aria-label="Toggle sidebar"
              onClick={toggleSidebar}
              className="inline-flex mr-4 lg:hidden text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              <Menu size={24} />
            </button>
            <div className="flex items-center space-x-2">
              <div className="bg-primary-500 rounded-lg p-1.5">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-primary-600 dark:text-primary-400">LearnTrack</span>
            </div>
          </div>

          {/* Right side: notifications, theme toggle, profile */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative sm:relative">
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="p-2 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700"
              >
                <Bell size={20} />
                <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-error-500 text-xs text-white flex items-center justify-center">
                  {notifications.length}
                </span>
              </button>
              
              <AnimatePresence>
                {isNotificationsOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="fixed sm:absolute left-4 right-4 sm:left-auto sm:right-0 top-16 sm:top-full mt-2 w-auto sm:w-[280px] md:w-[350px] lg:w-[400px] bg-white dark:bg-gray-800 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-50 overflow-hidden"
                  >
                    <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                      <h3 className="text-sm font-medium">Notifications</h3>
                      {(userRole === 'admin' || userRole === 'faculty') && (
                        <button onClick={handleSendNotification} className="text-xs text-primary-600 hover:underline">
                          Send Notification
                        </button>
                      )}
                    </div>
                    <div className="max-h-[50vh] overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                          No notifications
                        </div>
                      ) : (
                        notifications.map((n) => (
                          <div key={n.id} className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-700 last:border-none flex justify-between items-start">
                            <div className="flex-1 pr-2">
                              <div className="text-sm text-gray-800 dark:text-gray-200 break-words">{n.message}</div>
                              <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">{new Date(n.created_at).toLocaleString()}</div>
                            </div>
                            {(userRole === 'admin' || userRole === 'faculty') && (
                              <button 
                                aria-label="Delete notification"
                                className="text-gray-400 hover:text-red-600 ml-4 flex-shrink-0"
                                onClick={() => handleDeleteNotification(n.id)}
                              >
                                <X size={16} />
                              </button>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            {/* Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center space-x-2 focus:outline-none"
              >
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                    {user?.avatar ? (
                      <img src={user.avatar} alt="Profile" className="h-full w-full object-cover" />
                    ) : (
                      <User className="h-full w-full p-1 text-gray-500 dark:text-gray-400" />
                    )}
                  </div>
                  <span className="hidden md:block text-sm font-medium">{user?.name}</span>
                  <ChevronDown size={16} className="text-gray-500 dark:text-gray-400" />
                </div>
              </button>
              
              <AnimatePresence>
                {isProfileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-dropdown ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                  >
                    <div className="py-1">
                      <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                        Signed in as <span className="font-medium">{user?.email}</span>
                      </div>
                      <NavLink 
                        to="/profile" 
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        Your Profile
                      </NavLink>
                      <div className="border-t border-gray-200 dark:border-gray-700"></div>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-error-600 dark:text-error-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Sign out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar for larger screens */}
        <aside className="hidden lg:block w-64 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <nav className="py-4 px-2">
            <div className="space-y-1 px-2">
              {navigationLinks.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.to}
                  className={({ isActive }) => `
                    flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                    ${isActive 
                      ? 'bg-primary-50 text-primary-600 dark:bg-gray-700 dark:text-primary-400' 
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                    }
                  `}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </NavLink>
              ))}
            </div>
          </nav>
        </aside>

        {/* Mobile sidebar */}
        <AnimatePresence>
          {isSidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-40 bg-black lg:hidden"
                onClick={closeSidebar}
              ></motion.div>
              
              <motion.aside
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 lg:hidden overflow-y-auto"
              >
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-2">
                    <div className="bg-primary-500 rounded-lg p-1.5">
                      <BookOpen className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-xl font-bold text-primary-600 dark:text-primary-400">LearnTrack</span>
                  </div>
                  <button
                    aria-label="Close sidebar"
                    onClick={closeSidebar}
                    className="p-2 rounded-md text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <nav className="py-4 px-2">
                  <div className="space-y-1 px-2">
                    {navigationLinks.map((item) => (
                      <NavLink
                        key={item.name}
                        to={item.to}
                        onClick={closeSidebar}
                        className={({ isActive }) => `
                          flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                          ${isActive 
                            ? 'bg-primary-50 text-primary-600 dark:bg-gray-700 dark:text-primary-400' 
                            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                          }
                        `}
                      >
                        <span className="mr-3">{item.icon}</span>
                        {item.name}
                      </NavLink>
                    ))}
                  </div>
                </nav>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;