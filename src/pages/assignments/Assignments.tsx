import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { FileText, Calendar, Clock, ChevronRight, Filter } from 'lucide-react';

const Assignments = () => {
  const [filter, setFilter] = useState('all');
  const [assignments, setAssignments] = useState<any[]>([]);
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

  const filteredAssignments = assignments.filter(assignment => {
    if (filter === 'all') return true;
    return assignment.status === filter;
  });

  return (
    loading ? (
      <p>Loading assignments...</p>
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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Assignments</h1>
            <p className="mt-1 text-gray-600 dark:text-gray-400">Track and manage your course assignments</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              leftIcon={<Filter size={18} />}
              onClick={() => setFilter('all')}
              className={filter === 'all' ? 'bg-primary-50 text-primary-600 border-primary-200' : ''}
            >
              All
            </Button>
            <Button
              variant="outline"
              onClick={() => setFilter('pending')}
              className={filter === 'pending' ? 'bg-warning-50 text-warning-600 border-warning-200' : ''}
            >
              Pending
            </Button>
            <Button
              variant="outline"
              onClick={() => setFilter('in-progress')}
              className={filter === 'in-progress' ? 'bg-primary-50 text-primary-600 border-primary-200' : ''}
            >
              In Progress
            </Button>
            <Button
              variant="outline"
              onClick={() => setFilter('completed')}
              className={filter === 'completed' ? 'bg-success-50 text-success-600 border-success-200' : ''}
            >
              Completed
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {filteredAssignments.map((assignment) => (
            <Card key={assignment.id} className="hover:shadow-lg transition-shadow duration-200">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg">
                      <FileText className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {assignment.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{assignment.course}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    assignment.status === 'completed' ? 'bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-200' :
                    assignment.status === 'in-progress' ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200' :
                    'bg-warning-100 text-warning-800 dark:bg-warning-900 dark:text-warning-200'
                  }`}>
                    {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Due: {assignment.dueDate}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Time: {assignment.timeLimit}</span>
                  </div>
                </div>

                {assignment.status !== 'completed' && (
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 dark:text-gray-400">Progress</span>
                      <span className="text-gray-900 dark:text-white font-medium">{assignment.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                      <div 
                        className={`bg-primary-600 h-2 rounded-full transition-all duration-300 ${assignment.progress === 0 ? 'w-0' : assignment.progress === 100 ? 'w-full' : `w-[${assignment.progress}%]`}`}
                      ></div>
                    </div>
                  </div>
                )}

                <div className="mt-6 flex justify-end">
                  <Link to={`/assignments/${assignment.id}`}>
                    <Button rightIcon={<ChevronRight size={18} />}>
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </motion.div>
    )
  );
};

export default Assignments;