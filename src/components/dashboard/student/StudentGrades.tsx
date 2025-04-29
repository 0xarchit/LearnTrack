import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import Card from '../../ui/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function StudentGrades() {
  const { user } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      fetch(`${API_URL}/api/assignments`).then(res => res.json()),
      fetch(`${API_URL}/api/enrollments?user_id=${user.id}`).then(res => res.json())
    ])
      .then(async ([assignments, enrolledIds]: [any[], number[]]) => {
        const relevant = assignments.filter(a => enrolledIds.includes(a.course_id));
        const results = await Promise.all(
          relevant.map(async a => {
            const subs = await fetch(`${API_URL}/api/assignments/${a.id}/submissions`).then(r => r.json());
            const my = subs.find((s: any) => s.user_id === user.id);
            return my ? { assignment: a.title, grade: my.grade, max: a.max_score } : null;
          })
        );
        setData(results.filter(Boolean));
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) return <p>Loading grades...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Grade Overview</h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="assignment" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="grade" fill="#3B82F6" name="Your Grade" />
            <Bar dataKey="max" fill="#9CA3AF" name="Max Score" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}