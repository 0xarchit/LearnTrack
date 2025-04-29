import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

const Grades = () => {
  const { user } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const [gradesData, setGradesData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      fetch(`${API_URL}/api/assignments`).then(r => r.json()),
      fetch(`${API_URL}/api/enrollments?user_id=${user.id}`).then(r => r.json())
    ])
      .then(async ([assignments, enrolledIds]: [any[], number[]]) => {
        const myAssignments = assignments.filter(a => enrolledIds.includes(a.course_id));
        const results = await Promise.all(
          myAssignments.map(async a => {
            const subs = await fetch(`${API_URL}/api/assignments/${a.id}/submissions`).then(r => r.json());
            const me = subs.find((s: any) => s.user_id === user.id);
            return me ? { title: a.title, grade: me.grade, max: a.max_score } : null;
          })
        );
        setGradesData(results.filter(Boolean));
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) return <p>Loading grades...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Academic Performance</h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">Track your grades and academic progress</p>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Assignment Grades</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Assignment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Grade</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Max Score</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {gradesData.map((g, idx) => (
                <tr key={idx}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{g.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{g.grade}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{g.max}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed report not available for assignment-level grades */}
    </motion.div>
  );
};

export default Grades;