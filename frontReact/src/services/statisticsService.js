import api from './api';

const STATISTICS_URL = '/statistics'; // Base path for statistics endpoints

/**
 * Service function to get all statistics from the backend.
 * @returns {Promise} A promise that resolves to the statistics object.
 */
export const getStatistics = async () => {
  try {
    const response = await api.get(STATISTICS_URL);
    return response.data;
  } catch (error) {
    console.error('Error in getStatistics:', error);
    throw error;
  }
};