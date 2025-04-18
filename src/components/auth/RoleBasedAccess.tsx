
import React, { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';
import { UserRole } from '@/types/userTypes';

type RoleBasedAccessProps = {
  children: ReactNode;
  allowedRoles?: UserRole[];
  requiredPermissions?: string[];
  requireAllPermissions?: boolean;
  fallback?: ReactNode;
};

/**
 * Component that conditionally renders children based on user role and/or permissions
 */
export const RoleBasedAccess: React.FC<RoleBasedAccessProps> = ({
  children,
  allowedRoles = [],
  requiredPermissions = [],
  requireAllPermissions = false,
  fallback = null,
}) => {
  const { user, hasRole } = useAuth();
  const { hasPermission, hasAllPermissions, hasAnyPermission } = usePermissions();

  // Not authenticated
  if (!user) return <>{fallback}</>;

  // Check roles if specified
  const hasRequiredRole = allowedRoles.length === 0 || 
    allowedRoles.some(role => hasRole(role));

  // Check permissions if specified
  let hasRequiredPermissions = true;
  if (requiredPermissions.length > 0) {
    hasRequiredPermissions = requireAllPermissions
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
