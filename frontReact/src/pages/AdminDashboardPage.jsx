import React from 'react';
import AdminDashboardLayout from '../components/adminDashboard/AdminDashboardLayout';
import AdminDashboardContent from '../components/adminDashboard/AdminDashboardContent';

const AdminDashboardPage = () => {
    return (
        <AdminDashboardLayout>
            <AdminDashboardContent />
        </AdminDashboardLayout>
    );
};

export default AdminDashboardPage;