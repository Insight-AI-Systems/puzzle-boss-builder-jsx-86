
import React from 'react';
import { useUser } from '@clerk/clerk-react';
import { Navigate, useLocation } from 'react-router-dom';

interface ClerkProtectedRouteProps {
  children: React.ReactNode;
}

export const ClerkProtectedRoute: React.FC<ClerkProtectedRouteProps> = ({ children }) => {
  const { isSignedIn, isLoaded } = useUser();
  const location = useLocation();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
