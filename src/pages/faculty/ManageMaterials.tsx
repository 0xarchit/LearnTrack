import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Plus, Trash2 } from 'lucide-react';

const ManageMaterials = () => {
  const [materials, setMaterials] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [newMaterial, setNewMaterial] = useState<{ title: string; course_id: string; type: string; file: File | null }>({ title: '', course_id: '', type: '', file: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // fetch available courses for dropdown
  useEffect(() => {
    fetch(`${API_URL}/api/courses`)
      .then(res => res.json())
      .then(data => setCourses(data))
      .catch(() => {});
  }, []);

  const fetchMaterials = () => {
    setLoading(true);
    fetch(`${API_URL}/api/materials`)
      .then(res => res.json())
      .then(data => setMaterials(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMaterial.file) return alert('Please select a file');
    const formData = new FormData();
    formData.append('title', newMaterial.title);
    formData.append('course_id', newMaterial.course_id);
    formData.append('type', newMaterial.type);
    formData.append('file', newMaterial.file);
    try {
      const res = await fetch(`${API_URL}/api/materials`, {
        method: 'POST',
        body: formData
      });
      if (!res.ok) throw new Error('Create failed');
      await fetchMaterials();
      setShowUploadForm(false);
      setNewMaterial({ title: '', course_id: '', type: '', file: null });
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this material?')) return;
    try {
      const res = await fetch(`${API_URL}/api/materials/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      fetchMaterials();
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) return <p>Loading materials...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Materials</h1>
        <Button leftIcon={<Plus size={18} />} onClick={() => setShowUploadForm(prev => !prev)}>
          {showUploadForm ? 'Cancel' : 'Upload Material'}
        </Button>
      </div>

      {showUploadForm && (
        <form onSubmit={handleCreate} className="mb-6 space-y-4 p-4 bg-white dark:bg-gray-800 rounded">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              required
              placeholder="Title"
              value={newMaterial.title}
              onChange={e => setNewMaterial({ ...newMaterial, title: e.target.value })}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded"
            />
            <select
              title='Select Course'
              required
              value={newMaterial.course_id}
              onChange={e => setNewMaterial({ ...newMaterial, course_id: e.target.value })}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded"
            >
              <option value="" disabled>Select Course</option>
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
            <select
              title='Select Type'
              required
              value={newMaterial.type}
              onChange={e => setNewMaterial({ ...newMaterial, type: e.target.value })}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded"
            >
              <option value="" disabled>Select Type</option>
              <option value="pdf">PDF</option>
              <option value="jpg">JPG</option>
              <option value="docx">DOCX</option>
            </select>
            <input
              title='Select File'
              required
              type="file"
              accept="application/pdf,image/jpeg,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={e => setNewMaterial({ ...newMaterial, file: e.target.files?.[0] || null })}
              className="w-full p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded"
            />
          </div>
          <Button type="submit">Submit</Button>
        </form>
      )}

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">URL</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {materials.map((mat) => (
                <tr key={mat.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{mat.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{mat.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 dark:text-blue-400">
                    <a href={mat.url} target="_blank" rel="noopener noreferrer">Download</a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button variant="ghost" size="sm" className="text-error-600" onClick={() => handleDelete(mat.id)}>
                      <Trash2 size={16} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </motion.div>
  );
};

export default ManageMaterials;