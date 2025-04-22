import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Card from '../../components/ui/Card';

export default function GradeAssignments() {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<number | null>(null);
  const [loadingSubs, setLoadingSubs] = useState(false);
  const [subError, setSubError] = useState<string | null>(null);
  const [grading, setGrading] = useState<{[key:number]: string}>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetch(`${API_URL}/api/assignments`)
      .then(res => res.json())
      .then(data => setAssignments(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);
  
  if (loading) return <p>Loading assignments...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  const handleViewSubmissions = (assignmentId: number) => {
    if (selectedAssignmentId === assignmentId) {
      setSelectedAssignmentId(null);
      return;
    }
    setLoadingSubs(true);
    setSelectedAssignmentId(assignmentId);
    fetch(`${API_URL}/api/assignments/${assignmentId}/submissions`)
      .then(res => res.json())
      .then(data => setSubmissions(data))
      .catch(err => setSubError(err.message))
      .finally(() => setLoadingSubs(false));
  };

  const handleGrade = (submissionId: number) => {
    const gradeValue = grading[submissionId];
    fetch(`${API_URL}/api/submissions/${submissionId}/grade?grade=${gradeValue}`, {
      method: 'PUT'
    })
      .then(res => res.json())
      .then(data => {
        setSubmissions(submissions.map(s => s.id === submissionId ? { ...s, grade: data.grade } : s));
        setGrading(prev => ({ ...prev, [submissionId]: '' }));
      })
      .catch(err => setSubError(err.message));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Grade Assignments</h1>

      <Card className="overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Course ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Due Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {assignments.map((assignment) => (
                <tr key={assignment.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{assignment.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{assignment.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{assignment.course_id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{new Date(assignment.due_date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    <button onClick={() => handleViewSubmissions(assignment.id)} className="text-primary-600 hover:underline">
                      {selectedAssignmentId === assignment.id ? 'Hide Submissions' : 'View Submissions'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      {/* Submissions and grading */}
      {selectedAssignmentId && (
        <Card>
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Submissions for Assignment {selectedAssignmentId}</h2>
            {loadingSubs ? <p>Loading...</p> : subError ? <p className="text-red-500">{subError}</p> : (
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Submitted At</th>
                    <th className="px-4 py-2 text-left">File</th>
                    <th className="px-4 py-2 text-left">Grade</th>
                    <th className="px-4 py-2 text-left">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {submissions.map(s => (
                    <tr key={s.id}>
                      <td className="px-4 py-2">{s.user_name}</td>
                      <td className="px-4 py-2">{new Date(s.submitted_at).toLocaleString()}</td>
                      <td className="px-4 py-2">
                        <a href={s.file_url} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">Download</a>
                      </td>
                      <td className="px-4 py-2">
                        <input title='grade' type="number" min="0" max="100" value={grading[s.id] || s.grade || ''}
                          onChange={e => setGrading({...grading, [s.id]: e.target.value})}
                          className="w-16 p-1 border rounded" />
                      </td>
                      <td className="px-4 py-2">
                        <button onClick={() => handleGrade(s.id)} className="text-success-600 hover:underline">Save</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </Card>
      )}
    </motion.div>
  );
}