import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { FileText, Calendar, Clock, Upload } from 'lucide-react';
import { useState, useEffect, FormEvent } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const AssignmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const [assignment, setAssignment] = useState<any | null>(null);
  const { user } = useAuth();
  const [courseTitle, setCourseTitle] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loadingSubs, setLoadingSubs] = useState(true);
  const [subError, setSubError] = useState<string | null>(null);
  const [newFile, setNewFile] = useState<File | null>(null);
  const [newDescription, setNewDescription] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`${API_URL}/api/assignments/${id}`);
        if (!res.ok) throw new Error('Failed to fetch assignment');
        const data = await res.json();
        setAssignment(data);
        // fetch course title
        const courseRes = await fetch(`${API_URL}/api/courses/${data.course_id}`);
        if (courseRes.ok) {
          const courseData = await courseRes.json();
          setCourseTitle(courseData.title);
        }
        // fetch submissions for this assignment
        setLoadingSubs(true);
        const subRes = await fetch(`${API_URL}/api/assignments/${id}/submissions`);
        if (!subRes.ok) throw new Error('Failed to fetch submissions');
        const allSubs = await subRes.json();
        // filter to current user
        setSubmissions(user ? allSubs.filter((s:any) => s.user_id === user.id) : []);
      } catch (err: any) {
        setError(err.message);
        setSubError(err.message);
      } finally {
        setLoading(false);
        setLoadingSubs(false);
      }
    }
    fetchData();
  }, [id, user]);

  // handle submission
  const handleSubmission = async (e: FormEvent) => {
    e.preventDefault();
    if (!newFile && !newDescription.trim()) {
      setSubmitError('Please provide a file or description');
      return;
    }
    setSubmitting(true);
    setSubmitError(null);
    const formData = new FormData();
    formData.append('user_id', String(user?.id));
    if (newDescription.trim()) formData.append('description', newDescription);
    if (newFile) formData.append('file', newFile);
    try {
      const res = await fetch(`${API_URL}/api/assignments/${id}/submissions`, {
        method: 'POST',
        body: formData
      });
      if (!res.ok) {
        const err = await res.json(); throw new Error(err.detail || 'Submission failed');
      }
      const sub = await res.json();
      setSubmissions([sub]);
      navigate('/dashboard');
    } catch (err: any) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p>Loading assignment...</p>;
  if (error || !assignment) return <p className="text-red-500">Error: {error}</p>;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{assignment.title}</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">{courseTitle || `Course ID: ${assignment.course_id}`}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Assignment Description</h2>
              <p className="text-gray-700 dark:text-gray-300">{assignment.description}</p>
              
              <h3 className="text-md font-semibold text-gray-900 dark:text-white mt-6 mb-3">Requirements:</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                {(assignment.requirements || []).map((req: string, index: number) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Your Submission</h2>
              {loadingSubs ? (
                <p>Loading submissions...</p>
              ) : subError ? (
                <p className="text-red-500">Error: {subError}</p>
              ) : submissions.length > 0 ? (
                submissions.map(sub => (
                  <div key={sub.id} className="space-y-2">
                    <a href={sub.file_url} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
                      View your submission
                    </a>
                    <p className="text-sm text-gray-500">Submitted at: {new Date(sub.submitted_at).toLocaleString()}</p>
                    {sub.grade !== null && <p className="text-sm font-medium">Grade: {sub.grade}</p>}
                  </div>
                ))
              ) : (
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8">
                  <form onSubmit={handleSubmission} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description (optional)</label>
                            <textarea
                              title='desc'
                        value={newDescription}
                        onChange={e => setNewDescription(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-2"
                        rows={3}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">File (optional)</label>
                            <input
                        title='file'
                        type="file"
                        accept="*"
                        onChange={e => setNewFile(e.target.files?.[0] || null)}
                        className="mt-1 block w-full text-gray-900 dark:text-gray-100"
                      />
                    </div>
                    {submitError && <p className="text-red-500">{submitError}</p>}
                    <Button type="submit" disabled={submitting} isLoading={submitting} leftIcon={<Upload size={18} />}>Submit</Button>
                  </form>
                </div>
              )}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Assignment Details</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Due Date</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {new Date(assignment.due_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Time Limit</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{assignment.timeLimit}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Max Score</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{assignment.max_score ?? assignment.maxScore ?? 'N/A'} points</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Additional details or resources can be added here */}
        </div>
      </div>
    </motion.div>
  );
};

export default AssignmentDetails;