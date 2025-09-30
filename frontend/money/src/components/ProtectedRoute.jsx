import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useEffect, useState } from 'react';

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const [hasToken, setHasToken] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check if token exists in localStorage
    const token = localStorage.getItem('token');
    setHasToken(!!token);
    
    // Also check sessionStorage for user data (backup)
    const sessionUser = sessionStorage.getItem('currentUser');
    
    // If we have completed all checks, set isChecking to false
    setIsChecking(false);
    
    console.log('Protected route check:', { 
      hasToken: !!token, 
      hasCurrentUser: !!currentUser,
      hasSessionUser: !!sessionUser
    });
  }, [currentUser]);

  if (loading || isChecking) {
    return <div className="loading-spinner">Loading...</div>;
  }

  // If we have either a current user from context or a token, allow access
  if (currentUser || hasToken) {
    return children;
  }

  // Otherwise, redirect to login
  return <Navigate to="/login" replace />;
};

export default ProtectedRoute;