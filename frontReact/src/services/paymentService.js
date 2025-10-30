import api from './api';

const PAYMENTS_URL = '/api/v1/payments'; // Base path for payment endpoints (full path required)
const ENROLLMENTS_URL = '/api/v1/enrollments'; // Base path for enrollment endpoints

/**
 * Calls the backend to create a Flutterwave payment session for registration fee.
 * @param {object} paymentDetails - The data to send in the request body.
 * @param {number} paymentDetails.enrollmentId - The ID of the enrollment to pay for.
 * @param {string} paymentDetails.redirectUrl - The URL to redirect to after payment.
 * @returns {Promise<{link: string}>} A promise that resolves with the payment link.
 */
export const createRegistrationFeePaymentLink = async (paymentDetails) => {
  try {
    console.log('Creating Flutterwave payment link for registration fee with payment details:', paymentDetails);
    const response = await api.post(`${PAYMENTS_URL}/initiate/registration-fee`, paymentDetails);
    console.log('Flutterwave registration fee payment link response:', response.data);

    return response.data;
  } catch (error) {
    console.error("Error creating Flutterwave registration fee payment link:", error);
    throw error; // Propagate the error for the component to handle
  }
};

/**
 * Calls the backend to create a Flutterwave payment session for program payment.
 * @param {object} paymentDetails - The data to send in the request body.
 * @param {number} paymentDetails.enrollmentId - The ID of the enrollment to pay for.
 * @param {string} paymentDetails.redirectUrl - The URL to redirect to after payment.
 * @returns {Promise<{link: string}>} A promise that resolves with the payment link.
 */
export const createProgramPaymentLink = async (paymentDetails) => {
  try {
    console.log('Creating Flutterwave payment link for program payment with payment details:', paymentDetails);
    const response = await api.post(`${PAYMENTS_URL}/initiate/program-payment`, paymentDetails);
    console.log('Flutterwave program payment link response:', response.data);

    return response.data;
  } catch (error) {
    console.error("Error creating Flutterwave program payment link:", error);
    throw error; // Propagate the error for the component to handle
  }
};

/**
 * Initiates payment for a specific enrollment using Flutterwave.
 * This function determines which payment type to use based on enrollment status.
 * @param {number} enrollmentId - The ID of the enrollment to initiate payment for.
 * @param {string} paymentType - The type of payment ('REGISTRATION_FEE' or 'PROGRAM_PAYMENT').
 * @returns {Promise<{link: string}>} A promise that resolves with the payment link.
 */
export const initiateEnrollmentPayment = async (enrollmentId, paymentType = 'REGISTRATION_FEE') => {
  try {
    console.log(`Initiating Flutterwave ${paymentType} payment for enrollment ID:`, enrollmentId);
    // Use the frontend URL from environment variables
    const redirectUrl = window.location.origin + "/payment/success";
    
    let response;
    if (paymentType === 'REGISTRATION_FEE') {
      response = await api.post(`${PAYMENTS_URL}/initiate/registration-fee`, { enrollmentId, redirectUrl });
    } else if (paymentType === 'PROGRAM_PAYMENT') {
      response = await api.post(`${PAYMENTS_URL}/initiate/program-payment`, { enrollmentId, redirectUrl });
    } else {
      throw new Error(`Invalid payment type: ${paymentType}`);
    }
    
    console.log('Initiate payment response:', response.data);
    return response.data;
  } catch (error) {
    console.error(`Error initiating payment for enrollment ${enrollmentId}:`, error);
    throw error;
  }
};

/**
 * Handles Flutterwave webhook events.
 * @param {object} payload - The webhook payload data.
 * @returns {Promise} A promise that resolves with the webhook response.
 */
export const handleWebhook = async (payload) => {
  try {
    console.log('Handling webhook with payload:', payload);
    const response = await api.post(`${PAYMENTS_URL}/webhook`, payload);
    console.log('Webhook response:', response.data);
    return response.data;
  } catch (error) {
    console.error("Error handling webhook:", error);
    throw error;
  }
};

/**
 * Fetches all payments for the current user.
 * @returns {Promise<Array>} A promise that resolves with an array of payment objects.
 */
export const getUserPayments = async () => {
  try {
    console.log('Fetching user payments');
    const response = await api.get(`${PAYMENTS_URL}/my-payments`);
    console.log('User payments response:', response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching user payments:", error);
    throw error;
  }
};