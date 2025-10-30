import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUserEmail = localStorage.getItem('user_email');
        const storedToken = localStorage.getItem('jwt_token');
        const storedUserRole = localStorage.getItem('user_role');

        if (storedUserEmail && storedToken) {
            // Decode the token to get user information
            let decodedToken = null;
            try {
                decodedToken = jwtDecode(storedToken);
            } catch (error) {
                console.error('Error decoding token:', error);
            }

            // Extract user information from token or localStorage
            const firstname = decodedToken?.firstname || localStorage.getItem('user_firstname') || 'Utilisateur';
            const lastname = decodedToken?.lastname || localStorage.getItem('user_lastname') || '';
            const role = storedUserRole || decodedToken?.role || null;
            
            setUser({
                name: firstname + (lastname ? ' ' + lastname : ''),
                firstname: firstname,
                lastname: lastname,
                email: storedUserEmail,
                role: role,
            });
        }
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};