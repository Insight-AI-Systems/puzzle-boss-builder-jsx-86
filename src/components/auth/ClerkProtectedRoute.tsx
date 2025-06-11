
import React from 'react';
import { useClerkAuth } from '@/hooks/useClerkAuth';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ClerkProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
  redirectTo?: string;
}

export const ClerkProtectedRoute: React.FC<ClerkProtectedRouteProps> = ({
  children,
  requiredRoles = [],
  redirectTo = '/auth'
}) => {
  const { isAuthenticated, isLoading, hasRole, userRole, profile } = useClerkAuth();
  const location = useLocation();

  console.log('🛡️ ClerkProtectedRoute Check:', {
    path: location.pathname,
    isAuthenticated,
    isLoading,
    userRole,
    requiredRoles,
    hasProfile: !!profile
  });

  // Show loading spinner while authentication is being determined
  if (isLoading) {
    return (
      <div className="min-h-screen bg-puzzle-black flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-puzzle-aqua animate-spin" />
      </div>
    );
  }

  // Redirect to auth if not authenticated
  if (!isAuthenticated) {
    console.log('🚫 Not authenticated, redirecting to:', redirectTo);
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check role requirements if specified
  if (requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.some(role => hasRole(role));
    
    console.log('🔐 Role Check:', {
      userRole,
      requiredRoles,
      hasRequiredRole,
      profileRole: profile?.role
    });

    if (!hasRequiredRole) {
      console.log('🚫 Insufficient permissions, current role:', userRole);
      return (
        <div className="min-h-screen bg-puzzle-black p-6 flex items-center justify-center">
          <Alert variant="destructive" className="max-w-md">
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-semibold">Access Denied</p>
                <p>You don't have permission to access this page.</p>
                <div className="text-sm">
                  <p>Your current role: <span className="font-mono">{userRole}</span></p>
                  <p>Required roles: <span className="font-mono">{requiredRoles.join(', ')}</span></p>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Contact an administrator if you believe this is an error.
                </p>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      );
    }
  }

  // All checks passed, render the protected content
  console.log('✅ Access granted for route:', location.pathname);
  return <>{children}</>;
};
