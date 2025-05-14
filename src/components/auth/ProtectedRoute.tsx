
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthState } from '@/contexts/auth/AuthStateContext';
import { useRoles } from '@/contexts/auth/RoleContext';
import { UserRole } from '@/types/userTypes';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
  requiredPermissions?: string[];
  requireAll?: boolean; // If true, user must have all required roles/permissions
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRoles = [], 
  requiredPermissions = [],
  requireAll = false
}) => {
  const { isAuthenticated, isLoading: authLoading } = useAuthState();
  const { 
    hasRole, 
    hasPermission, 
    hasAllPermissions, 
    hasAnyPermission, 
    rolesLoaded 
  } = useRoles();
  
  // Combined loading state
  const isLoading = authLoading || (!rolesLoaded && isAuthenticated);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-puzzle-aqua" />
          <p className="mt-4 text-gray-400">Loading authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to auth page, save the current path for redirect after login
    return <Navigate to="/auth" state={{ from: window.location }} replace />;
  }

  // Check role requirements if specified
  let hasRequiredRoles = true;
  if (requiredRoles.length > 0) {
    hasRequiredRoles = requireAll
      ? requiredRoles.every(role => hasRole(role))
      : requiredRoles.some(role => hasRole(role));
      
    if (!hasRequiredRoles) {
      console.log('ProtectedRoute - Access denied: missing required roles');
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Check permission requirements if specified
  let hasRequiredPermissions = true;
  if (requiredPermissions.length > 0) {
    hasRequiredPermissions = requireAll
      ? hasAllPermissions(requiredPermissions)
      : hasAnyPermission(requiredPermissions);
      
    if (!hasRequiredPermissions) {
      console.log('ProtectedRoute - Access denied: missing required permissions');
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // User has all required roles and permissions
  return <>{children}</>;
};

export default ProtectedRoute;
