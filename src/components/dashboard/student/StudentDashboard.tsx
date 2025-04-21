import React from 'react';
import StudentStats from './StudentStats';
import StudentCourseProgress from './StudentCourseProgress';
import StudentAssignments from './StudentAssignments';
import StudentGrades from './StudentGrades';
import StudentMaterials from './StudentMaterials';

const StudentDashboard = () => {
  return (
    <div className="space-y-6">
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