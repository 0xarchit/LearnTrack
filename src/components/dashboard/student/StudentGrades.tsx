import React from 'react';
import Card from '../../ui/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function StudentGrades() {
  const gradeData = [
    { course: 'Web Dev', grade: 92, average: 85 },
    { course: 'Database', grade: 88, average: 82 },
    { course: 'Mobile Dev', grade: 95, average: 88 },
    { course: 'AI Basics', grade: 85, average: 80 },
  ];

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Grade Overview</h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={gradeData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="course" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="grade" fill="#3B82F6" name="Your Grade" />
            <Bar dataKey="average" fill="#9CA3AF" name="Class Average" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}