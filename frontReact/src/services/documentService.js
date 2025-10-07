import api from './api';

const IMAGES_URL = '/images'; // Base path for image/document endpoints

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
 * Service function to get a document by name.
 * @param {string} fileName The name of the file to retrieve.
 * @returns {Promise} A promise that resolves to the document data.
 */
export const getDocumentByName = async (fileName) => {
  try {
    const response = await api.get(`${IMAGES_URL}/${fileName}`);
    return response.data;
  } catch (error) {
    console.error(`Error in getDocumentByName with fileName ${fileName}:`, error);
    throw error;
  }
};

/**
 * Service function to get document metadata by ID.
 * @param {number} documentId The ID of the document to retrieve.
 * @returns {Promise} A promise that resolves to the document metadata.
 */
export const getDocumentById = async (documentId) => {
  try {
    const response = await api.get(`${IMAGES_URL}/document/${documentId}`);
    return response.data;
  } catch (error) {
    console.error(`Error in getDocumentById with documentId ${documentId}:`, error);
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
    const response = await api.get(`${IMAGES_URL}/download/${documentId}`, {
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    console.error(`Error in downloadDocumentById with documentId ${documentId}:`, error);
    throw error;
  }
};