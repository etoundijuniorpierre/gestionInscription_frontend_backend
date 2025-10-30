import api from './api';

const NOTIFICATIONS_URL = '/api/v1/notifications';

/**
 * Service function to get all notifications for the current user.
 * @returns {Promise} A promise that resolves to the list of notifications.
 */
export const getNotifications = async () => {
  try {
    const response = await api.get(`${NOTIFICATIONS_URL}/all`);
    return response.data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
};

/**
 * Service function to mark all notifications as read.
 * @returns {Promise} A promise that resolves when all notifications are marked as read.
 */
export const markAllAsRead = async () => {
  try {
    await api.post(`${NOTIFICATIONS_URL}/mark-all-as-read`);
  } catch (error) {
    console.error("Error marking notifications as read:", error);
    throw error;
  }
};

/**
 * Service function to delete a specific notification.
 * @param {number} notificationId The ID of the notification to delete.
 * @returns {Promise} A promise that resolves when the notification is deleted.
 */
export const deleteNotification = async (notificationId) => {
  try {
    await api.delete(`${NOTIFICATIONS_URL}/${notificationId}`);
  } catch (error) {
    console.error("Error deleting notification:", error);
    throw error;
  }
};

/**
 * Service function to get the count of unread notifications.
 * @returns {Promise} A promise that resolves to the count of unread notifications.
 */
export const getUnreadCount = async () => {
  try {
    const response = await api.get(`${NOTIFICATIONS_URL}/unread-count`);
    return response.data;
  } catch (error) {
    console.error("Error getting unread count:", error);
    // Fallback to counting from all notifications if the endpoint fails
    try {
      const notifications = await getNotifications();
      return notifications.filter(notification => !notification.isRead).length;
    } catch (fallbackError) {
      console.error("Fallback error getting unread count:", fallbackError);
      return 0;
    }
  }
};

/**
 * Service function to get only unread notifications.
 * @returns {Promise} A promise that resolves to the list of unread notifications.
 */
export const getUnreadNotifications = async () => {
  try {
    const notifications = await getNotifications();
    return notifications.filter(notification => !notification.isRead);
  } catch (error) {
    console.error("Error getting unread notifications:", error);
    return [];
  }
};