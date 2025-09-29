import React from 'react';
import StudentDashboardLayout from '../components/studentDashboard/StudentDashboardLayout.jsx';
import StudentDashboardContent from '../components/studentDashboard/StudentDashboardContent.jsx';

const StudentDashboardPage = () => {
  return (
    <StudentDashboardLayout>
      <StudentDashboardContent />
    </StudentDashboardLayout>
  );
};

export default StudentDashboardPage;