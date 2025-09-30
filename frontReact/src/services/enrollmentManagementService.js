import api from './api';

const ENROLLMENTS_URL = '/enrollments'; // Base path for enrollment endpoints

/**
 * Service function to get all enrollments from the backend.
 * @returns {Promise} A promise that resolves to the list of enrollments.
 */
export const getAllEnrollments = async () => {
  try {
    const response = await api.get(ENROLLMENTS_URL);
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
 * Service function to get enrollments by academic year.
 * @param {string} academicYear The academic year.
 * @returns {Promise} A promise that resolves to the list of enrollments.
 */
export const getEnrollmentsByAcademicYear = async (academicYear) => {
  try {
    const response = await api.get(`${ENROLLMENTS_URL}/year/${academicYear}`);
    return response.data;
  } catch (error) {
    console.error(`Error in getEnrollmentsByAcademicYear with academicYear ${academicYear}:`, error);
    throw error;
  }
};

/**
 * Service function to get enrollments by program ID and academic year.
 * @param {number} programId The ID of the program.
 * @param {string} academicYear The academic year.
 * @returns {Promise} A promise that resolves to the list of enrollments.
 */
export const getEnrollmentsByProgramAndYear = async (programId, academicYear) => {
  try {
    const response = await api.get(`${ENROLLMENTS_URL}/program/${programId}/year/${academicYear}`);
    return response.data;
  } catch (error) {
    console.error(`Error in getEnrollmentsByProgramAndYear with programId ${programId} and academicYear ${academicYear}:`, error);
    throw error;
  }
};

/**
 * Service function to get available academic years.
 * @returns {Promise} A promise that resolves to the list of academic years.
 */
export const getAvailableAcademicYears = async () => {
  try {
    const response = await api.get(`${ENROLLMENTS_URL}/available-academic-years`);
    return response.data;
  } catch (error) {
    console.error('Error in getAvailableAcademicYears:', error);
    throw error;
  }
};

/**
 * Service function to update an enrollment status.
 * @param {number} id The ID of the enrollment to update.
 * @param {object} statusData The status update data.
 * @returns {Promise} A promise that resolves to the updated enrollment object.
 */
export const updateEnrollmentStatus = async (id, statusData) => {
  try {
    const response = await api.patch(`${ENROLLMENTS_URL}/${id}/status`, statusData);
    return response.data;
  } catch (error) {
    console.error(`Error in updateEnrollmentStatus with id ${id}:`, error);
    throw error;
  }
};

/**
 * Service function to update a document status.
 * @param {number} enrollmentId The ID of the enrollment.
 * @param {string} documentType The type of document.
 * @param {object} statusData The status update data.
 * @returns {Promise} A promise that resolves to the updated document object.
 */
export const updateDocumentStatus = async (enrollmentId, documentType, statusData) => {
  try {
    const response = await api.patch(`${ENROLLMENTS_URL}/${enrollmentId}/documents/${documentType}`, statusData);
    return response.data;
  } catch (error) {
    console.error(`Error in updateDocumentStatus with enrollmentId ${enrollmentId} and documentType ${documentType}:`, error);
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
