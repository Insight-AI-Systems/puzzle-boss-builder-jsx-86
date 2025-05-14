
import React from 'react';
import { useRoles } from '@/contexts/auth/RoleContext';
import { useAuthState } from '@/contexts/auth/AuthStateContext';
import { UserRole } from '@/types/userTypes';

interface RoleBasedAccessProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requiredPermissions?: string[];
  requireAll?: boolean; // If true, require all roles/permissions, otherwise any
  fallback?: React.ReactNode;
}

/**
 * Component that conditionally renders children based on user role and/or permissions
 */
export const RoleBasedAccess: React.FC<RoleBasedAccessProps> = ({
  children,
  allowedRoles = [],
  requiredPermissions = [],
  requireAll = false,
  fallback = null,
}) => {
  const { user } = useAuthState();
  const { 
    hasRole,
    isAdmin,
    hasPermission,
    hasAllPermissions,
    hasAnyPermission
  } = useRoles();

  // Not authenticated
  if (!user) {
    return <>{fallback}</>;
  }

  // Check roles if specified
  let hasRequiredRole = true;
  if (allowedRoles.length > 0) {
    hasRequiredRole = isAdmin || (requireAll
      ? allowedRoles.every(role => hasRole(role))
      : allowedRoles.some(role => hasRole(role)));
  }

  // Check permissions if specified
  let hasRequiredPermissions = true;
  if (requiredPermissions.length > 0) {
    hasRequiredPermissions = requireAll
      ? hasAllPermissions(requiredPermissions)
      : hasAnyPermission(requiredPermissions);
  }

  // Render children only if user has required role AND permissions
  if (hasRequiredRole && hasRequiredPermissions) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
};

export default RoleBasedAccess;
