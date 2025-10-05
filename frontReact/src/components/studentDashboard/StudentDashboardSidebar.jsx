// src/components/studentDashboard/StudentDashboardSidebar.jsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const StudentDashboardSidebar = () => {
    const navigate = useNavigate();

    const studentNavItems = [
        { name: 'Tableau de bord', icon: '/assets/svg/dashboard-icon.svg', path: '/dashboard', key: 'student-dashboard' },
        { name: 'Mes inscriptions', icon: '/assets/svg/enrollment-icon.svg', path: '/dashboard/my-enrollments', key: 'my-enrollments' },
        { name: 'Mes paiements', icon: '/assets/svg/payment-icon.svg', path: '/dashboard/my-payments', key: 'my-payments' },
        { name: 'FAQ', icon: '/assets/svg/faq-icon.svg', path: '/dashboard/faq', key: 'faq' },
        { name: 'Aide', icon: '/assets/svg/help-icon.svg', path: '/dashboard/help', key: 'help' },
    ];

    const igniteAcademyLogo = '/assets/images/logo.png';
    const logoutIcon = '/assets/svg/logout-icon.svg';
    const supportBoyImage = '/assets/images/support-boy-with-laptop.png';

    const handleLogout = () => {
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('user_name');
        localStorage.removeItem('user_email');
        navigate('/login');
    };

    return (
        <div className="flex flex-col p-4 shadow-lg w-[25rem]" style={{ backgroundColor: '#101957' }}>
            <div className="flex items-center justify-center pt-0 pb-6 pl-2">
                <img src={igniteAcademyLogo} alt="Ignite Academy Logo" style={{ height: '3.88rem' }} className="mr-3" />
                <span className="text-2xl font-bold text-white">Ignite Academy</span>
            </div>

            <nav className="flex-1 mt-2">
                <ul>
                    {studentNavItems.map((item) => (
                        <li key={item.key} className="mb-2">
                            <NavLink
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center transition-colors duration-200 font-normal align-middle ` +
                                    `${
                                        isActive
                                            ? 'bg-[#F96567] text-white'
                                            : 'bg-transparent hover:bg-[#3A506B] text-gray-300'
                                    }`
                                }
                                style={{
                                    width: '12.5rem',
                                    height: '1.88rem',
                                    borderRadius: '0.38rem',
                                    gap: '0.5rem',
                                    paddingRight: '0.25rem',
                                    paddingLeft: '0.25rem',
                                    fontSize: '1rem',
                                    lineHeight: '1.5rem',
                                    letterSpacing: 'normal',
                                }}
                                end={item.path === '/dashboard'}
                            >
                                <img src={item.icon} alt={`${item.name} icon`} className="mr-3 w-5 h-5" />
                                <span>{item.name}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="mt-auto relative overflow-hidden text-center mx-auto"
                style={{
                    width: '10.63rem',
                    height: '18rem',
                    borderRadius: '1.25rem',
                    background: '#FFFFFF1A',
                    marginBottom: '1rem',
                    boxShadow: '0px 0px 4px 0px rgba(0, 0, 0, 0.25)',
                }}>
                <div
                    className="absolute z-0"
                    style={{
                        width: '20rem',
                        height: '20rem',
                        bottom: '-10rem',
                        left: '-10rem',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.125)',
                    }}
                ></div>

                <img
                    src={supportBoyImage}
                    alt="Support illustration"
                    className="absolute z-10"
                    style={{
                        width: '6.88rem',
                        height: '8.51rem',
                        bottom: '0',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        opacity: 1
                    }}
                />

                <div className="absolute z-20 top-4 right-4 text-right" style={{ width: '8rem' }}>
                    <p className="text-sm font-semibold mb-1 text-white">Support 24/7</p>
                    <p className="text-xs text-gray-400">Contactez-nous à tout moment</p>
                </div>

                <button
                    className="absolute z-20 text-white shadow-md rounded-[0.25rem] flex items-center justify-center"
                    style={{
                        width: '4.19rem',
                        height: '1.44rem',
                        padding: '0.5rem 0.25rem',
                        background: '#F96567',
                        boxShadow: '0px 0px 4px 0px rgba(0, 0, 0, 0.25)',
                        top: '5.5rem',
                        right: '0.5rem',
                        fontSize: '0.625rem',
                    }}>
                    Commencer
                </button>
            </div>

            <div className="px-2 pb-4">
                <button
                    onClick={handleLogout}
                    className="flex items-center justify-center w-full rounded-[0.5rem] hover:bg-[#3A506B] transition-colors duration-200 text-white"
                    style={{
                        width: '12.5rem',
                        height: '1.88rem',
                        gap: '0.5rem',
                        paddingRight: '0.25rem',
                        paddingLeft: '0.25rem',
                        background: '#FFFFFF1A',
                    }}
                >
                    <img src={logoutIcon} alt="Déconnexion icon" className="mr-3 w-5 h-5" />
                    <span>Déconnexion</span>
                </button>
            </div>
        </div>
    );
};

export default StudentDashboardSidebar;