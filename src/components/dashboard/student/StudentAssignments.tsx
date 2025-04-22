import { Calendar, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import ProgressBar from '../ProgressBar';

export default function StudentAssignments() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<any[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completedIds, setCompletedIds] = useState<number[]>([]);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/api/assignments`).then(res => res.json()),
      user ? fetch(`${API_URL}/api/enrollments?user_id=${user.id}`).then(res => res.json()) : Promise.resolve([])
    ])
      .then(([all, enrolled]: [any[], number[]]) => {
        setAssignments(all);
        setEnrolledCourses(enrolled);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [user]);

  // detect completed assignments by checking submissions
  useEffect(() => {
    if (!user) return;
    const relevant = assignments.filter(a => enrolledCourses.includes(a.course_id));
    Promise.all(
      relevant.map(a =>
        fetch(`${API_URL}/api/assignments/${a.id}/submissions`)
          .then(res => res.json())
          .then((subs: any[]) => (subs.some(s => s.user_id === user.id) ? a.id : null))
      )
    ).then(results => setCompletedIds(results.filter(id => id !== null) as number[]));
  }, [assignments, enrolledCourses, user]);

  if (loading) return <p>Loading assignments...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  const now = new Date();
  const computeTimeLeft = (due: string) => {
    const diff = new Date(due).getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? `${days} days` : 'Due';
  };

  const filtered = assignments.filter(a => enrolledCourses.includes(a.course_id));

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Upcoming Assignments</h2>
      <div className="space-y-4">
        {filtered.map((assignment) => {
          const isCompleted = completedIds.includes(assignment.id);
          const progressVal = isCompleted ? 100 : 0;
          return (
          <div key={assignment.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="font-medium text-gray-900 dark:text-white">{assignment.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Course ID: {assignment.course_id}</p>
            {/* hide due info if assignment completed */}
            {!isCompleted && (
            <div className="mt-2 flex items-center space-x-4">
              <div className="flex items-center text-gray-500 dark:text-gray-400">
                <Calendar size={16} className="mr-1" />
                <span className="text-sm">Due: {new Date(assignment.due_date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center text-gray-500 dark:text-gray-400">
                <Clock size={16} className="mr-1" />
                <span className="text-sm">{computeTimeLeft(assignment.due_date)}</span>
              </div>
            </div>
            )}

            {/* progress bar */}
            <div className="mt-4">
              <ProgressBar progress={progressVal} />
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {isCompleted ? 'Completed' : 'Pending'}
              </p>
            </div>

            <div className="mt-4">
              <Link to={`/assignments/${assignment.id}`}>
                <Button size="sm">View</Button>
              </Link>
            </div>
          </div>
        )})}
      </div>
    </Card>
  );
}