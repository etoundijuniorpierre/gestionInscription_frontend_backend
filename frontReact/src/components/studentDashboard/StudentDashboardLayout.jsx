import React from 'react';
import StudentDashboardSidebar from './StudentDashboardSidebar';
import DashboardHeader from '../dashboard/DashboardHeader';
import { Outlet } from 'react-router-dom';

const StudentDashboardLayout = () => {
    return (
        <div className="flex h-screen bg-gray-100">
            <StudentDashboardSidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <DashboardHeader />
                <main className="flex-1 overflow-y-auto p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default StudentDashboardLayout;