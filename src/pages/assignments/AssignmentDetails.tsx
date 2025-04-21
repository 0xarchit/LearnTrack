import React from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { FileText, Calendar, Clock, Upload, Download } from 'lucide-react';

const AssignmentDetails = () => {
  const { id } = useParams();

  // Mock assignment data
  const assignment = {
    id,
    title: 'JavaScript Fundamentals Assignment',
    course: 'Web Development Basics',
    dueDate: '2025-04-15',
    timeLimit: '2 hours',
    maxScore: 100,
    status: 'In Progress',
    description: 'Complete the following exercises to demonstrate your understanding of JavaScript fundamentals including variables, functions, and basic DOM manipulation.',
    requirements: [
      'Implement all required functions in the starter code',
      'Write clear comments explaining your code',
      'Ensure all tests pass',
      'Submit both source code and documentation',
    ],
    attachments: [
      { name: 'starter-code.zip', size: '1.2 MB' },
      { name: 'assignment-guide.pdf', size: '450 KB' },
    ],
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{assignment.title}</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">{assignment.course}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Assignment Description</h2>
              <p className="text-gray-700 dark:text-gray-300">{assignment.description}</p>
              
              <h3 className="text-md font-semibold text-gray-900 dark:text-white mt-6 mb-3">Requirements:</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                {assignment.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Your Submission</h2>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8">
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <Button leftIcon={<Upload size={18} />}>
                      Upload Files
                    </Button>
                  </div>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Drag and drop files here or click to browse
                  </p>
                </div>
              </div>
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
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{assignment.dueDate}</p>
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
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{assignment.maxScore} points</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Resources</h2>
              <div className="space-y-3">
                {assignment.attachments.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{file.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{file.size}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default AssignmentDetails;