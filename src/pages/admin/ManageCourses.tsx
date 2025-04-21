import { motion } from 'framer-motion';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';

const ManageCourses = () => {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/api/courses`)
      .then(res => res.json())
      .then(data => setCourses(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleAddCourse = async () => {
    const title = prompt('Course Title:');
    const instructor = prompt('Instructor:');
    const description = prompt('Description:') || '';
    const status = prompt('Status (pending|approved|rejected):', 'pending');
    const duration = prompt('Duration (e.g., 10h 30m):') || '';
    if (title && instructor && status) {
      const res = await fetch(`${API_URL}/api/courses`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, instructor, description, status, duration })
      });
      if (res.ok) {
        const newCourse = await res.json();
        setCourses(prev => [...prev, newCourse]);
      }
      else alert('Failed to add course');
    }
  };

  const handleEditCourse = async (course: any) => {
    const title = prompt('Course Title:', course.title);
    const instructor = prompt('Instructor:', course.instructor);
    const description = prompt('Description:', course.description || '');
    const status = prompt('Status (pending|approved|rejected):', course.status);
    const duration = prompt('Duration:', course.duration || '') || course.duration;
    if (title && instructor && status) {
      const res = await fetch(`${API_URL}/api/courses/${course.id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, instructor, description, status, duration })
      });
      if (res.ok) {
        const updated = await res.json();
        setCourses(prev => prev.map(c => c.id === updated.id ? updated : c));
      } else alert('Failed to update course');
    }
  };

  const handleDeleteCourse = async (id: number) => {
    if (!confirm('Delete this course?')) return;
    const res = await fetch(`${API_URL}/api/courses/${id}`, { method: 'DELETE' });
    if (res.ok) setCourses(prev => prev.filter(c => c.id !== id));
    else alert('Failed to delete course');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Courses</h1>
        <Button leftIcon={<Plus size={18} />} onClick={handleAddCourse}>Add New Course</Button>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Course Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Instructor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Students</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr><td colSpan={7} className="p-4 text-center">Loading...</td></tr>
              ) : error ? (
                <tr><td colSpan={7} className="p-4 text-center text-red-500">Error: {error}</td></tr>
              ) : (
                courses.map((course) => (
                  <tr key={course.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {course.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {course.instructor}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {course.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {course.duration}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {course.students}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        course.status === 'Active' 
                          ? 'bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-200'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                      }`}>
                        {course.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button variant="ghost" size="sm" className="mr-2" onClick={() => handleEditCourse(course)}>
                        <Edit2 size={16} />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-error-600" onClick={() => handleDeleteCourse(course.id)}>
                        <Trash2 size={16} />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </motion.div>
  );
};

export default ManageCourses;