import api from './api';

const IMAGES_URL = '/api/v1/images'; // Base path for image/document endpoints

/**
 * Service function to upload a document.
 * @param {File} file The file to upload.
 * @returns {Promise} A promise that resolves to the upload response.
 */
export const uploadDocument = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    // Add timeout and better error handling
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 30000, // 30 second timeout
    };

    const response = await api.post(`${IMAGES_URL}/upload`, formData, config);

    return response.data;
  } catch (error) {
    console.error('Error in uploadDocument:', error);

    // Enhanced error logging
    if (error.code === 'ERR_NETWORK') {
      console.error('Network error details:', {
        baseURL: api.defaults.baseURL,
        url: `${IMAGES_URL}/upload`,
        message: error.message,
        stack: error.stack
      });
    }

    throw error;
  }
};


/**
 * Service function to download a document by ID.
 * @param {number} documentId The ID of the document to download.
 * @returns {Promise} A promise that resolves to the document blob.
 */
export const downloadDocumentById = async (documentId) => {
  try {
    const response = await api.get(`${IMAGES_URL}/document/${documentId}/download`, {
      responseType: 'blob',
      timeout: 60000 // 60 second timeout for downloads
    });
    return response.data;
  } catch (error) {
    console.error(`Error in downloadDocumentById with documentId ${documentId}:`, error);
    throw error;
  }
};


/**
 * Service function to validate a document by ID.
 * @param {number} documentId The ID of the document to validate.
 * @returns {Promise} A promise that resolves to the validation response.
 */
export const validateDocumentById = async (documentId) => {
  try {
    const response = await api.patch(`${IMAGES_URL}/validate/${documentId}`);
    return response.data;
  } catch (error) {
    console.error(`Error in validateDocumentById with documentId ${documentId}:`, error);
    throw error;
  }
};

/**
 * Service function to reject a document by ID.
 * @param {number} documentId The ID of the document to reject.
 * @param {string} rejectionReason The reason for rejection.
 * @returns {Promise} A promise that resolves to the rejection response.
 */
export const rejectDocumentById = async (documentId, rejectionReason) => {
  try {
    const response = await api.patch(`${IMAGES_URL}/reject/${documentId}`, {
      rejectionReason
    });
    return response.data;
  } catch (error) {
    console.error(`Error in rejectDocumentById with documentId ${documentId}:`, error);
    throw error;
  }
};
