import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Search, Users, Clock, ChevronRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Courses = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [courses, setCourses] = useState<any[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetch(`${API_URL}/api/courses`)
      .then(res => res.json())
      .then(data => setCourses(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // fetch user enrollments
  useEffect(() => {
    if (!user) return;
    fetch(`${API_URL}/api/enrollments?user_id=${user.id}`)
      .then(res => res.json())
      .then((ids: number[]) => setEnrolledCourses(ids))
      .catch(() => {});
  }, [user]);

  const handleEnroll = async (courseId: number) => {
    if (!user) return;
    await fetch(`${API_URL}/api/enroll`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: user.id, course_id: courseId })
    });
    setEnrolledCourses(prev => [...prev, courseId]);
  };

  const handleUnenroll = async (courseId: number) => {
    if (!user) return;
    await fetch(`${API_URL}/api/enroll`, {
      method: 'DELETE', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: user.id, course_id: courseId })
    });
    setEnrolledCourses(prev => prev.filter(id => id !== courseId));
  };

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.instructor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Courses</h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">Continue learning from where you left off</p>
        </div>
        
        <div className="relative">
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
      </div>

      {loading ? (
        <p>Loading courses...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map(course => (
            <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
              <div className="h-48 overflow-hidden">
                {course.thumbnail_url ? (
                  <img
                    src={course.thumbnail_url}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 dark:bg-gray-700" />
                )}
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{course.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{course.instructor}</p>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{course.students} students</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{course.duration}</span>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-2">
                  {!enrolledCourses.includes(course.id) ? (
                    <Button onClick={() => handleEnroll(course.id)} variant="primary">
                      Enroll
                    </Button>
                  ) : (
                    <>
                      <Link to={`/courses/${course.id}`}>  
                        <Button rightIcon={<ChevronRight size={18} />} variant="outline">
                          Continue
                        </Button>
                      </Link>
                      <Button onClick={() => handleUnenroll(course.id)} variant="ghost" className="text-error-600">
                        Unenroll
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default Courses;