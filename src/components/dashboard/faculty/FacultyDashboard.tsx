import React from 'react';
import FacultyStats from './FacultyStats';
import FacultyCourseProgress from './FacultyCourseProgress';
import FacultySubmissions from './FacultySubmissions';
import FacultyPerformance from './FacultyPerformance';
import FacultyDeadlines from './FacultyDeadlines';

const FacultyDashboard = () => {
  return (
    <div className="space-y-6">
      <FacultyStats />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <FacultyCourseProgress />
        </div>
        <FacultySubmissions />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FacultyPerformance />
        <FacultyDeadlines />
      </div>
    </div>
  );
};

export default FacultyDashboard;