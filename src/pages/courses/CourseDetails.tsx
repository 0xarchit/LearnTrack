import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Card from '../../components/ui/Card';

const CourseDetails = () => {
  const { id } = useParams();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetch(`${API_URL}/api/courses/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Course not found');
        return res.json();
      })
      .then(data => setCourse(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Loading course details...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="mb-6">
        <div className="w-full h-48 md:h-64 lg:h-80 rounded-lg overflow-hidden mb-6">
          {course.thumbnail_url ? (
            <img 
              src={`${API_URL}${course.thumbnail_url}`} 
              alt={course.title} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 dark:bg-gray-700" />
          )}
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{course.title}</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Instructor: {course.instructor}</p>
      </div>
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Course Description</h2>
        <p className="text-gray-700 dark:text-gray-300">{course.description}</p>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Duration: {course.duration}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400">Students Enrolled: {course.students}</p>
        <p className="mt-4 text-sm font-medium text-gray-500 dark:text-gray-400">Status: {course.status}</p>
      </Card>
    </motion.div>
  );
}

export default CourseDetails;