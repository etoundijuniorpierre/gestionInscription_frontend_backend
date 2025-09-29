import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUserName = localStorage.getItem('user_name');
        const storedUserEmail = localStorage.getItem('user_email');
        const storedToken = localStorage.getItem('jwt_token');
        const storedUserRole = localStorage.getItem('user_role');

        if (storedUserName && storedUserEmail && storedToken) {
            // If we don't have the role stored, try to decode it from the token
            let role = storedUserRole;
            if (!role) {
                try {
                    const decodedToken = jwtDecode(storedToken);
                    role = decodedToken.role;
                } catch (error) {
                    console.error('Error decoding token:', error);
                }
            }
            
            setUser({
                name: storedUserName,
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