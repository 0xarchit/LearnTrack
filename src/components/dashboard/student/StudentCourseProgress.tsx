import ChartCard from '../ChartCard';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function StudentCourseProgress() {
  const progressData = [
    { week: 'Week 1', progress: 20 },
    { week: 'Week 2', progress: 35 },
    { week: 'Week 3', progress: 45 },
    { week: 'Week 4', progress: 60 },
    { week: 'Week 5', progress: 75 },
    { week: 'Week 6', progress: 85 },
  ];

  return (
    <ChartCard title="Course Progress">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={progressData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="week" />
          <YAxis />
          <Tooltip />
          <Line 
            type="monotone" 
            dataKey="progress" 
            stroke="#3B82F6" 
            strokeWidth={2}
            dot={{ fill: '#3B82F6', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}