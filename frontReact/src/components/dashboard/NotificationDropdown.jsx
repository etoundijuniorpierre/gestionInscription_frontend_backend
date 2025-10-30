import React from 'react';
import './NotificationDropdown.css';

const NotificationDropdown = ({ notifications, isOpen, onMarkAllAsRead, onDeleteNotification }) => {
  if (!isOpen) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="notification-dropdown">
      <div className="notification-header">
        <h3>Notifications</h3>
        <button 
          onClick={onMarkAllAsRead}
          className="mark-all-read-btn"
        >
          Tout marquer comme lu
        </button>
      </div>
      
      <div className="notification-list">
        {notifications && notifications.length > 0 ? (
          notifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`notification-item ${notification.isRead ? 'read' : 'unread'}`}
            >
              <div className="notification-content">
                <p className="notification-message">{notification.content}</p>
                <p className="notification-date">{formatDate(notification.createdDate)}</p>
              </div>
              <button 
                onClick={() => onDeleteNotification(notification.id)}
                className="delete-notification-btn"
                aria-label="Supprimer la notification"
              >
                ×
              </button>
            </div>
          ))
        ) : (
          <p className="no-notifications">Aucune notification</p>
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;