
import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import Loading from '@/components/ui/loading';
import { hasRole } from '@/utils/permissions';

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
  const navigate = useNavigate();
  
  // Convert allowedRoles to array if it's a string
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  
  useEffect(() => {
    console.log('RoleProtectedRoute: Current state', { 
      loading, 
      user: user ? 'Logged in' : 'Not logged in', 
      profile: profile || 'No profile',
      allowedRoles: roles
    });
  }, [loading, user, profile, roles]);
  
  // Safety timeout to prevent infinite loading
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (loading) {
        console.warn('RoleProtectedRoute: Loading timeout reached');
        // Redirect to auth page as a fallback
        navigate('/auth', { replace: true });
      }
    }, 5000);
    
    return () => clearTimeout(timeoutId);
  }, [loading, navigate]);
  
  // Show loading while checking auth state
  if (loading) {
    console.log('RoleProtectedRoute: Loading auth state');
    return <Loading />;
  }
  
  // Redirect to auth page if not logged in
  if (!user) {
    console.log('RoleProtectedRoute: User not logged in, redirecting to /auth');
    return <Navigate to="/auth" replace />;
  }
  
  // If we have a user but no profile yet, show loading
  if (!profile) {
    console.log('RoleProtectedRoute: User logged in but profile not loaded yet');
    return <Loading />;
  }
  
  // Check if user has the required role(s)
  const hasRequiredRole = roles.some(role => hasRole(profile, role));
  
  // For development, temporarily allow access regardless of role
  if (!hasRequiredRole) {
    console.log(`RoleProtectedRoute: User role ${profile.role} not in allowed roles: ${roles.join(', ')}`);
    console.log('RoleProtectedRoute: TEMPORARY - allowing access despite role mismatch');
    return children;
    
    // Uncomment when role enforcement is ready
    // return <Navigate to={redirectTo} replace />;
  }

  console.log('RoleProtectedRoute: Access granted');
  // User is authenticated and has the required role, render children
  return children;
};

export default RoleProtectedRoute;
