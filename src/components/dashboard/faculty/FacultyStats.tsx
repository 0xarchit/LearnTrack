import { BarChart3 } from 'lucide-react';

export default function FacultyStats() {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center gap-3 mb-4">
        <BarChart3 className="w-6 h-6 text-purple-600" />
        <h2 className="text-xl font-semibold text-gray-800">Teaching Statistics</h2>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-purple-50 rounded-md">
          <p className="text-sm text-gray-600">Active Courses</p>
          <p className="text-2xl font-bold text-purple-700">4</p>
        </div>
        <div className="p-4 bg-indigo-50 rounded-md">
          <p className="text-sm text-gray-600">Total Students</p>
          <p className="text-2xl font-bold text-indigo-700">120</p>
        </div>
      </div>
    </div>
  );
}