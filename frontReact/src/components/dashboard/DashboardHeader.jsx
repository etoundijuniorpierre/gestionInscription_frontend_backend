import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { UserContext } from '../../contexts/UserContext';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';

const DashboardHeader = ({ variant = 'default', pageTitle: customPageTitle }) => {
    const { user, setUser } = useContext(UserContext);
    const { isAuthenticated, userRole } = useAuth();
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('jwt_token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                const firstName = decodedToken.firstname || '';
                const lastName = decodedToken.lastname || '';
                
                const fullName = (firstName && lastName) ? `${firstName} ${lastName}` : decodedToken.sub;
                setUser({ ...user, fullName });

                if (firstName && lastName) {
                    setUser({ ...user, initials: `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() });
                } else if (firstName) {
                    setUser({ ...user, initials: firstName.charAt(0).toUpperCase() });
                } else {
                    setUser({ ...user, initials: '' });
                }
            } catch (error) {
                console.error("Failed to decode token:", error);
            }
        }
    }, []);

    useEffect(() => {
        const fetchNotifications = async () => {
            if (isAuthenticated) {
                try {
                    const response = await api.get('/api/v1/notifications');
                    const notifications = response.data;
                    setNotifications(notifications);
                    // Count unread notifications (backend now provides isRead field)
                    const count = notifications.filter(n => !n.isRead).length;
                    setUnreadCount(count);
                } catch (error) {
                    console.error("Failed to fetch notifications:", error);
                }
            }
        };

        fetchNotifications();
    }, [isAuthenticated]);

    const markAllAsRead = async () => {
        if (isAuthenticated) {
            try {
                await api.post('/api/v1/notifications/mark-all-as-read');
                // Update local state to mark all as read
                setNotifications(notifications.map(n => ({ ...n, isRead: true })));
                setUnreadCount(0);
            } catch (error) {
                console.error("Failed to mark notifications as read:", error);
            }
        }
    };

    const handleBellClick = () => {
        setIsNotificationsOpen(!isNotificationsOpen);
        markAllAsRead();
    };

    const pageTitles = {
        '/dashboard': 'Tableau de bord',
        '/dashboard/faq': 'FAQ',
        '/dashboard/help': 'Aide',
    };
    
    const pageTitle = customPageTitle || pageTitles[window.location.pathname] || 'Tableau de bord';
    
    const BackArrowIcon = '/assets/svg/back-arrow-icon.svg';
    const BellIcon = '/assets/svg/bell-icon.svg';

    return (
        <header className="bg-white p-4 shadow-sm flex items-center justify-between">
            <div className="flex items-center">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center justify-center transition-colors mr-3"
                    style={{
                        width: '2rem',
                        height: '2rem',
                        borderRadius: '0.25rem',
                        background: '#E9EDF4',
                        padding: '0',
                    }}
                >
                    <img src={BackArrowIcon} alt="Retour" className="w-4 h-4" />
                </button>
                <h1
                    className="font-bold text-black"
                    style={{
                        fontSize: '2.5rem',
                        lineHeight: '143%',
                        letterSpacing: '0.0156rem',
                        fontFamily: 'Roboto, sans-serif',
                        color: '#1A202C',
                    }}
                >
                    {pageTitle}
                </h1>
            </div>

            <div className="flex items-center space-x-4">
                <button
                    onClick={handleBellClick}
                    className="flex items-center justify-center relative transition-colors"
                    style={{
                        width: '4.06rem',
                        height: '4.06rem',
                        borderRadius: '1.84rem',
                        padding: '0.5rem',
                    }}
                >
                    <img src={BellIcon} alt="Notifications" className="w-full h-full object-contain" />
                    {unreadCount > 0 && (
                        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                            {unreadCount}
                        </span>
                    )}
                </button>

                <div className="flex items-center">
                    <div
                        className="flex items-center justify-center text-white font-semibold text-lg mr-3 flex-shrink-0"
                        style={{
                            width: '2.81rem',
                            height: '2.81rem',
                            borderRadius: '2.5rem',
                            background: '#101957',
                        }}
                    >
                        {user?.initials || ''}
                    </div>
                    <div>
                        <p
                            className="font-normal"
                            style={{
                                fontSize: '1rem',
                                lineHeight: '1.5rem',
                                verticalAlign: 'middle',
                                fontFamily: 'sans-serif',
                                color: '#333333',
                            }}
                        >
                            {user?.fullName || 'Utilisateur'}
                        </p>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default DashboardHeader;