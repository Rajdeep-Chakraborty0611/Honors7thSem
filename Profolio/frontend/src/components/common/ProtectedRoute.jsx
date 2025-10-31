import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; // 👈 Use the custom hook

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    // You could render a nice loading spinner here
    return <div>Loading user session...</div>;
  }

  // If authenticated, render the nested components (Outlet is the child route)
  // Otherwise, redirect them to the login page
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;