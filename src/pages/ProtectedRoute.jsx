import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from './UserContext';

// This component will be used to protect routes
const ProtectedRoute = ({ children, requiredRole }) => {
  const { currentUser, loading, initialized } = useUser();
  const location = useLocation();

  // Only show loading if we're still initializing
  if (loading && !initialized) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is not logged in, redirect to login page
  if (!currentUser && initialized) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // If a specific role is required and user doesn't have it
  if (requiredRole && currentUser?.role !== requiredRole) {
    // Redirect to appropriate dashboard based on role
    if (currentUser?.role === 'student') {
      return <Navigate to="/profile" replace />;
    } else if (currentUser?.role === 'admin') {
      return <Navigate to="/admin" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  // If all checks pass, render the children
  return children;
};

export default ProtectedRoute;