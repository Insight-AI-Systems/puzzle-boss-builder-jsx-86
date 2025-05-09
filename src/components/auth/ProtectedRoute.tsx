
import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useEnhancedAuthContext } from '@/contexts/EnhancedAuthContext';
import { useSecurity } from '@/hooks/useSecurityContext';
import { SecurityEventType } from '@/utils/security/auditLogging';
import { UserRole } from '@/types/userTypes';
import { Loader2 } from 'lucide-react';
import { PROTECTED_ADMIN_EMAIL, isProtectedAdmin } from '@/constants/securityConfig';
import { debugLog, DebugLevel } from '@/utils/debug';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
  requiredPermissions?: string[];
  requireAllPermissions?: boolean;
  logAccess?: boolean;
}

/**
 * Protected Route Component
 * 
 * Controls access to routes based on authentication status, user roles, and permissions
 * Special handling for the protected admin email which always has access
 * 
 * @param props - Component props
 * @returns React component that either redirects or renders protected content
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRoles = [],
  requiredPermissions = [],
  requireAllPermissions = false,
  logAccess = true
}) => {
  const location = useLocation();
  const { isAuthenticated, isLoading, user, hasRole, hasPermission, isInitialized, isAdmin } = useEnhancedAuthContext();
  const { logSecurityEvent } = useSecurity();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  // Always grant access if in development mode
  const isDevelopmentMode = process.env.NODE_ENV === 'development';

  // Check role and permission authorization
  useEffect(() => {
    if (!isInitialized || isLoading) return;

    // Not authenticated
    if (!isAuthenticated) {
      setIsAuthorized(false);
      return;
    }

    // Development mode override
    if (isDevelopmentMode) {
      debugLog('ProtectedRoute', 'Development mode detected, granting access', DebugLevel.INFO, {
        path: location.pathname
      });
      setIsAuthorized(true);
      return;
    }

    // Special case for protected admin email - always authorized for all routes
    const hasProtectedEmail = isProtectedAdmin(user?.email);
    if (hasProtectedEmail) {
      debugLog('ProtectedRoute', 'Protected admin detected, granting access', DebugLevel.INFO, {
        email: user?.email,
        path: location.pathname
      });
      setIsAuthorized(true);
      return;
    }

    // Check roles if specified
    const hasRequiredRole = requiredRoles.length === 0 || 
      requiredRoles.some(role => hasRole(role)) ||
      isAdmin;

    // Check permissions if specified
    let hasRequiredPermissions = true;
    if (requiredPermissions.length > 0) {
      if (isAdmin) {
        // Admin has all permissions
        hasRequiredPermissions = true;
      } else if (requireAllPermissions) {
        // Must have all specified permissions
        hasRequiredPermissions = requiredPermissions.every(perm => hasPermission(perm));
      } else {
        // Must have at least one specified permission
        hasRequiredPermissions = requiredPermissions.some(perm => hasPermission(perm));
      }
    }

    // Set authorization result
    setIsAuthorized(hasRequiredRole && hasRequiredPermissions);

    debugLog('ProtectedRoute', 'Authorization check', DebugLevel.INFO, {
      path: location.pathname,
      hasRequiredRole,
      hasRequiredPermissions,
      isAuthorized: hasRequiredRole && hasRequiredPermissions,
      requiredRoles,
      requiredPermissions
    });

  }, [
    isInitialized, isLoading, isAuthenticated, requiredRoles, requiredPermissions, 
    requireAllPermissions, hasRole, hasPermission, isAdmin, user, location.pathname, isDevelopmentMode
  ]);

  // Log access attempts if enabled
  useEffect(() => {
    if (!logAccess || isAuthorized === null || !user) return;

    // Get the roles that were matched
    const matchedRoles = requiredRoles.filter(role => hasRole(role));
    
    // Get matched permissions
    const matchedPermissions = requiredPermissions.filter(perm => hasPermission(perm));

    // Special case for protected admin
    const hasProtectedEmail = isProtectedAdmin(user.email);
    
    logSecurityEvent({
      eventType: isAuthorized ? SecurityEventType.ACCESS_GRANTED : SecurityEventType.ACCESS_DENIED,
      userId: user.id,
      email: user.email,
      severity: isAuthorized ? 'info' : 'warning',
      details: {
        route: location.pathname,
        requiredRoles: requiredRoles.length > 0 ? requiredRoles : ['any'],
        requiredPermissions: requiredPermissions.length > 0 ? requiredPermissions : [],
        matchedRoles: hasProtectedEmail ? ['protected_admin', ...matchedRoles] : matchedRoles,
        matchedPermissions: matchedPermissions,
        requireAllPermissions,
        result: isAuthorized ? 'granted' : 'denied',
        hasProtectedEmail
      }
    });
  }, [isAuthorized, user, logAccess, logSecurityEvent, location.pathname, requiredRoles, requiredPermissions, requireAllPermissions, hasRole, hasPermission]);

  // Still loading or checking authorization
  if (isLoading || !isInitialized || isAuthorized === null) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-puzzle-aqua" />
          <p className="mt-4 text-gray-400">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Development mode override - Always grant access
  if (isDevelopmentMode) {
    return <>{children}</>;
  }

  // Not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Not authorized
  if (!isAuthorized) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Authorized
  return <>{children}</>;
};

export default ProtectedRoute;
