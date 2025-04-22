
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

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRoles = [],
  requiredPermissions = [],
  requireAllPermissions = false
}) => {
  const { isAuthenticated, isLoading, hasRole, user } = useAuth();
  const { hasAllPermissions, hasAnyPermission } = usePermissions();
  const location = useLocation();

  // Add detailed logging
  console.log('ProtectedRoute - Access Check:', {
    path: location.pathname,
    isAuthenticated,
    isLoading,
    user: user ? { id: user.id, email: user.email } : null,
    requiredRoles,
    requiredPermissions,
    requireAllPermissions
  });

  // Show loading state while checking authentication
  if (isLoading) {
    console.log('ProtectedRoute - Still loading auth state');
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 text-puzzle-aqua animate-spin" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    console.log('ProtectedRoute - User not authenticated, redirecting to login');
    // Save the location they were trying to access
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Enhanced super admin check - Always grant access to super_admin
  if (hasRole('super_admin')) {
    console.log('ProtectedRoute - Super admin detected, granting access');
    return <>{children}</>;
  }

  // Check for required roles if specified
  if (requiredRoles.length > 0) {
    const roleChecks = requiredRoles.map(role => ({ 
      role, 
      hasRole: hasRole(role) 
    }));
    
    console.log('ProtectedRoute - Role checks:', roleChecks);
    
    const hasRequiredRole = roleChecks.some(check => check.hasRole);
    
    if (!hasRequiredRole) {
      console.log('ProtectedRoute - Access denied due to missing required role');
      // Redirect to unauthorized page if user doesn't have required role
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Check for required permissions if specified
  if (requiredPermissions.length > 0) {
    const hasRequiredPermissions = requireAllPermissions
      ? hasAllPermissions(requiredPermissions)
      : hasAnyPermission(requiredPermissions);
    
    console.log('ProtectedRoute - Permission check result:', {
      requiredPermissions,
      requireAll: requireAllPermissions,
      hasRequiredPermissions
    });
    
    if (!hasRequiredPermissions) {
      console.log('ProtectedRoute - Access denied due to missing required permissions');
      // Redirect to unauthorized page if user doesn't have required permissions
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // If authenticated and authorized, render the children
  console.log('ProtectedRoute - Access granted');
  return <>{children}</>;
};
