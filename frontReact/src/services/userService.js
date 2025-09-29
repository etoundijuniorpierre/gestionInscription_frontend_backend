import api from './api';

const USERS_URL = '/auth'; // Base path for authentication endpoints

/**
 * Service function to register a new user.
 * @param {object} userData The user registration data.
 * @returns {Promise} A promise that resolves to the registration response.
 */
export const registerUser = async (userData) => {
  try {
    const response = await api.post(`${USERS_URL}/signup`, userData);
    return response.data;
  } catch (error) {
    console.error('Error in registerUser:', error);
    throw error;
  }
};

/**
 * Service function to login a user.
 * @param {object} credentials The user login credentials.
 * @returns {Promise} A promise that resolves to the login response.
 */
export const loginUser = async (credentials) => {
  try {
    const response = await api.post(`${USERS_URL}/login`, credentials);
    return response.data;
  } catch (error) {
    console.error('Error in loginUser:', error);
    throw error;
  }
};

/**
 * Service function to activate a user account.
 * @param {string} token The activation token.
 * @returns {Promise} A promise that resolves to the activation response.
 */
export const activateAccount = async (token) => {
  try {
    const response = await api.get(`${USERS_URL}/activate-account`, {
      params: { token }
    });
    return response.data;
  } catch (error) {
    console.error('Error in activateAccount:', error);
    throw error;
  }
};

/**
 * Service function to request password reset.
 * @param {string} email The user's email.
 * @returns {Promise} A promise that resolves to the password reset response.
 */
export const forgotPassword = async (email) => {
  try {
    const response = await api.post(`${USERS_URL}/forgot-password`, { email });
    return response.data;
  } catch (error) {
    console.error('Error in forgotPassword:', error);
    throw error;
  }
};

/**
 * Service function to logout the current user.
 * @returns {Promise} A promise that resolves when logout is complete.
 */
export const logoutUser = async () => {
  try {
    const response = await api.post(`${USERS_URL}/logout`);
    return response.data;
  } catch (error) {
    console.error('Error in logoutUser:', error);
    throw error;
  }
};

/**
 * Service function to get all users from the backend.
 * @returns {Promise} A promise that resolves to the list of users.
 */
export const getAllUsers = async () => {
  try {
    const response = await api.get(`${USERS_URL}/users`);
    return response.data;
  } catch (error) {
    console.error('Error in getAllUsers:', error);
    throw error;
  }
};

/**
 * Service function to get a specific user by ID.
 * @param {number} id The ID of the user to fetch.
 * @returns {Promise} A promise that resolves to the user object.
 */
export const getUserById = async (id) => {
  try {
    const response = await api.get(`${USERS_URL}/users/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error in getUserById with id ${id}:`, error);
    throw error;
  }
};

/**
 * Service function to create a new user.
 * @param {object} userData The user data to create.
 * @returns {Promise} A promise that resolves to the created user object.
 */
export const createUser = async (userData) => {
  try {
    const response = await api.post(`${USERS_URL}/signup`, userData);
    return response.data;
  } catch (error) {
    console.error('Error in createUser:', error);
    throw error;
  }
};

/**
 * Service function to update an existing user.
 * @param {number} id The ID of the user to update.
 * @param {object} userData The updated user data.
 * @returns {Promise} A promise that resolves to the updated user object.
 */
export const updateUser = async (id, userData) => {
  try {
    const response = await api.put(`${USERS_URL}/users/${id}`, userData);
    return response.data;
  } catch (error) {
    console.error(`Error in updateUser with id ${id}:`, error);
    throw error;
  }
};

/**
 * Service function to delete a user.
 * @param {number} id The ID of the user to delete.
 * @returns {Promise} A promise that resolves when the user is deleted.
 */
export const deleteUser = async (id) => {
  try {
    const response = await api.delete(`${USERS_URL}/users/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error in deleteUser with id ${id}:`, error);
    throw error;
  }
};

/**
 * Service function to activate/deactivate a user.
 * @param {number} id The ID of the user to toggle status.
 * @returns {Promise} A promise that resolves when the user status is toggled.
 */
export const toggleUserStatus = async (id) => {
  try {
    const response = await api.patch(`${USERS_URL}/users/${id}/toggle-status`);
    return response.data;
  } catch (error) {
    console.error(`Error in toggleUserStatus with id ${id}:`, error);
    throw error;
  }
};