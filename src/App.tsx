import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from './contexts/AuthContext';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Public Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import LandingPage from './pages/LandingPage';

// Protected Pages
import Dashboard from './pages/Dashboard';
import Courses from './pages/courses/Courses';
import CourseDetails from './pages/courses/CourseDetails';
import Assignments from './pages/assignments/Assignments';
import AssignmentDetails from './pages/assignments/AssignmentDetails';
import Materials from './pages/materials/Materials';
import Grades from './pages/grades/Grades';
import Profile from './pages/profile/Profile';
import NotFound from './pages/NotFound';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageCourses from './pages/admin/ManageCourses';
import ManageUsers from './pages/admin/ManageUsers';
import Reports from './pages/admin/Reports';
import ManageNotifications from './pages/admin/ManageNotifications';

// Faculty Pages
import FacultyDashboard from './pages/faculty/FacultyDashboard';
import GradeAssignments from './pages/faculty/GradeAssignments';
import ManageMaterials from './pages/faculty/ManageMaterials';

// Auth Guard
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  const location = useLocation();
  const { isAuthenticated, userRole, initAuth } = useAuth();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>
        
        <Route path="/" element={<LandingPage />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute isAllowed={isAuthenticated} redirectPath="/login" />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:id" element={<CourseDetails />} />
            <Route path="/assignments" element={<Assignments />} />
            <Route path="/assignments/:id" element={<AssignmentDetails />} />
            <Route path="/materials" element={<Materials />} />
            <Route path="/grades" element={<Grades />} />
            <Route path="/profile" element={<Profile />} />
            
            {/* Admin Only Routes */}
            <Route 
              element={<ProtectedRoute isAllowed={userRole === 'admin'} redirectPath="/dashboard" />}
            >
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/courses" element={<ManageCourses />} />
              <Route path="/admin/users" element={<ManageUsers />} />
              <Route path="/admin/reports" element={<Reports />} />
              <Route path="/admin/notifications" element={<ManageNotifications />} />
            </Route>
            
            {/* Faculty Only Routes */}
            <Route 
              element={<ProtectedRoute isAllowed={userRole === 'faculty'} redirectPath="/dashboard" />}
            >
              <Route path="/faculty" element={<FacultyDashboard />} />
              <Route path="/faculty/grade" element={<GradeAssignments />} />
              <Route path="/faculty/materials" element={<ManageMaterials />} />
            </Route>
          </Route>
        </Route>
        
        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}

export default App;