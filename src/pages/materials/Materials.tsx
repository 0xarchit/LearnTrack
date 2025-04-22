import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { FileText, Video, Download, Search, Filter, Grid, List } from 'lucide-react';

const Materials = () => {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [materials, setMaterials] = useState<any[]>([]);
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

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         material.course.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || material.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    loading ? (
      <p>Loading materials...</p>
    ) : error ? (
      <p className="text-red-500">Error: {error}</p>
    ) : (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Study Materials</h1>
            <p className="mt-1 text-gray-600 dark:text-gray-400">Access your course materials and resources</p>
          </div>
          
          <div className="flex items-center space-x-4">
                <button
                  title='Grid View'
              onClick={() => setView('grid')}
              className={`p-2 rounded-lg ${
                view === 'grid' 
                  ? 'bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-400' 
                  : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
              }`}
            >
              <Grid size={20} />
            </button>
                <button
                  title='List View'
              onClick={() => setView('list')}
              className={`p-2 rounded-lg ${
                view === 'list' 
                  ? 'bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-400' 
                  : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
              }`}
            >
              <List size={20} />
            </button>
          </div>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search materials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
          
          <div className="flex space-x-2">
            <Button
              variant={selectedType === 'all' ? 'primary' : 'outline'}
              onClick={() => setSelectedType('all')}
              leftIcon={<Filter size={18} />}
            >
              All
            </Button>
            <Button
              variant={selectedType === 'pdf' ? 'primary' : 'outline'}
              onClick={() => setSelectedType('pdf')}
              leftIcon={<FileText size={18} />}
            >
              Documents
            </Button>
            <Button
              variant={selectedType === 'video' ? 'primary' : 'outline'}
              onClick={() => setSelectedType('video')}
              leftIcon={<Video size={18} />}
            >
              Videos
            </Button>
          </div>
        </div>

        {view === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMaterials.map((material) => (
              <Card key={material.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
                <div className="h-40 overflow-hidden flex items-center justify-center bg-gray-50 dark:bg-gray-800">
                  <FileText size={48} className="text-gray-400" />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{material.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{material.course}</p>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center">
                      {material.type === 'pdf' ? (
                        <FileText className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Video className="h-5 w-5 text-gray-400" />
                      )}
                      <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">{material.size}</span>
                    </div>
                    <a href={material.url} target="_blank" rel="noopener noreferrer" download title='download'>
                      <Button variant="ghost" size="sm">
                        <Download size={18} />
                      </Button>
                    </a>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Course</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Size</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Last Updated</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredMaterials.map((material) => (
                    <tr key={material.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {material.type === 'pdf' ? (
                            <FileText className="h-5 w-5 text-gray-400" />
                          ) : (
                            <Video className="h-5 w-5 text-gray-400" />
                          )}
                          <span className="ml-2 text-sm font-medium text-gray-900 dark:text-white">
                            {material.title}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {material.course}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          material.type === 'pdf'
                            ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200'
                            : 'bg-secondary-100 text-secondary-800 dark:bg-secondary-900 dark:text-secondary-200'
                        }`}>
                          {material.type.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {material.size}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {material.lastUpdated}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <a href={material.url} target="_blank" rel="noopener noreferrer" download title='download'>
                          <Button variant="ghost" size="sm">
                            <Download size={16} />
                          </Button>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </motion.div>
    )
  );
};

export default Materials;