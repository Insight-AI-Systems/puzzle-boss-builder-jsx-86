
import React from 'react';
import { useUser } from '@clerk/clerk-react';
import { Navigate, useLocation } from 'react-router-dom';
import { UserRole } from '@/types/userTypes';
import { Loader2 } from 'lucide-react';
import { useClerkAuth } from '@/hooks/useClerkAuth';

interface ClerkProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
}

export const ClerkProtectedRoute: React.FC<ClerkProtectedRouteProps> = ({ 
  children, 
  requiredRoles = [] 
}) => {
  const { isSignedIn, isLoaded, user } = useUser();
  const { hasRole, isAdmin, isLoading } = useClerkAuth();
  const location = useLocation();

  console.log('🛡️ ClerkProtectedRoute:', {
    isLoaded,
    isSignedIn,
    isLoading,
    isAdmin,
    requiredRoles,
    pathname: location.pathname,
    userEmail: user?.primaryEmailAddress?.emailAddress
  });

  if (!isLoaded || isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-puzzle-aqua" />
          <p className="mt-4 text-gray-400">Loading authentication...</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Enhanced role checking with admin prioritization
  if (requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.some(role => 
      hasRole(role) || isAdmin
    );

    console.log('🛡️ Role check:', {
      requiredRoles,
      hasRequiredRole,
      isAdmin,
      userEmail: user?.primaryEmailAddress?.emailAddress
    });

    if (!hasRequiredRole) {
      console.log('🚫 Access denied - insufficient role');
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};
