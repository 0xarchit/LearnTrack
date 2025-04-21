import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Plus, Edit2, Trash2 } from 'lucide-react';

const ManageNotifications = () => {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const [notifs, setNotifs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifs = () => {
    setLoading(true);
    fetch(`${API_URL}/api/notifications/all`)
      .then(res => res.json())
      .then(data => setNotifs(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchNotifs();
  }, []);

  const handleAdd = async () => {
    const message = prompt('Notification message:');
    if (!message) return;
    const type = prompt('Type (success|error|warning|info):', 'info');
    const target = prompt('Target role (student|faculty|admin|all):', 'all');
    const res = await fetch(`${API_URL}/api/notifications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, type, target_role: target })
    });
    if (res.ok) fetchNotifs(); else alert('Failed to add');
  };

  const handleEdit = async (id: number, current: any) => {
    const message = prompt('Notification message:', current.message);
    if (message == null) return;
    const type = prompt('Type:', current.type);
    if (type == null) return;
    const target = prompt('Target role:', current.target_role);
    if (target == null) return;
    const res = await fetch(`${API_URL}/api/notifications/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, type, target_role: target })
    });
    if (res.ok) fetchNotifs(); else alert('Failed to update');
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this notification?')) return;
    const res = await fetch(`${API_URL}/api/notifications/${id}`, { method: 'DELETE' });
    if (res.ok) setNotifs(prev => prev.filter(n => n.id !== id)); else alert('Failed to delete');
  };

  if (loading) return <p>Loading notifications...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Notifications</h1>
        <Button leftIcon={<Plus size={18} />} onClick={handleAdd}>Add Notification</Button>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Message</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Target</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {notifs.map(n => (
                <tr key={n.id}>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{n.message}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{n.type}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{n.target_role}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{new Date(n.created_at).toLocaleString()}</td>
                  <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
                    <Button variant="ghost" size="sm" className="mr-2" onClick={() => handleEdit(n.id, n)}>
                      <Edit2 size={16} />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-error-600" onClick={() => handleDelete(n.id)}>
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

export default ManageNotifications;
