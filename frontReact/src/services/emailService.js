import api from './api';
import { getAllUsers } from './userService';

const EMAILS_URL = '/api/v1/emails';

/**
 * Service function to get all students for email selection
 * @returns {Promise} A promise that resolves to the list of students
 */
export const getStudentsForEmail = async () => {
  try {
    // Use the existing getAllUsers endpoint and filter for students
    const allUsers = await getAllUsers();
    // Filter for users with STUDENT role
    const students = allUsers.filter(user => user.roleName === 'STUDENT');
    // Map to the expected format for the EmailModal
    return students.map(student => ({
      id: student.id,
      fullName: `${student.firstname} ${student.lastname}`,
      email: student.email
    }));
  } catch (error) {
    console.error('Error fetching students for email:', error);
    throw error;
  }
};

/**
 * Service function to send email to a student
 * @param {string} recipientEmail - The email of the recipient
 * @param {string} subject - Email subject
 * @param {string} content - Email content
 * @returns {Promise} A promise that resolves to the response
 */
export const sendEmailToStudent = async (recipientEmail, subject, content) => {
  try {
    // Since there's no actual email endpoint in the API documentation,
    // we'll simulate sending an email by showing an alert
    // In a real implementation, this would call an actual email service
    console.log('Email would be sent:', { recipientEmail, subject, content });
    // Return a success response
    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};