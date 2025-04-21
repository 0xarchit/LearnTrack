import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ChartCard from '../ChartCard';

export default function AdminAnalytics() {
  const data = [
    { name: 'Jan', students: 400, courses: 24 },
    { name: 'Feb', students: 450, courses: 28 },
    { name: 'Mar', students: 480, courses: 30 },
    { name: 'Apr', students: 520, courses: 32 },
    { name: 'May', students: 550, courses: 35 },
    { name: 'Jun', students: 590, courses: 38 },
  ];

  return (
    <ChartCard title="Platform Growth">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Bar yAxisId="left" dataKey="students" fill="#3B82F6" name="Students" />
          <Bar yAxisId="right" dataKey="courses" fill="#10B981" name="Courses" />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}