import { TrendingUp } from 'lucide-react';

export default function FacultyPerformance() {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center gap-3 mb-4">
        <TrendingUp className="w-6 h-6 text-green-600" />
        <h2 className="text-xl font-semibold text-gray-800">Performance Metrics</h2>
      </div>
      <div className="grid gap-4">
        <div className="p-4 bg-green-50 rounded-md">
          <p className="text-sm text-gray-600">Average Response Time</p>
          <p className="text-2xl font-bold text-green-700">24h</p>
        </div>
        <div className="p-4 bg-blue-50 rounded-md">
          <p className="text-sm text-gray-600">Student Satisfaction</p>
          <p className="text-2xl font-bold text-blue-700">4.8/5.0</p>
        </div>
      </div>
    </div>
  );
}