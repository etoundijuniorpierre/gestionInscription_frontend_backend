import api from './api';

const ENROLLMENTS_URL = '/enrollments'; // Base path for enrollment endpoints

/**
 * Service function to get the latest enrollment for the authenticated student.
 * This is used to determine the status of the student's current application.
 * @returns {Promise} A promise that resolves to the latest enrollment object or null.
 */
export const getLatestEnrollment = async () => {
  try {
    const response = await api.get(`${ENROLLMENTS_URL}/my-latest`);
    return response.data;
  } catch (error) {
    console.error('Error in getLatestEnrollment:', error);
    throw error;
  }
};

/**
 * Service function to get all enrollments for the current user.
 * @returns {Promise} A promise that resolves to the list of enrollments.
 */
export const getMyEnrollments = async () => {
  try {
    const response = await api.get(`${ENROLLMENTS_URL}/my-enrollments`);
    return response.data;
  } catch (error) {
    console.error('Error in getMyEnrollments:', error);
    throw error;
  }
};

/**
 * Service function to submit the enrollment form data to the backend API.
 * This function will handle the multi-part form data for documents and JSON.
 * @param {object} formData The combined data from all enrollment form steps.
 * @param {Array} documents Array of document objects with file and type properties.
 * @returns {Promise} A promise that resolves to the API response.
 */
export const submitEnrollmentForm = async (formData, documents) => {
  try {
    const data = new FormData();
    data.append('enrollmentDtoRequest', JSON.stringify(formData));

    // Create a mapping of document types to proper filenames
    const documentMapping = {
      diplome1: 'diplome1.pdf',
      diplome2: 'diplome2.pdf',
      cni: 'cni.pdf',
      acteNaissance: 'acteNaissance.pdf',
      photoIdentite: 'photoIdentite.pdf',
      cv: 'cv.pdf',
      lettreMotivation: 'lettreMotivation.pdf'
    };

    // Append documents with the correct filenames for backend recognition
    documents.forEach((doc) => {
      if (doc.file && doc.type) {
        const newFilename = documentMapping[doc.type] || `${doc.type}.pdf`;
        // Create a new file with the correct name for backend recognition
        const renamedFile = new File([doc.file], newFilename, { type: doc.file.type });
        data.append('documents', renamedFile);
      }
    });

    // Add timeout and better error handling
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 30000, // 30 second timeout
    };

    const response = await api.post(ENROLLMENTS_URL, data, config);

    return response.data;
  } catch (error) {
    console.error('Error in submitEnrollmentForm:', error);

    // Enhanced error logging
    if (error.code === 'ERR_NETWORK') {
      console.error('Network error details:', {
        baseURL: api.defaults.baseURL,
        url: ENROLLMENTS_URL,
        message: error.message,
        stack: error.stack
      });
    }

    throw error;
  }
};