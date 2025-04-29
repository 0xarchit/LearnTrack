import { motion } from 'framer-motion';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import Input from '../../components/ui/Input';

const ManageCourses = () => {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [faculties, setFaculties] = useState<any[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCourse, setNewCourse] = useState({ title: '', instructor_id: '', description: '', status: 'pending', duration: '', thumbnail: null as File | null });
  const [editCourseId, setEditCourseId] = useState<number | null>(null);
  const [editCourseData, setEditCourseData] = useState({ title: '', instructor_id: '', description: '', status: 'pending', duration: '', thumbnail: null as File | null });

  useEffect(() => {
    fetch(`${API_URL}/api/courses`)
      .then(res => res.json())
      .then(data => setCourses(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/api/users`)
      .then(res => res.json())
      .then(users => setFaculties(users.filter((u: any) => u.role === 'faculty')))
      .catch(() => {});
  }, []);

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    const { title, instructor_id, description, status, duration, thumbnail } = newCourse;
    const formData = new FormData();
    formData.append('title', title);
    formData.append('instructor_id', instructor_id);
    formData.append('description', description);
    formData.append('status', status);
    formData.append('duration', duration);
    if (thumbnail) formData.append('thumbnail', thumbnail);
    try {
      const res = await fetch(`${API_URL}/api/courses`, {
        method: 'POST',
        body: formData
      });
      if (!res.ok) throw new Error('Failed to add course');
      const created = await res.json();
      setCourses(prev => [...prev, created]);
      setShowAddForm(false);
      setNewCourse({ title: '', instructor_id: '', description: '', status: 'pending', duration: '', thumbnail: null });
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleEditCourse = (course: any) => {
    setEditCourseId(course.id);
    setEditCourseData({
      title: course.title,
      instructor_id: course.instructor_id.toString(),
      description: course.description || '',
      status: course.status,
      duration: course.duration,
      thumbnail: null
    });
  };

  const handleUpdateCourse = async (e: React.FormEvent) => {
    if (editCourseId === null) return;
    e.preventDefault();
    const { title, instructor_id, description, status, duration, thumbnail } = editCourseData;
    const formData = new FormData();
    formData.append('title', title);
    formData.append('instructor_id', instructor_id);
    formData.append('description', description);
    formData.append('status', status);
    formData.append('duration', duration);
    if (thumbnail) formData.append('thumbnail', thumbnail);
    try {
      const res = await fetch(`${API_URL}/api/courses/${editCourseId}`, {
        method: 'PUT',
        body: formData
      });
      if (!res.ok) throw new Error('Failed to update course');
      const updated = await res.json();
      setCourses(prev => prev.map(c => c.id === updated.id ? updated : c));
      setEditCourseId(null);
    } catch (err: any) {
      alert(err.message);
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
        <Button leftIcon={<Plus size={18} />} onClick={() => setShowAddForm(prev => !prev)}>
          {showAddForm ? 'Cancel' : 'Add New Course'}
        </Button>
      </div>
      {showAddForm && (
        <form onSubmit={handleCreateCourse} className="mb-6 space-y-4 p-4 bg-white dark:bg-gray-800 rounded">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              required
              placeholder="Course Title"
              value={newCourse.title}
              onChange={e => setNewCourse({ ...newCourse, title: e.target.value })}
            />
            <select title='id' required value={newCourse.instructor_id}
              onChange={e => setNewCourse({ ...newCourse, instructor_id: e.target.value })}
              className="block w-full rounded-md bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 p-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
              <option value="" disabled>Select Instructor</option>
              {faculties.map(f => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
            <Input
              placeholder="Description"
              value={newCourse.description}
              onChange={e => setNewCourse({ ...newCourse, description: e.target.value })}
            />
            <Input
              placeholder="Duration (e.g., 10h 30m)"
              value={newCourse.duration}
              onChange={e => setNewCourse({ ...newCourse, duration: e.target.value })}
            />
            <select value={newCourse.status}
              title='Select Status'
              onChange={e => setNewCourse({ ...newCourse, status: e.target.value })}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded">
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <input
              title='Upload Thumbnail'
              type="file"
              accept="image/*"
              onChange={e => setNewCourse({ ...newCourse, thumbnail: e.target.files?.[0] || null })}
              className="block w-full rounded-md bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 p-2"
            />
          </div>
          <Button type="submit">Save Course</Button>
        </form>
      )}

      {editCourseId !== null && (
        <form onSubmit={handleUpdateCourse} className="mb-6 space-y-4 p-4 bg-white dark:bg-gray-800 rounded">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Edit Course</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              required
              placeholder="Course Title"
              value={editCourseData.title}
              onChange={e => setEditCourseData({ ...editCourseData, title: e.target.value })}
            />
            <select title='id' required value={editCourseData.instructor_id}
              onChange={e => setEditCourseData({ ...editCourseData, instructor_id: e.target.value })}
              className="block w-full rounded-md bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 p-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
              <option value="" disabled>Select Instructor</option>
              {faculties.map(f => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
            <Input
              placeholder="Description"
              value={editCourseData.description}
              onChange={e => setEditCourseData({ ...editCourseData, description: e.target.value })}
            />
            <Input
              placeholder="Duration"
              value={editCourseData.duration}
              onChange={e => setEditCourseData({ ...editCourseData, duration: e.target.value })}
            />
            <select title='Course Status' value={editCourseData.status}
              onChange={e => setEditCourseData({ ...editCourseData, status: e.target.value })}
              className="block w-full rounded-md bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 p-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <input title='thumbnail' type="file" accept="image/*"
              onChange={e => setEditCourseData({ ...editCourseData, thumbnail: e.target.files?.[0] || null })}
              className="block w-full rounded-md bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 p-2"
            />
          </div>
          <div className="flex space-x-2">
            <Button type="submit">Update Course</Button>
            <Button variant="ghost" onClick={() => setEditCourseId(null)}>Cancel</Button>
          </div>
        </form>
      )}

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Thumbnail</th>
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
                <tr><td colSpan={8} className="p-4 text-center">Loading...</td></tr>
              ) : error ? (
                <tr><td colSpan={8} className="p-4 text-center text-red-500">Error: {error}</td></tr>
              ) : (
                courses.map((course) => (
                  <tr key={course.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {course.thumbnail_url ? (
                        <img src={`${API_URL}${course.thumbnail_url}`} alt={course.title} className="h-12 w-12 object-cover rounded" />
                      ) : <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded" />}
                    </td>
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