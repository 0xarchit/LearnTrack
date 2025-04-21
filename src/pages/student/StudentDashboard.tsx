import StudentStats from '../../components/dashboard/student/StudentStats';
import StudentCourseProgress from '../../components/dashboard/student/StudentCourseProgress';
import StudentAssignments from '../../components/dashboard/student/StudentAssignments';
import StudentGrades from '../../components/dashboard/student/StudentGrades';
import StudentMaterials from '../../components/dashboard/student/StudentMaterials';

const StudentDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Student Dashboard</h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">Track your academic progress and assignments</p>
      </div>

      <StudentStats />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <StudentCourseProgress />
        </div>
        <StudentAssignments />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StudentGrades />
        <StudentMaterials />
      </div>
    </div>
  );
};

export default StudentDashboard;