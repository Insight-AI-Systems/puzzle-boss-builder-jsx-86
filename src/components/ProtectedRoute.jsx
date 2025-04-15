
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import Loading from '@/components/ui/loading';

/**
 * Enhanced Protected Route with error handling and minimal mode support
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if authorized
 * @param {string} [props.requiredRole] - Optional role required to access this route
 * @param {string} [props.redirectTo="/auth"] - Path to redirect to if unauthorized
 */
const ProtectedRoute = ({ 
  children, 
  requiredRole, 
  redirectTo = "/auth" 
}) => {
  const [authError, setAuthError] = useState(null);
  const [authTimeout, setAuthTimeout] = useState(false);
  
  // Get auth state from context with error handling
  let auth = { loading: true, user: null, profile: null };
  try {
    auth = useAuth();
  } catch (error) {
    console.error('Error using auth context:', error);
    setAuthError(error);
  }
  
  const { user, loading, profile } = auth;

  // Add more detailed logging for debugging
  console.log('ProtectedRoute rendering with:', { 
    loading, 
    user: user ? 'Present' : 'Not present', 
    profile: profile || 'No profile',
    requiredRole,
    error: authError?.message || null
  });
  
  // Set up timeout for auth loading
  useEffect(() => {
    // Safety timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      if (loading) {
        console.warn('ProtectedRoute: Auth loading timeout reached');
        setAuthTimeout(true);
      }
    }, 5000); // 5 second timeout
    
    return () => clearTimeout(timeoutId);
  }, [loading]);

  // Check for app modes that bypass auth
  const isBypassMode = () => {
    // TEMPORARY FIX FOR MINIMAL/EMERGENCY APP: Always render children
    // This ensures the app can load even if auth is broken
    const url = new URL(window.location.href);
    return (
      url.searchParams.has('minimal') || 
      url.searchParams.has('mode') && ['minimal', 'emergency'].includes(url.searchParams.get('mode')) ||
      process.env.NODE_ENV === 'development' && url.searchParams.has('bypass-auth')
    );
  };
  
  // If we're in a special mode that bypasses auth, render children
  if (isBypassMode()) {
    console.log('ProtectedRoute: Bypassing auth check due to special mode');
    return children;
  }

  // If we have an auth context error, show error state
  if (authError) {
    console.error('ProtectedRoute: Auth context error:', authError);
    return (
      <div className="p-4 bg-puzzle-burgundy/20 border border-puzzle-burgundy rounded text-white">
        <h3 className="text-xl mb-2">Authentication Error</h3>
        <p className="mb-2">{authError.message}</p>
        <div className="flex gap-2">
          <button 
            onClick={() => window.location.reload()}
            className="px-3 py-1 bg-puzzle-aqua text-black rounded text-sm"
          >
            Reload Page
          </button>
          <button 
            onClick={() => window.appRecovery?.switchMode('minimal')}
            className="px-3 py-1 bg-puzzle-gold text-black rounded text-sm"
          >
            Try Minimal Mode
          </button>
        </div>
      </div>
    );
  }

  // Handle auth loading state with timeout
  if (loading) {
    console.log('ProtectedRoute: Loading auth state');
    
    if (authTimeout) {
      return (
        <div className="p-4 bg-puzzle-burgundy/20 border border-puzzle-burgundy rounded text-white">
          <h3 className="text-xl mb-2">Authentication Timeout</h3>
          <p className="mb-2">Unable to verify authentication status in a reasonable time.</p>
          <div className="flex gap-2">
            <button 
              onClick={() => window.location.reload()}
              className="px-3 py-1 bg-puzzle-aqua text-black rounded text-sm"
            >
              Reload Page
            </button>
            <button 
              onClick={() => window.appRecovery?.switchMode('minimal')}
              className="px-3 py-1 bg-puzzle-gold text-black rounded text-sm"
            >
              Try Minimal Mode
            </button>
          </div>
        </div>
      );
    }
    
    return <Loading color="aqua" message="Verifying access..." />;
  }

  // Safety check for undefined loading state
  if (loading === undefined) {
    console.error('ProtectedRoute: Auth loading state is undefined');
    return <Loading color="burgundy" message="Authentication system error" />;
  }

  // If user is not logged in, redirect to auth page
  if (!user) {
    console.log('ProtectedRoute: User not logged in, redirecting to', redirectTo);
    return <Navigate to={redirectTo} replace />;
  }

  // If a specific role is required, check if the user has that role
  if (requiredRole && profile?.role !== requiredRole) {
    console.log(`ProtectedRoute: Role mismatch - Current: ${profile?.role}, Required: ${requiredRole}`);
    
    // For now, let's be more permissive during development
    if (process.env.NODE_ENV === 'development') {
      console.log('ProtectedRoute: TEMPORARY - allowing access despite role mismatch (development mode)');
      return children;
    }
    
    // In production, enforce role restrictions
    return <Navigate to="/" replace />;
  }

  console.log('ProtectedRoute: Access granted');
  return children;
};

export default ProtectedRoute;
