
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import Loading from '@/components/ui/loading';
import { hasRole } from '@/utils/permissions';

// Development mode flag - set to true to bypass protection during development
const DEV_MODE = true;

/**
 * Component that protects routes based on user role
 */
const RoleProtectedRoute = ({ 
  children, 
  allowedRoles, 
  redirectTo = "/"
}) => {
  const { user, loading, profile } = useAuth();
  
  // Convert allowedRoles to array if it's a string
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  
  // In development mode, bypass role checks
  if (DEV_MODE) {
    return children;
  }
  
  // Show loading while checking auth state
  if (loading) {
    return <Loading />;
  }
  
  // Redirect to auth page if not logged in
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  // If we have a user but no profile yet, show loading
  if (!profile) {
    return <Loading />;
  }
  
  // Check if user has the required role(s)
  const hasRequiredRole = roles.some(role => hasRole(profile, role));
  
  if (!hasRequiredRole) {
    return <Navigate to={redirectTo} replace />;
  }

  // User is authenticated and has the required role, render children
  return children;
};

export default RoleProtectedRoute;
