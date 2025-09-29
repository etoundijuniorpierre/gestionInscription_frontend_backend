import api from './api';

const PAYMENTS_URL = '/payments'; // Base path for payment endpoints

/**
 * Calls the backend to create a Stripe payment session.
 * @param {object} paymentDetails - The data to send in the request body.
 * @param {number} paymentDetails.amount - The amount to pay (e.g., in cents).
 * @param {number} paymentDetails.enrollmentId - The ID of the enrollment to pay for.
 * @returns {Promise<{sessionId: string}>} A promise that resolves with the session ID.
 */
export const createCheckoutSession = async (paymentDetails) => {
  try {
    // Use the imported 'api' instance to make the POST request.
    // The paymentDetails object is automatically sent as the JSON request body.
    const response = await api.post(`${PAYMENTS_URL}/create-session`, paymentDetails);

    // With axios, the response data is directly in the `data` property
    return response.data;
  } catch (error) {
    console.error("Error creating checkout session:", error);
    throw error; // Propagate the error for the component to handle
  }
};

/**
 * Handles Stripe webhook events.
 * @param {object} payload - The webhook payload data.
 * @returns {Promise} A promise that resolves with the webhook response.
 */
export const handleWebhook = async (payload) => {
  try {
    const response = await api.post(`${PAYMENTS_URL}/webhook`, payload);
    return response.data;
  } catch (error) {
    console.error("Error handling webhook:", error);
    throw error;
  }
};