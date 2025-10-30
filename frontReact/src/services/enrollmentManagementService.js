import api from './api';

const ENROLLMENTS_URL = '/api/v1/enrollments'; // Base path for enrollment endpoints

/**
 * Service function to get all enrollments from the backend.
 * Uses the dedicated /all endpoint which retrieves all enrollments for admins.
 * @returns {Promise} A promise that resolves to the list of all enrollments.
 */
export const getAllEnrollments = async () => {
  try {
    const response = await api.get(`${ENROLLMENTS_URL}/all`);
    return response.data;
  } catch (error) {
    console.error('Error in getAllEnrollments:', error);
    throw error;
  }
};

/**
 * Service function to get a specific enrollment by ID.
 * @param {number} id The ID of the enrollment to fetch.
 * @returns {Promise} A promise that resolves to the enrollment object.
 */
export const getEnrollmentById = async (id) => {
  try {
    const response = await api.get(`${ENROLLMENTS_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error in getEnrollmentById with id ${id}:`, error);
    throw error;
  }
};

/**
 * Service function to get enrollments by program ID.
 * @param {number} programId The ID of the program.
 * @returns {Promise} A promise that resolves to the list of enrollments.
 */
export const getEnrollmentsByProgramId = async (programId) => {
  try {
    const response = await api.get(`${ENROLLMENTS_URL}/program/${programId}`);
    return response.data;
  } catch (error) {
    console.error(`Error in getEnrollmentsByProgramId with programId ${programId}:`, error);
    throw error;
  }
};




/**
 * Service function to get all non-approved enrollments from the backend.
 * Uses the dedicated /non-approved endpoint which retrieves all non-approved enrollments for admins.
 * @returns {Promise} A promise that resolves to the list of non-approved enrollments.
 */
export const getAllNonApprovedEnrollments = async () => {
  try {
    const response = await api.get(`${ENROLLMENTS_URL}/non-approved`);
    return response.data;
  } catch (error) {
    console.error('Error in getAllNonApprovedEnrollments:', error);
    throw error;
  }
};



/**
 * Service function to approve a specific enrollment.
 * @param {number} enrollmentId The ID of the enrollment to approve.
 * @returns {Promise} A promise that resolves to the approved enrollment object.
 */
export const approveEnrollment = async (enrollmentId) => {
  try {
    const response = await api.patch(`${ENROLLMENTS_URL}/${enrollmentId}/approve`);
    return response.data;
  } catch (error) {
    console.error(`Error in approveEnrollment with enrollmentId ${enrollmentId}:`, error);
    throw error;
  }
};

/**
 * Service function to request corrections for a specific enrollment.
 * @param {number} enrollmentId The ID of the enrollment to request corrections for.
 * @param {Array} corrections Array of correction requests with documentId and reason.
 * @returns {Promise} A promise that resolves to the updated enrollment object.
 */
export const requestEnrollmentCorrections = async (enrollmentId, corrections) => {
  try {
    const response = await api.patch(`${ENROLLMENTS_URL}/${enrollmentId}/request-corrections`, corrections);
    return response.data;
  } catch (error) {
    console.error(`Error in requestEnrollmentCorrections with enrollmentId ${enrollmentId}:`, error);
    throw error;
  }
};

/**
 * Service function to reject a specific enrollment.
 * @param {number} enrollmentId The ID of the enrollment to reject.
 * @param {string} rejectionReason The reason for rejection.
 * @returns {Promise} A promise that resolves to the rejected enrollment object.
 */
export const rejectEnrollment = async (enrollmentId, rejectionReason) => {
  try {
    const response = await api.patch(`${ENROLLMENTS_URL}/${enrollmentId}/reject`, {
      rejectionReason
    });
    return response.data;
  } catch (error) {
    console.error(`Error in rejectEnrollment with enrollmentId ${enrollmentId}:`, error);
    throw error;
  }
};