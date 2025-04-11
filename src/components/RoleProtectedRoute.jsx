
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import Loading from '@/components/ui/loading';

/**
 * Component that protects routes based on user role
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if authorized
 * @param {string|string[]} props.allowedRoles - Role or array of roles that are allowed to access this route
 * @param {string} [props.redirectTo="/"] - Path to redirect to if unauthorized
 */
const RoleProtectedRoute = ({ 
  children, 
  allowedRoles, 
  redirectTo = "/"
}) => {
  const { user, loading, profile } = useAuth();
  
  // Convert allowedRoles to array if it's a string
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  
  // Show loading while checking auth state
  if (loading) {
    return <Loading />;
  }
  
  // Redirect to auth page if not logged in
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  // Check if user has the required role(s)
  const hasRequiredRole = profile && roles.includes(profile.role);
  
  // Redirect if user doesn't have the required role
  if (!hasRequiredRole) {
    return <Navigate to={redirectTo} replace />;
  }

  // User is authenticated and has the required role, render children
  return children;
};

export default RoleProtectedRoute;
