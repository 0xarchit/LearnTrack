import { Box as InBox } from 'lucide-react';

export default function FacultySubmissions() {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center gap-3 mb-4">
        <InBox className="w-6 h-6 text-orange-600" />
        <h2 className="text-xl font-semibold text-gray-800">Recent Submissions</h2>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-orange-50 rounded-md">
          <div>
            <p className="font-medium text-gray-800">Final Project</p>
            <p className="text-sm text-gray-600">Web Development - CS301</p>
          </div>
          <span className="px-3 py-1 text-sm bg-orange-100 text-orange-700 rounded-full">
            5 new
          </span>
        </div>
        <div className="flex items-center justify-between p-3 bg-orange-50 rounded-md">
          <div>
            <p className="font-medium text-gray-800">Midterm Essay</p>
            <p className="text-sm text-gray-600">Database Systems - CS401</p>
          </div>
          <span className="px-3 py-1 text-sm bg-orange-100 text-orange-700 rounded-full">
            3 new
          </span>
        </div>
      </div>
    </div>
  );
}