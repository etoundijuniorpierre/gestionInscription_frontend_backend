import api from './api';

const CONTACT_URL = '/api/v1/contact';

/**
 * Service function to send a contact message from student to admin
 * @param {Object} contactData - The contact form data
 * @param {string} contactData.name - The sender's name
 * @param {string} contactData.email - The sender's email
 * @param {string} contactData.subject - Message subject
 * @param {string} contactData.message - Message content
 * @returns {Promise} A promise that resolves to the response
 */
export const sendContactMessage = async (contactData) => {
  try {
    const response = await api.post(CONTACT_URL, contactData);
    return response.data;
  } catch (error) {
    console.error('Error sending contact message:', error);
    throw error;
  }
};