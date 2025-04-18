
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { usePermissions } from '@/hooks/usePermissions';
import { UserRole } from '@/types/userTypes';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
  requiredPermissions?: string[];
  requireAllPermissions?: boolean;
}

/**
 * ProtectedRoute - Component to protect routes that require authentication
 * 
 * Also supports role-based and permission-based access control
 * 
 * @param children The components to render when authenticated and authorized
 * @param requiredRoles Optional array of roles allowed to access this route
 * @param requiredPermissions Optional array of permissions required to access this route
 * @param requireAllPermissions Whether all permissions are required (true) or any permission is sufficient (false)
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRoles = [],
  requiredPermissions = [],
  requireAllPermissions = false
}) => {
  const { isAuthenticated, isLoading, hasRole } = useAuth();
  const { hasAllPermissions, hasAnyPermission } = usePermissions();
  const location = useLocation();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 text-puzzle-aqua animate-spin" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    // Save the location they were trying to access
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Check for required roles if specified
  if (requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.some(role => hasRole(role));
    
    if (!hasRequiredRole) {
      // Redirect to unauthorized page if user doesn't have required role
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Check for required permissions if specified
  if (requiredPermissions.length > 0) {
    const hasRequiredPermissions = requireAllPermissions
      ? hasAllPermissions(requiredPermissions)
      : hasAnyPermission(requiredPermissions);
    
    if (!hasRequiredPermissions) {
      // Redirect to unauthorized page if user doesn't have required permissions
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // If authenticated and authorized, render the children
  return <>{children}</>;
};
