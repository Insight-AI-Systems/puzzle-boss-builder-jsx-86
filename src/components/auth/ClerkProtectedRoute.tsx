
import React from 'react';
import { useUser } from '@clerk/clerk-react';
import { Navigate, useLocation } from 'react-router-dom';
import { UserRole } from '@/types/userTypes';
import { Loader2 } from 'lucide-react';

interface ClerkProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
}

export const ClerkProtectedRoute: React.FC<ClerkProtectedRouteProps> = ({ 
  children, 
  requiredRoles = [] 
}) => {
  const { isSignedIn, isLoaded, user } = useUser();
  const location = useLocation();

  if (!isLoaded) {
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

  // Check roles if specified
  if (requiredRoles.length > 0) {
    const userRoles = (user?.publicMetadata?.roles as string[]) || ['player'];
    const hasRequiredRole = requiredRoles.some(role => 
      userRoles.includes(role) || userRoles.includes('super_admin')
    );

    if (!hasRequiredRole) {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};
