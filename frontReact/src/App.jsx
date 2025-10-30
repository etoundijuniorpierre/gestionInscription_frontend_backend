import React from 'react';
import { Routes, Route, Outlet, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { UserProvider } from './contexts/UserContext';
import AppHeader from './components/layout/AppHeader';
import AppFooter from './components/layout/AppFooter';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import CourseDetail from './pages/CourseDetail';
import PaymentPage from './pages/PaymentPage';
import PaymentSuccess from './pages/PaymentSuccess';
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
import EnrollmentCorrections from './components/studentDashboard/EnrollmentCorrections';
import StudentFAQ from './components/studentDashboard/StudentFAQ';
import StudentHelp from './components/studentDashboard/StudentHelp';
import MyEnrollments from './components/studentDashboard/MyEnrollments';
import MyPayments from './components/studentDashboard/MyPayments';
import StudentEnrollmentDetailsStudent from './components/studentDashboard/StudentEnrollmentDetails';
import StudentCourseDetail from './components/studentDashboard/StudentCourseDetail';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboardLayout from './components/adminDashboard/AdminDashboardLayout';
import AdminStatistics from './components/adminDashboard/AdminStatistics';
import AdminFAQ from './components/adminDashboard/AdminFAQ';
import AdminHelp from './components/adminDashboard/AdminHelp';

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
            <Toaster 
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: '#363636',
                        color: '#fff',
                    },
                    success: {
                        duration: 3000,
                        iconTheme: {
                            primary: '#4ade80',
                            secondary: '#fff',
                        },
                    },
                    error: {
                        duration: 4000,
                        iconTheme: {
                            primary: '#ef4444',
                            secondary: '#fff',
                        },
                    },
                }}
            />
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
                    <Route path="payment/success" element={<PaymentSuccess />} />
                </Route>
                
                {/* Student Dashboard Routes */}
                <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['STUDENT']}><StudentDashboardLayout /></ProtectedRoute>}>
                    <Route index element={<StudentDashboardContent />} />
                    <Route path="courses/:courseName" element={<StudentCourseDetail />} />
                    <Route path="step1" element={<Step1PersonalInfo />} />
                    <Route path="step2" element={<Step2Documents />} />
                    <Route path="step3" element={<Step3AcademicInfo />} />
                    <Route path="step4" element={<Step4ContactInfo />} />
                    <Route path="step5" element={<Step5Summary />} />
                    <Route path="status" element={<EnrollmentStatusPage />} />
                    <Route path="corrections" element={<EnrollmentCorrections />} />
                    <Route path="my-enrollments" element={<MyEnrollments />} />
                    <Route path="my-enrollments/:enrollmentId" element={<StudentEnrollmentDetailsStudent />} />
                    <Route path="my-payments" element={<MyPayments />} />
                    <Route path="messages" element={<StudentHelp />} />
                    <Route path="settings" element={<div>Paramètres pour étudiant</div>} />
                    <Route path="faq" element={<StudentFAQ />} />
                    <Route path="help" element={<StudentHelp />} />
                </Route>
                
                {/* Admin Dashboard Routes */}
                <Route path="/admin-dashboard" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboardLayout /></ProtectedRoute>}>
                    <Route index element={<AdminDashboardContent />} />
                    <Route path="statistics" element={<AdminStatistics />} />
                    <Route path="enrollment-management" element={<StudentEnrollmentManagement onViewDetails={handleViewDetails} />} />
                    <Route path="enrollment-management/:enrollmentId" element={<StudentEnrollmentDetails onBack={handleBack} />} />
                    <Route path="program-management" element={<ProgramManagement />} />
                    <Route path="program-management/add" element={<ProgramForm />} />
                    <Route path="program-management/edit/:id" element={<ProgramForm />} />
                    <Route path="program-management/:programId/modules" element={<ModuleManagement />} />
                    <Route path="user-management" element={<UserManagement />} />
                    <Route path="user-management/add" element={<UserForm />} />
                    {/* Removed the edit route as requested */}
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