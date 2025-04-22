import { motion } from 'framer-motion';
import Card from '../../components/ui/Card';
import { Users, BookOpen, FileText, Clock, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const FacultyDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<{ title: string; value: string; icon: JSX.Element }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, assignmentsRes, materialsRes] = await Promise.all([
          fetch(`${API_URL}/api/courses`),
          fetch(`${API_URL}/api/assignments`),
          fetch(`${API_URL}/api/materials`),
        ]);
        const [courses, assignments, materials] = await Promise.all([
          coursesRes.json(),
          assignmentsRes.json(),
          materialsRes.json(),
        ]);
        // filter courses taught by this faculty
        const facultyCourses = courses.filter((c: any) => c.instructor === user?.name);
        const courseIds = facultyCourses.map((c: any) => c.id);
        // compute stats
        const totalStudents = facultyCourses.reduce((sum: number, c: any) => sum + (c.students || 0), 0);
        const activeCourses = facultyCourses.length;
        const assignmentsCount = assignments.filter((a: any) => courseIds.includes(a.course_id)).length;
        const materialsCount = materials.filter((m: any) => courseIds.includes(m.course_id)).length;
        setStats([
          { title: 'Total Students', value: totalStudents.toString(), icon: <Users /> },
          { title: 'Active Courses', value: activeCourses.toString(), icon: <BookOpen /> },
          { title: 'Assignments', value: assignmentsCount.toString(), icon: <Clock /> },
          { title: 'Materials', value: materialsCount.toString(), icon: <FileText /> },
        ]);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Faculty Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => (
          <Card key={idx} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</h3>
              </div>
              <div className="p-3 bg-primary-100 dark:bg-primary-900 rounded-full">
                {stat.icon}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Add more faculty dashboard content here */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/faculty/grade">
          <Card className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
            <div className="flex items-center space-x-4">
              <CheckCircle size={24} className="text-success-600" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Grade Assignments</h3>
            </div>
          </Card>
        </Link>
        <Link to="/faculty/materials">
          <Card className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
            <div className="flex items-center space-x-4">
              <FileText size={24} className="text-primary-600" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Manage Materials</h3>
            </div>
          </Card>
        </Link>
      </div>
    </motion.div>
  );
};

export default FacultyDashboard;