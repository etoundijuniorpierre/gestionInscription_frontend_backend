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
    throw error;
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
    throw error;
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
    throw error;
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
    throw error;
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
    throw error;
  }
};