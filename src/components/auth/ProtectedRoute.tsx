import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useSecurity } from '@/hooks/useSecurityContext';
import { SecurityEventType } from '@/utils/security/auditLogging';
import { UserRole } from '@/types/userTypes';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRoles = [] 
}) => {
  const { isAuthenticated, isLoading, hasRole, rolesLoaded, user } = useAuth();
  const { logSecurityEvent, validateAdminAccess } = useSecurity();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  // Check admin access and role authorization
  useEffect(() => {
    // Skip checks if still loading auth state
    if (isLoading || !rolesLoaded) return;

    // Skip checks if not authenticated
    if (!isAuthenticated) {
      setIsAuthorized(false);
      return;
    }

    // Check if admin access is required
    const adminRoleRequired = requiredRoles.includes('super_admin' as UserRole);

    // If admin role is required, validate it securely
    if (adminRoleRequired) {
      const checkAdminAccess = async () => {
        const isAdminResult = await validateAdminAccess();
        setIsAdmin(isAdminResult);
        
        // If admin access is validated, we're authorized
        if (isAdminResult) {
          setIsAuthorized(true);
          return;
        }
        
        // Otherwise, check other roles if any
        if (requiredRoles.length > 1) {
          const nonAdminRoles = requiredRoles.filter(role => role !== 'super_admin');
          const hasRequiredRole = await Promise.all(
            nonAdminRoles.map(async role => await hasRole(role))
          ).then(results => results.some(Boolean));
          
          setIsAuthorized(hasRequiredRole);
        } else {
          // Only admin role was required and we don't have it
          setIsAuthorized(false);
        }
      };
      
      checkAdminAccess();
    } else {
      // No admin role required, check other roles
      const checkOtherRoles = async () => {
        if (requiredRoles.length === 0) {
          // No specific roles required, just authentication
          setIsAuthorized(true);
          return;
        }
        
        const hasRequiredRole = await Promise.all(
          requiredRoles.map(async role => await hasRole(role))
        ).then(results => results.some(Boolean));
        
        setIsAuthorized(hasRequiredRole);
      };
      
      checkOtherRoles();
    }
  }, [isAuthenticated, isLoading, rolesLoaded, user, requiredRoles, hasRole, validateAdminAccess]);

  // Log access attempts when authorization status changes
  useEffect(() => {
    if (isAuthorized !== null && user) {
      logSecurityEvent({
        eventType: isAuthorized ? SecurityEventType.LOGIN_SUCCESS : SecurityEventType.PERMISSION_DENIED,
        userId: user.id,
        email: user.email,
        severity: isAuthorized ? 'info' : 'warning',
        details: {
          route: window.location.pathname,
          requiredRoles: requiredRoles.length > 0 ? requiredRoles : ['authenticated'],
          result: isAuthorized ? 'granted' : 'denied'
        }
      });
    }
  }, [isAuthorized, user, requiredRoles, logSecurityEvent]);

  // Still loading auth state or checking permissions
  if (isLoading || !rolesLoaded || isAuthorized === null) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-puzzle-aqua" />
          <p className="mt-4 text-gray-400">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    // Redirect to auth page but save the current location
    return <Navigate to="/auth" state={{ from: window.location }} replace />;
  }

  // Check authorization result
  if (!isAuthorized) {
    return <Navigate to="/unauthorized" replace />;
  }

  // All checks passed, render children
  return <>{children}</>;
};

export default ProtectedRoute;
