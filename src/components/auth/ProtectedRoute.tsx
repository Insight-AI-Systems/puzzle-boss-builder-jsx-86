
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
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
  const { isAuthenticated, isLoading, hasRole, rolesLoaded } = useAuth();
  
  console.log('ProtectedRoute - Debug:', {
    isAuthenticated,
    isLoading,
    rolesLoaded,
    requiredRoles
  });

  if (isLoading || !rolesLoaded) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-puzzle-aqua" />
          <p className="mt-4 text-gray-400">Loading authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('ProtectedRoute - User not authenticated, redirecting to auth page');
    return <Navigate to="/auth" replace />;
  }

  // If roles are specified, check if user has any of them
  if (requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.some(role => hasRole(role));
    console.log('ProtectedRoute - Role check:', {
      requiredRoles,
      hasRequiredRole
    });

    if (!hasRequiredRole) {
      console.log('ProtectedRoute - User lacks required role, redirecting to unauthorized page');
      return <Navigate to="/unauthorized" replace />;
    }
  }

  console.log('ProtectedRoute - Access granted, rendering children');
  return <>{children}</>;
};

export default ProtectedRoute;
