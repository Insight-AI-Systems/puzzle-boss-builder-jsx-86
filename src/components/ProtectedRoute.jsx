
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

  // TEMPORARY FIX FOR MINIMAL APP: Always render children
  // This ensures the minimal app can load even if auth is broken
  const isMinimalApp = window.location.search.includes('minimal=true');
  if (isMinimalApp) {
    console.log('ProtectedRoute: Using minimal app mode, bypassing auth check');
    return children;
  }

  if (loading) {
    console.log('ProtectedRoute: Loading auth state');
    return <Loading color="aqua" />;
  }

  // Safety check for infinite loading
  if (loading === undefined) {
    console.error('ProtectedRoute: Auth loading state is undefined');
    return <Loading color="burgundy" message="Authentication system error" />;
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
