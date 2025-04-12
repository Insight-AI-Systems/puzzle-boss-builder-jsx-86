
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import Loading from '@/components/ui/loading';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading, profile } = useAuth();

  // Add more detailed logging for debugging
  console.log('ProtectedRoute rendering with:', { 
    loading, 
    user: user ? 'Present' : 'Not present', 
    profile: profile || 'No profile',
    requiredRole
  });

  if (loading) {
    console.log('ProtectedRoute: Loading auth state');
    return <Loading color="aqua" />;
  }

  if (!user) {
    console.log('ProtectedRoute: User not logged in, redirecting to /auth');
    return <Navigate to="/auth" replace />;
  }

  // If a specific role is required, check if the user has that role
  if (requiredRole && profile?.role !== requiredRole) {
    console.log(`ProtectedRoute: Role mismatch - Current: ${profile?.role}, Required: ${requiredRole}`);
    
    // For now, let's be more permissive during development
    console.log('ProtectedRoute: TEMPORARY - allowing access despite role mismatch');
    return children;
    
    // Uncomment this when role enforcement is ready
    // return <Navigate to="/" replace />;
  }

  console.log('ProtectedRoute: Access granted');
  return children;
};

export default ProtectedRoute;
