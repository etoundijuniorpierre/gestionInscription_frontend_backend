import api from './api';

const NOTIFICATIONS_URL = '/api/v1/notifications'; // Base path for notification endpoints

/**
 * Service function to get all notifications for the current user.
 * @returns {Promise} A promise that resolves to the list of notifications.
 */
export const getAllNotifications = async () => {
  try {
    const response = await api.get(`${NOTIFICATIONS_URL}/all`);
    return response.data;
  } catch (error) {
    console.error('Error in getAllNotifications:', error);
    throw error;
  }
};

/**
 * Service function to get a specific notification by ID.
 * @param {number} id The ID of the notification to fetch.
 * @returns {Promise} A promise that resolves to the notification object.
 */
export const getNotificationById = async (id) => {
  try {
    const response = await api.get(`${NOTIFICATIONS_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error in getNotificationById with id ${id}:`, error);
    throw error;
  }
};

/**
 * Service function to mark all notifications as read for the current user.
 * @returns {Promise} A promise that resolves when all notifications are marked as read.
 */
export const markAllNotificationsAsRead = async () => {
  try {
    const response = await api.post(`${NOTIFICATIONS_URL}/mark-all-as-read`);
    return response.data;
  } catch (error) {
    console.error('Error in markAllNotificationsAsRead:', error);
    throw error;
  }
};

/**
 * Service function to delete a specific notification.
 * @param {number} id The ID of the notification to delete.
 * @returns {Promise} A promise that resolves when the notification is deleted.
 */
export const deleteNotification = async (id) => {
  try {
    const response = await api.delete(`${NOTIFICATIONS_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error in deleteNotification with id ${id}:`, error);
    throw error;
  }
};

/**
 * Service function to get the count of unread notifications for the current user.
 * @returns {Promise} A promise that resolves to the count of unread notifications.
 */
export const getUnreadNotificationsCount = async () => {
  try {
    const response = await api.get(`${NOTIFICATIONS_URL}/unread-count`);
    return response.data;
  } catch (error) {
    console.error('Error in getUnreadNotificationsCount:', error);
    throw error;
  }
};