import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import Card from '../../ui/Card';
import Button from '../../ui/Button';

export default function StudentAssignments() {
  const assignments = [
    {
      id: 1,
      title: 'JavaScript Fundamentals',
      course: 'Web Development',
      dueDate: '2025-04-15',
      timeLeft: '2 days',
      status: 'pending'
    },
    {
      id: 2,
      title: 'Database Design',
      course: 'Database Systems',
      dueDate: '2025-04-18',
      timeLeft: '5 days',
      status: 'pending'
    },
    {
      id: 3,
      title: 'React Components',
      course: 'Frontend Development',
      dueDate: '2025-04-20',
      timeLeft: '7 days',
      status: 'pending'
    }
  ];

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Upcoming Assignments</h2>
      <div className="space-y-4">
        {assignments.map((assignment) => (
          <div 
            key={assignment.id}
            className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
          >
            <h3 className="font-medium text-gray-900 dark:text-white">{assignment.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{assignment.course}</p>
            
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-gray-500 dark:text-gray-400">
                  <Calendar size={16} className="mr-1" />
                  <span className="text-sm">{assignment.dueDate}</span>
                </div>
                <div className="flex items-center text-gray-500 dark:text-gray-400">
                  <Clock size={16} className="mr-1" />
                  <span className="text-sm">{assignment.timeLeft}</span>
                </div>
              </div>
              <Button size="sm">View</Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}