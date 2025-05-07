
import React, { ReactNode, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';
import { UserRole } from '@/types/userTypes';
import { useSecurity } from '@/hooks/useSecurityContext';
import { SecurityEventType } from '@/utils/security/auditLogging';

type RoleBasedAccessProps = {
  children: ReactNode;
  allowedRoles?: UserRole[];
  requiredPermissions?: string[];
  requireAllPermissions?: boolean;
  fallback?: ReactNode;
  logAccessAttempts?: boolean;
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
  logAccessAttempts = false
}) => {
  const { user, hasRole } = useAuth();
  const { hasPermission, hasAllPermissions, hasAnyPermission } = usePermissions();
  const { logSecurityEvent, validateAdminAccess } = useSecurity();
  const [isAdmin, setIsAdmin] = React.useState<boolean | null>(null);

  // Check admin access safely using the security edge function
  useEffect(() => {
    const checkAdminAccess = async () => {
      if (user) {
        const adminAccess = await validateAdminAccess();
        setIsAdmin(adminAccess);
      } else {
        setIsAdmin(false);
      }
    };
    
    checkAdminAccess();
  }, [user, validateAdminAccess]);

  // Not authenticated
  if (!user) {
    if (logAccessAttempts) {
      logSecurityEvent({
        eventType: SecurityEventType.PERMISSION_DENIED,
        severity: 'info',
        details: { 
          reason: 'not_authenticated',
          allowedRoles,
          requiredPermissions
        }
      });
    }
    return <>{fallback}</>;
  }

  // Still loading admin status
  if (isAdmin === null) {
    return null; // Or some loading indicator
  }

  // Check roles if specified
  const hasRequiredRole = allowedRoles.length === 0 || 
    allowedRoles.some(role => hasRole(role)) ||
    isAdmin;

  // Check permissions if specified
  let hasRequiredPermissions = true;
  if (requiredPermissions.length > 0) {
    hasRequiredPermissions = isAdmin || (requireAllPermissions
      ? hasAllPermissions(requiredPermissions)
      : hasAnyPermission(requiredPermissions));
  }

  // Log access attempts if enabled
  if (logAccessAttempts) {
    const accessGranted = hasRequiredRole && hasRequiredPermissions;
    logSecurityEvent({
      eventType: accessGranted ? SecurityEventType.PERMISSION_DENIED : SecurityEventType.PERMISSION_DENIED,
      userId: user.id,
      severity: accessGranted ? 'info' : 'warning',
      details: { 
        access: accessGranted ? 'granted' : 'denied',
        allowedRoles,
        requiredPermissions,
        userRoles: allowedRoles.filter(role => hasRole(role)),
        isAdmin
      }
    });
  }

  // Render children only if user has required role AND permissions
  if (hasRequiredRole && hasRequiredPermissions) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
};

export default RoleBasedAccess;
