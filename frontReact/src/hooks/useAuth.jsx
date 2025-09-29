import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('jwt_token');
        if (token) {
            setIsAuthenticated(true);
            try {
                const decodedToken = jwtDecode(token);
                setUserRole(decodedToken.role);
            } catch (error) {
                console.error('Error decoding token:', error);
                setUserRole(null);
            }
        } else {
            setIsAuthenticated(false);
            setUserRole(null);
        }
    }, []);

    return { isAuthenticated, userRole };
};