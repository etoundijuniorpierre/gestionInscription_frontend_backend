import api from './api';

const PROGRAMS_URL = '/api/v1/programs'; // Base path for program endpoints

/**
 * Service function to get all programs from the backend.
 * @returns {Promise} A promise that resolves to the list of programs.
 */
export const getAllPrograms = async () => {
  try {
    const response = await api.get(`${PROGRAMS_URL}/all`);
    return response.data;
  } catch (error) {
    console.error('Error in getAllPrograms:', error);
    if (error.response) {
      // Server responded with error status
      throw new Error(`Erreur ${error.response.status}: ${error.response.data.message || 'Impossible de récupérer la liste des formations'}`);
    } else if (error.request) {
      // Request was made but no response received
      throw new Error('Impossible de contacter le serveur. Veuillez vérifier votre connexion.');
    } else {
      // Something else happened
      throw new Error('Une erreur inattendue s\'est produite lors de la récupération des formations.');
    }
  }
};

/**
 * Service function to get a specific program by ID.
 * @param {number} id The ID of the program to fetch.
 * @returns {Promise} A promise that resolves to the program object.
 */
export const getProgramById = async (id) => {
  try {
    console.log('Appel API getProgramById avec id:', id);
    console.log('URL complète:', `${PROGRAMS_URL}/${id}`);
    const response = await api.get(`${PROGRAMS_URL}/${id}`);
    console.log('Réponse complète reçue:', response);
    console.log('Status de la réponse:', response.status);
    console.log('Données de la réponse:', response.data);
    console.log('Type des données:', typeof response.data);
    return response.data;
  } catch (error) {
    console.error(`Error in getProgramById with id ${id}:`, error);
    if (error.response) {
      console.error('Error response:', error.response);
      console.error('Error response status:', error.response.status);
      console.error('Error response data:', error.response.data);
      // Server responded with error status
      throw new Error(`Erreur ${error.response.status}: ${error.response.data.message || 'Impossible de récupérer les détails de la formation'}`);
    } else if (error.request) {
      console.error('Error request:', error.request);
      // Request was made but no response received
      throw new Error('Impossible de contacter le serveur. Veuillez vérifier votre connexion.');
    } else {
      console.error('Error message:', error.message);
      // Something else happened
      throw new Error('Une erreur inattendue s\'est produite lors de la récupération des détails de la formation.');
    }
  }
};

/**
 * Service function to get a specific program by code.
 * @param {string} programCode The code of the program to fetch.
 * @returns {Promise} A promise that resolves to the program object.
 */
export const getProgramByCode = async (programCode) => {
  try {
    const response = await api.get(`${PROGRAMS_URL}/code/${programCode}`);
    return response.data;
  } catch (error) {
    console.error(`Error in getProgramByCode with code ${programCode}:`, error);
    if (error.response) {
      // Server responded with error status
      throw new Error(`Erreur ${error.response.status}: ${error.response.data.message || 'Impossible de récupérer les détails de la formation'}`);
    } else if (error.request) {
      // Request was made but no response received
      throw new Error('Impossible de contacter le serveur. Veuillez vérifier votre connexion.');
    } else {
      // Something else happened
      throw new Error('Une erreur inattendue s\'est produite lors de la récupération des détails de la formation.');
    }
  }
};

/**
 * Service function to create a new program.
 * @param {object} programData The program data to create.
 * @returns {Promise} A promise that resolves to the created program object.
 */
export const createProgram = async (programData) => {
  try {
    const response = await api.post(PROGRAMS_URL, programData);
    return response.data;
  } catch (error) {
    console.error('Error in createProgram:', error);
    if (error.response) {
      // Server responded with error status
      throw new Error(`Erreur ${error.response.status}: ${error.response.data.message || 'Échec de la création de la formation'}`);
    } else if (error.request) {
      // Request was made but no response received
      throw new Error('Impossible de contacter le serveur. Veuillez vérifier votre connexion.');
    } else {
      // Something else happened
      throw new Error('Une erreur inattendue s\'est produite lors de la création de la formation.');
    }
  }
};

/**
 * Service function to update an existing program.
 * @param {number} id The ID of the program to update.
 * @param {object} programData The updated program data.
 * @returns {Promise} A promise that resolves to the updated program object.
 */
export const updateProgram = async (id, programData) => {
  try {
    const response = await api.put(`${PROGRAMS_URL}/${id}`, programData);
    return response.data;
  } catch (error) {
    console.error(`Error in updateProgram with id ${id}:`, error);
    if (error.response) {
      // Server responded with error status
      throw new Error(`Erreur ${error.response.status}: ${error.response.data.message || 'Échec de la mise à jour de la formation'}`);
    } else if (error.request) {
      // Request was made but no response received
      throw new Error('Impossible de contacter le serveur. Veuillez vérifier votre connexion.');
    } else {
      // Something else happened
      throw new Error('Une erreur inattendue s\'est produite lors de la mise à jour de la formation.');
    }
  }
};

/**
 * Service function to delete a program.
 * @param {number} id The ID of the program to delete.
 * @returns {Promise} A promise that resolves when the program is deleted.
 */
export const deleteProgram = async (id) => {
  try {
    const response = await api.delete(`${PROGRAMS_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error in deleteProgram with id ${id}:`, error);
    if (error.response) {
      // Server responded with error status
      throw new Error(`Erreur ${error.response.status}: ${error.response.data.message || 'Échec de la suppression de la formation'}`);
    } else if (error.request) {
      // Request was made but no response received
      throw new Error('Impossible de contacter le serveur. Veuillez vérifier votre connexion.');
    } else {
      // Something else happened
      throw new Error('Une erreur inattendue s\'est produite lors de la suppression de la formation.');
    }
  }
};