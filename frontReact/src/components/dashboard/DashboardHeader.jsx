import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { UserContext } from '../../contexts/UserContext';
import { useAuth } from '../../hooks/useAuth';
import { getNotifications, markAllAsRead, deleteNotification } from '../../services/notificationService.jsx';
import NotificationDropdown from './NotificationDropdown';
import './DashboardHeader.css';

const DashboardHeader = ({ pageTitle: customPageTitle }) => {
    const { user, setUser } = useContext(UserContext);
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('jwt_token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                const firstName = decodedToken.firstname || '';
                const lastName = decodedToken.lastname || '';
                
                const fullName = (firstName && lastName) ? `${firstName} ${lastName}` : decodedToken.sub;
                setUser({ ...user, name: fullName, fullName });

                if (firstName && lastName) {
                    setUser({ ...user, name: fullName, fullName, initials: `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() });
                } else if (firstName) {
                    setUser({ ...user, name: fullName, fullName, initials: firstName.charAt(0).toUpperCase() });
                } else {
                    setUser({ ...user, name: fullName, fullName, initials: '' });
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
                    const notifications = await getNotifications();
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

    // Add click outside handler to close notifications
    useEffect(() => {
        const handleClickOutside = (event) => {
            const bellIcon = document.querySelector('.bell-icon-container');
            if (isNotificationsOpen && bellIcon && !bellIcon.contains(event.target)) {
                setIsNotificationsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isNotificationsOpen]);

    const handleMarkAllAsRead = async () => {
        if (isAuthenticated) {
            try {
                await markAllAsRead();
                // Update local state to mark all as read
                setNotifications(notifications.map(n => ({ ...n, isRead: true })));
                setUnreadCount(0);
            } catch (error) {
                console.error("Failed to mark notifications as read:", error);
            }
        }
    };

    const handleDeleteNotification = async (notificationId) => {
        try {
            await deleteNotification(notificationId);
            // Update local state to remove the notification
            const updatedNotifications = notifications.filter(n => n.id !== notificationId);
            setNotifications(updatedNotifications);
            // Update unread count
            const count = updatedNotifications.filter(n => !n.isRead).length;
            setUnreadCount(count);
        } catch (error) {
            console.error("Failed to delete notification:", error);
        }
    };

    const handleBellClick = () => {
        setIsNotificationsOpen(!isNotificationsOpen);
        // Only mark as read when opening the dropdown
        if (!isNotificationsOpen) {
            handleMarkAllAsRead();
        }
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
                <div className="relative bell-icon-container">
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
                    <NotificationDropdown 
                        notifications={notifications}
                        isOpen={isNotificationsOpen}
                        onMarkAllAsRead={handleMarkAllAsRead}
                        onDeleteNotification={handleDeleteNotification}
                    />
                </div>

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
                            {user?.name || 'Utilisateur'}
                        </p>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default DashboardHeader;