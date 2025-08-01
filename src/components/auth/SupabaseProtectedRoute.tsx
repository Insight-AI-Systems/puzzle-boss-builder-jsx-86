import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface SupabaseProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
  redirectTo?: string;
}

export const SupabaseProtectedRoute: React.FC<SupabaseProtectedRouteProps> = ({ 
  children, 
  requiredRoles = [], 
  redirectTo = '/auth' 
}) => {
  const { isAuthenticated, isLoading, userRole, hasRole } = useAuth();
  const location = useLocation();

  console.log('SupabaseProtectedRoute:', { isAuthenticated, isLoading, userRole, requiredRoles });

  // Show loading state while authentication is in progress
  if (isLoading) {
    return (
      <div className="min-h-screen bg-puzzle-black flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 text-puzzle-aqua animate-spin" />
          <p className="text-puzzle-white">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to auth if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check role requirements if specified
  if (requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.some(role => hasRole(role));
    
    if (!hasRequiredRole) {
      return (
        <div className="min-h-screen bg-puzzle-black flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <Alert className="border-destructive">
              <AlertDescription className="text-center">
                <h3 className="font-semibold text-destructive mb-2">Access Denied</h3>
                <p className="text-sm text-muted-foreground">
                  You don't have the required permissions to access this page.
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Required: {requiredRoles.join(', ')} | Your role: {userRole}
                </p>
              </AlertDescription>
            </Alert>
          </div>
        </div>
      );
    }
  }

  // Render children if all checks pass
  return <>{children}</>;
};