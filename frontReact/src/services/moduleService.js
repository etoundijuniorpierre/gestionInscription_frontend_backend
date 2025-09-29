import api from './api';

const MODULES_URL = '/modules'; // Base path for module endpoints

/**
 * Service function to create a new module.
 * @param {object} moduleData The module data to create.
 * @returns {Promise} A promise that resolves to the created module object.
 */
export const createModule = async (moduleData) => {
  try {
    const response = await api.post(MODULES_URL, moduleData);
    return response.data;
  } catch (error) {
    console.error('Error in createModule:', error);
    if (error.response) {
      // Server responded with error status
      throw new Error(`Erreur ${error.response.status}: ${error.response.data.message || 'Échec de la création du module'}`);
    } else if (error.request) {
      // Request was made but no response received
      throw new Error('Impossible de contacter le serveur. Veuillez vérifier votre connexion.');
    } else {
      // Something else happened
      throw new Error('Une erreur inattendue s\'est produite lors de la création du module.');
    }
  }
};

/**
 * Service function to get a specific module by ID.
 * @param {number} id The ID of the module to fetch.
 * @returns {Promise} A promise that resolves to the module object.
 */
export const getModuleById = async (id) => {
  try {
    const response = await api.get(`${MODULES_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error in getModuleById with id ${id}:`, error);
    if (error.response) {
      // Server responded with error status
      throw new Error(`Erreur ${error.response.status}: ${error.response.data.message || 'Impossible de récupérer les détails du module'}`);
    } else if (error.request) {
      // Request was made but no response received
      throw new Error('Impossible de contacter le serveur. Veuillez vérifier votre connexion.');
    } else {
      // Something else happened
      throw new Error('Une erreur inattendue s\'est produite lors de la récupération des détails du module.');
    }
  }
};

/**
 * Service function to get modules by program ID.
 * @param {number} programId The ID of the program.
 * @returns {Promise} A promise that resolves to the list of modules.
 */
export const getModulesByProgramId = async (programId) => {
  try {
    const response = await api.get(`${MODULES_URL}/program/${programId}`);
    return response.data;
  } catch (error) {
    console.error(`Error in getModulesByProgramId with programId ${programId}:`, error);
    if (error.response) {
      // Server responded with error status
      throw new Error(`Erreur ${error.response.status}: ${error.response.data.message || 'Impossible de récupérer les modules pour cette formation'}`);
    } else if (error.request) {
      // Request was made but no response received
      throw new Error('Impossible de contacter le serveur. Veuillez vérifier votre connexion.');
    } else {
      // Something else happened
      throw new Error('Une erreur inattendue s\'est produite lors de la récupération des modules pour cette formation.');
    }
  }
};

/**
 * Service function to update an existing module.
 * @param {number} id The ID of the module to update.
 * @param {object} moduleData The updated module data.
 * @returns {Promise} A promise that resolves to the updated module object.
 */
export const updateModule = async (id, moduleData) => {
  try {
    const response = await api.put(`${MODULES_URL}/${id}`, moduleData);
    return response.data;
  } catch (error) {
    console.error(`Error in updateModule with id ${id}:`, error);
    if (error.response) {
      // Server responded with error status
      throw new Error(`Erreur ${error.response.status}: ${error.response.data.message || 'Échec de la mise à jour du module'}`);
    } else if (error.request) {
      // Request was made but no response received
      throw new Error('Impossible de contacter le serveur. Veuillez vérifier votre connexion.');
    } else {
      // Something else happened
      throw new Error('Une erreur inattendue s\'est produite lors de la mise à jour du module.');
    }
  }
};

/**
 * Service function to delete a module.
 * @param {number} id The ID of the module to delete.
 * @returns {Promise} A promise that resolves when the module is deleted.
 */
export const deleteModule = async (id) => {
  try {
    const response = await api.delete(`${MODULES_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error in deleteModule with id ${id}:`, error);
    if (error.response) {
      // Server responded with error status
      throw new Error(`Erreur ${error.response.status}: ${error.response.data.message || 'Échec de la suppression du module'}`);
    } else if (error.request) {
      // Request was made but no response received
      throw new Error('Impossible de contacter le serveur. Veuillez vérifier votre connexion.');
    } else {
      // Something else happened
      throw new Error('Une erreur inattendue s\'est produite lors de la suppression du module.');
    }
  }
};

/**
 * Service function to add a module to a program.
 * @param {number} programId The ID of the program.
 * @param {object} moduleData The module data to add.
 * @returns {Promise} A promise that resolves to the created module object.
 */
export const addModuleToProgram = async (programId, moduleData) => {
  try {
    const response = await api.post(`${MODULES_URL}/program/${programId}`, moduleData);
    return response.data;
  } catch (error) {
    console.error(`Error in addModuleToProgram with programId ${programId}:`, error);
    if (error.response) {
      // Server responded with error status
      throw new Error(`Erreur ${error.response.status}: ${error.response.data.message || 'Échec de l\'ajout du module à la formation'}`);
    } else if (error.request) {
      // Request was made but no response received
      throw new Error('Impossible de contacter le serveur. Veuillez vérifier votre connexion.');
    } else {
      // Something else happened
      throw new Error('Une erreur inattendue s\'est produite lors de l\'ajout du module à la formation.');
    }
  }
};