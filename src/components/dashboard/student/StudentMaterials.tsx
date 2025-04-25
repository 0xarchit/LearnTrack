import { useState, useEffect } from 'react';
import Card from '../../ui/Card';
import { FileText, Download } from 'lucide-react';
import Button from '../../ui/Button';
import { useAuth } from '../../../contexts/AuthContext';

export default function StudentMaterials() {
  const { user } = useAuth();
  const [materials, setMaterials] = useState<any[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetch(`${API_URL}/api/materials`)
      .then(res => res.json())
      .then(data => setMaterials(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!user) return;
    fetch(`${API_URL}/api/enrollments?user_id=${user.id}`)
      .then(res => res.json())
      .then((ids: number[]) => setEnrolledCourses(ids))
      .catch(() => {});
  }, [user]);

  if (loading) return <p>Loading materials...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  const filteredMaterials = materials.filter(m => enrolledCourses.includes(m.course_id));

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Materials</h2>
      <div className="space-y-4">
        {filteredMaterials.map(material => (
          <div
            key={material.id}
            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
          >
            <div className="flex items-center">
              <FileText className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">{material.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{material.type}</p>
              </div>
            </div>
            <a href={`${API_URL}${material.url}`} title = 'download' download target='_blank'>
              <Button variant="ghost" size="sm">
                <Download size={16} />
              </Button>
            </a>
          </div>
        ))}
      </div>
    </Card>
  );
}