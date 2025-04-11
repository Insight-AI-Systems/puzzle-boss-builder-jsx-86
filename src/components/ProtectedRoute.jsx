
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import Loading from '@/components/ui/loading';

// Development mode flag - set to true to bypass protection during development
const DEV_MODE = true;

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading, profile } = useAuth();

  // Simplified logging to reduce payload size
  console.log('ProtectedRoute state:', { 
    loading, 
    userPresent: !!user,
    profileLoaded: !!profile,
    requiredRole
  });

  // In development mode, bypass authentication checks
  if (DEV_MODE) {
    console.log('ProtectedRoute: DEV MODE - bypassing auth checks');
    return children;
  }

  if (loading) {
    return <Loading color="aqua" />;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // If a specific role is required, check if the user has that role
  if (requiredRole && profile?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
