import api from './api';

const PROGRAMS_URL = '/programs'; // Base path for program endpoints

/**
 * Service function to get all programs from the backend.
 * @returns {Promise} A promise that resolves to the list of programs.
 */
export const getAllPrograms = async () => {
  try {
    const response = await api.get(PROGRAMS_URL);
    return response;
  } catch (error) {
    console.error('Error in getAllPrograms:', error);
    throw error;
  }
};

/**
 * Service function to get a specific program by ID.
 * @param {number} id The ID of the program to fetch.
 * @returns {Promise} A promise that resolves to the program object.
 */
export const getProgramById = async (id) => {
  try {
    const response = await api.get(`${PROGRAMS_URL}/${id}`);
    return response;
  } catch (error) {
    console.error(`Error in getProgramById with id ${id}:`, error);
    throw error;
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
    return response;
  } catch (error) {
    console.error(`Error in getProgramByCode with code ${programCode}:`, error);
    throw error;
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
    throw error;
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
    throw error;
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
    throw error;
  }
};