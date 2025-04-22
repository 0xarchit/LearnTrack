import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const NewAssignment = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const [courses, setCourses] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [courseId, setCourseId] = useState<number | ''>('');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/api/courses`)
      .then(res => res.json())
      .then(data => setCourses(data.filter((c: any) => c.instructor_id === user?.id)))
      .catch(err => setError(err.message));
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !courseId || !dueDate) return setError('Please fill required fields');
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/assignments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, course_id: courseId, due_date: dueDate })
      });
      if (!res.ok) throw new Error('Failed to create assignment');
      navigate('/faculty');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">New Assignment</h1>
      <Card className="p-6 mb-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title *</label>
                      <input
                          title='Title'
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              className="block w-full rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 p-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Course *</label>
                      <select
                          title='Course'
              value={courseId}
              onChange={e => setCourseId(Number(e.target.value))}
              required
              className="block w-full rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 p-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="" disabled>Select course</option>
              {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
                      <textarea
                title='Description'
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="block w-full rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 p-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Due Date *</label>
                      <input
                title='Due Date'
              type="date"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              required
              className="block w-full rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 p-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <Button type="submit" disabled={loading}>{loading ? 'Submitting...' : 'Create Assignment'}</Button>
        </form>
      </Card>
    </motion.div>
  );
};

export default NewAssignment;