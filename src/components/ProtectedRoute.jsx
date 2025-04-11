
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading, profile } = useAuth();

  if (loading) {
    console.log('ProtectedRoute: Loading auth state');
    return (
      <div className="min-h-screen bg-puzzle-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-puzzle-aqua"></div>
      </div>
    );
  }

  if (!user) {
    console.log('ProtectedRoute: User not logged in, redirecting to /auth');
    return <Navigate to="/auth" replace />;
  }

  // If a specific role is required, check if the user has that role
  if (requiredRole && profile?.role !== requiredRole) {
    console.log(`ProtectedRoute: Role mismatch - Current: ${profile?.role}, Required: ${requiredRole}`);
    return <Navigate to="/" replace />;
  }

  console.log('ProtectedRoute: Access granted');
  return children;
};

export default ProtectedRoute;
