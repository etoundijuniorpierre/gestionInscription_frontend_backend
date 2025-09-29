import axios from 'axios';
import api from './api';

const NOTIFICATIONS_URL = '/notifications'; // Base path for notification endpoints

export const getNotifications = async () => {
  try {
    const response = await api.get(NOTIFICATIONS_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
};

export const markAllAsRead = async () => {
  try {
    await api.post(`${NOTIFICATIONS_URL}/mark-all-as-read`);
  } catch (error) {
    console.error("Error marking notifications as read:", error);
    throw error;
  }
};
