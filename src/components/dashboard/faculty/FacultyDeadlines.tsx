import { Calendar } from 'lucide-react';

export default function FacultyDeadlines() {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center gap-3 mb-4">
        <Calendar className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-800">Upcoming Deadlines</h2>
      </div>
      <div className="space-y-4">
        <div className="p-4 border border-gray-200 rounded-md">
          <p className="font-medium text-gray-800">Assignment Reviews Due</p>
          <p className="text-sm text-gray-600">Due in 2 days</p>
        </div>
        <div className="p-4 border border-gray-200 rounded-md">
          <p className="font-medium text-gray-800">Grade Submission Deadline</p>
          <p className="text-sm text-gray-600">Due in 5 days</p>
        </div>
      </div>
    </div>
  );
}