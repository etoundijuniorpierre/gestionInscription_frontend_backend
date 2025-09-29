import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('jwt_token');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  // If allowedRoles is specified, check if user has the required role
  if (allowedRoles && allowedRoles.length > 0) {
    try {
      const decodedToken = jwtDecode(token);
      const userRole = decodedToken.role;
      
      // Check if user's role is in the allowed roles
      if (!allowedRoles.includes(userRole)) {
        // Redirect based on user role
        if (userRole === 'ADMIN' || userRole === 'ROLE_ADMIN') {
          return <Navigate to="/admin-dashboard" replace />;
        } else {
          return <Navigate to="/dashboard" replace />;
        }
      }
    } catch (error) {
      console.error('Error decoding token:', error);
      return <Navigate to="/login" replace />;
    }
  }
  
  return children ? children : <Outlet />;
};

export default ProtectedRoute;