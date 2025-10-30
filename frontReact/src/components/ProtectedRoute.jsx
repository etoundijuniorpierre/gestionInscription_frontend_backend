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
      console.log('ProtectedRoute - User role:', userRole);
      console.log('ProtectedRoute - Allowed roles:', allowedRoles);
      
      // Check if user's role is in the allowed roles
      if (!allowedRoles.includes(userRole)) {
        console.log('ProtectedRoute - Role not allowed, redirecting...');
        // Redirect based on user role
        if (userRole === 'ADMIN') {
          return <Navigate to="/admin-dashboard" replace />;
        } else if (userRole === 'STUDENT') {
          return <Navigate to="/dashboard" replace />;
        } else {
          // If role is neither ADMIN nor STUDENT, redirect to login
          return <Navigate to="/login" replace />;
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