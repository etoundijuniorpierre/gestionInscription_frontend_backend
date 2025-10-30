import { jwtDecode } from 'jwt-decode';

/**
 * Check if a JWT token is expired
 * @param {string} token - The JWT token to check
 * @returns {boolean} - True if token is expired, false otherwise
 */
export const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000; // Convert to seconds
    return decoded.exp < currentTime;
  } catch (error) {
    // If there's an error decoding the token, consider it expired
    console.error('Error decoding token:', error);
    return true;
  }
};

/**
 * Get the remaining time until token expiration in seconds
 * @param {string} token - The JWT token to check
 * @returns {number} - Seconds until expiration, negative if already expired
 */
export const getTokenTimeUntilExpiration = (token) => {
  if (!token) return 0;
  
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000; // Convert to seconds
    return decoded.exp - currentTime;
  } catch (error) {
    console.error('Error decoding token:', error);
    return 0;
  }
};