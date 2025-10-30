import api from './api';

const STATISTICS_URL = '/api/v1/statistics';

/**
 * Service function to get all statistics from the backend.
 * @returns {Promise} A promise that resolves to the statistics object.
 */
export const getStatistics = async () => {
  try {
    const response = await api.get(`${STATISTICS_URL}/all`);
    return response.data;
  } catch (error) {
    console.error('Error in getStatistics:', error);
    if (error.response && error.response.status === 500) {
      throw new Error('Erreur interne du serveur. Veuillez réessayer plus tard ou contacter l\'administrateur.');
    }
    throw error;
  }
};

/**
 * Service function to get statistics by type
 * @param {string} type - Type of statistics (candidatures, inscriptions, temps-reel, etc.)
 * @returns {Promise} A promise that resolves to the specific statistics
 */
export const getStatisticsByType = async (type) => {
  try {
    const response = await api.get(`${STATISTICS_URL}/${type}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${type} statistics:`, error);
    if (error.response && error.response.status === 500) {
      throw new Error(`Erreur interne du serveur lors du chargement des statistiques ${type}. Veuillez réessayer plus tard ou contacter l'administrateur.`);
    }
    throw error;
  }
};

/**
 * Service function to get candidature statistics
 * @returns {Promise} A promise that resolves to candidature statistics
 */
export const getCandidatureStatistics = async () => {
  try {
    const response = await api.get(`${STATISTICS_URL}/candidatures`);
    return response.data;
  } catch (error) {
    console.error('Error fetching candidature statistics:', error);
    if (error.response && error.response.status === 500) {
      throw new Error('Erreur interne du serveur lors du chargement des statistiques de candidatures. Veuillez réessayer plus tard ou contacter l\'administrateur.');
    }
    throw error;
  }
};

/**
 * Service function to get inscription statistics
 * @returns {Promise} A promise that resolves to inscription statistics
 */
export const getInscriptionStatistics = async () => {
  try {
    const response = await api.get(`${STATISTICS_URL}/inscriptions`);
    return response.data;
  } catch (error) {
    console.error('Error fetching inscription statistics:', error);
    if (error.response && error.response.status === 500) {
      throw new Error('Erreur interne du serveur lors du chargement des statistiques d\'inscriptions. Veuillez réessayer plus tard ou contacter l\'administrateur.');
    }
    throw error;
  }
};

/**
 * Service function to get real-time statistics (24h)
 * @returns {Promise} A promise that resolves to real-time statistics
 */
export const getTempsReelStatistics = async () => {
  try {
    const response = await api.get(`${STATISTICS_URL}/temps-reel`);
    return response.data;
  } catch (error) {
    console.error('Error fetching real-time statistics:', error);
    if (error.response && error.response.status === 500) {
      throw new Error('Erreur interne du serveur lors du chargement des statistiques en temps réel. Veuillez réessayer plus tard ou contacter l\'administrateur.');
    }
    throw error;
  }
};