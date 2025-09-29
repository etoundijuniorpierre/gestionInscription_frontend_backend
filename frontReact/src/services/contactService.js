import api from './api';

const CONTACT_URL = '/contact'; // Base path for contact endpoints

/**
 * Service function to submit a contact form.
 * @param {object} contactData The contact form data.
 * @param {string} contactData.name The name of the person contacting.
 * @param {string} contactData.email The email of the person contacting.
 * @param {string} contactData.subject The subject of the message.
 * @param {string} contactData.message The message content.
 * @returns {Promise} A promise that resolves when the contact form is submitted.
 */
export const submitContactForm = async (contactData) => {
  try {
    const response = await api.post(CONTACT_URL, contactData);
    return response.data;
  } catch (error) {
    console.error('Error in submitContactForm:', error);
    throw error;
  }
};