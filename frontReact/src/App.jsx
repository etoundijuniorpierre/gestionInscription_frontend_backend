import React from 'react';
import { Routes, Route, Outlet, useNavigate } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import AppHeader from './components/layout/AppHeader';
import AppFooter from './components/layout/AppFooter';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import StudentDashboardPage from './pages/StudentDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import CourseDetail from './pages/CourseDetail';
import PaymentPage from './pages/PaymentPage';
import ProgramManagement from './components/adminDashboard/ProgramManagement';
import ProgramForm from './components/adminDashboard/ProgramForm';
import ModuleManagement from './components/adminDashboard/ModuleManagement';
import UserManagement from './components/adminDashboard/UserManagement';
import UserForm from './components/adminDashboard/UserForm';
import StudentEnrollmentManagement from './components/adminDashboard/StudentEnrollmentManagement';
import StudentEnrollmentDetails from './components/adminDashboard/StudentEnrollmentDetails';
import AdminDashboardContent from './components/adminDashboard/AdminDashboardContent';
import StudentDashboardContent from './components/studentDashboard/StudentDashboardContent';
import StudentDashboardLayout from './components/studentDashboard/StudentDashboardLayout';
import Step1PersonalInfo from './components/studentDashboard/Step1PersonalInfo';
import Step2Documents from './components/studentDashboard/Step2Documents';
import Step3AcademicInfo from './components/studentDashboard/Step3AcademicInfo';
import Step4ContactInfo from './components/studentDashboard/Step4ContactInfo';
import Step5Summary from './components/studentDashboard/Step5Summary';
import EnrollmentStatusPage from './components/studentDashboard/EnrollmentStatusPage';
import StudentFAQ from './components/studentDashboard/StudentFAQ';
import StudentHelp from './components/studentDashboard/StudentHelp';
import AdminDashboardLayout from './components/adminDashboard/AdminDashboardLayout';
import AdminFAQ from './components/adminDashboard/AdminFAQ';
import AdminHelp from './components/adminDashboard/AdminHelp';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

// This layout component will render the header and a larger footer
const AppLayoutWithLargeFooter = () => (
    <>
        <AppHeader />
        <main className="flex-1 overflow-auto">
            <Outlet />
        </main>
        <AppFooter variant="large" />
    </>
);

// This layout component will render the header and a standard (default) footer
const AppLayoutWithDefaultFooter = () => (
    <>
        <AppHeader />
        <main className="flex-1 overflow-auto">
            <Outlet />
        </main>
        <AppFooter variant="default" />
    </>
);

function App() {
    const navigate = useNavigate();

    const handleViewDetails = (enrollment) => {
        navigate(`/admin-dashboard/enrollment-management/${enrollment.id}`, { state: { enrollment } });
    };

    const handleBack = () => {
        navigate('/admin-dashboard/enrollment-management');
    };

    return (
        <div className="App flex flex-col min-h-screen">
            <Routes>
                {/* Routes with a large footer, only the HomePage in this case */}
                <Route path="/" element={<AppLayoutWithLargeFooter />}>
                    <Route index element={<HomePage />} />
                </Route>

                {/* Routes with a smaller, default footer */}
                <Route path="/" element={<AppLayoutWithDefaultFooter />}>
                    <Route path="register" element={<RegisterPage />} />
                    <Route path="login" element={<LoginPage />} />
                    <Route path="forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="verify-email" element={<VerifyEmailPage />} />
                    <Route path="courses/:courseName" element={<CourseDetail />} />
                    <Route path="payment" element={<PaymentPage />} />
                </Route>
                
                {/* Student Dashboard Routes */}
                <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['STUDENT', 'USER']}><StudentDashboardLayout /></ProtectedRoute>}>
                    <Route index element={<StudentDashboardContent />} />
                    <Route path="step1" element={<Step1PersonalInfo />} />
                    <Route path="step2" element={<Step2Documents />} />
                    <Route path="step3" element={<Step3AcademicInfo />} />
                    <Route path="step4" element={<Step4ContactInfo />} />
                    <Route path="step5" element={<Step5Summary />} />
                    <Route path="status" element={<EnrollmentStatusPage />} />
                    <Route path="messages" element={<div>Messagerie pour étudiant</div>} />
                    <Route path="settings" element={<div>Paramètres pour étudiant</div>} />
                    <Route path="faq" element={<StudentFAQ />} />
                    <Route path="help" element={<StudentHelp />} />
                </Route>
                
                {/* Admin Dashboard Routes */}
                <Route path="/admin-dashboard" element={<ProtectedRoute allowedRoles={['ADMIN', 'ROLE_ADMIN']}><AdminDashboardLayout /></ProtectedRoute>}>
                    <Route index element={<AdminDashboardContent />} />
                    <Route path="enrollment-management" element={<StudentEnrollmentManagement onViewDetails={handleViewDetails} />} />
                    <Route path="enrollment-management/:enrollmentId" element={<StudentEnrollmentDetails onBack={handleBack} />} />
                    <Route path="program-management" element={<ProgramManagement />} />
                    <Route path="program-management/add" element={<ProgramForm />} />
                    <Route path="program-management/edit/:id" element={<ProgramForm />} />
                    <Route path="program-management/:programId/modules" element={<ModuleManagement />} />
                    <Route path="user-management" element={<UserManagement />} />
                    <Route path="user-management/add" element={<UserForm />} />
                    <Route path="user-management/edit/:id" element={<UserForm />} />
                    <Route path="messages" element={<div>Messagerie pour administrateur</div>} />
                    <Route path="settings" element={<div>Paramètres pour administrateur</div>} />
                    <Route path="faq" element={<AdminFAQ />} />
                    <Route path="help" element={<AdminHelp />} />
                </Route>
            </Routes>
        </div>
    );
}

export default App;