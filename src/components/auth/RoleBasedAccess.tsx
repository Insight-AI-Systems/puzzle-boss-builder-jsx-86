
import React, { ReactNode, useEffect } from 'react';
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
  const { user, hasRole, isAdmin } = useAuth();
  const { hasPermission, hasAllPermissions, hasAnyPermission } = usePermissions();

  // Add enhanced debugging
  useEffect(() => {
    console.log('RoleBasedAccess - Component mounted:', {
      user: !!user,
      isAdmin,
      allowedRoles,
      requiredPermissions
    });
  }, [user, isAdmin, allowedRoles, requiredPermissions]);

  // Not authenticated
  if (!user) {
    console.log('RoleBasedAccess - User not authenticated, rendering fallback');
    return <>{fallback}</>;
  }

  // Check roles if specified
  const hasRequiredRole = allowedRoles.length === 0 || 
    allowedRoles.some(role => hasRole(role)) ||
    isAdmin;

  console.log('RoleBasedAccess - Role check result:', { 
    hasRequiredRole,
    isAdmin,
    allowedRoles: allowedRoles.join(', ')
  });

  // Check permissions if specified
  let hasRequiredPermissions = true;
  if (requiredPermissions.length > 0) {
    hasRequiredPermissions = requireAllPermissions
      ? hasAllPermissions(requiredPermissions)
      : hasAnyPermission(requiredPermissions);
    
    console.log('RoleBasedAccess - Permission check result:', { hasRequiredPermissions });
  }

  // Render children only if user has required role AND permissions
  if (hasRequiredRole && hasRequiredPermissions) {
    console.log('RoleBasedAccess - Access granted, rendering children');
    return <>{children}</>;
  }

  console.log('RoleBasedAccess - Access denied, rendering fallback');
  return <>{fallback}</>;
};

export default RoleBasedAccess;
