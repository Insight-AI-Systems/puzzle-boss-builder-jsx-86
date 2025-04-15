
import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import Loading from '@/components/ui/loading';
import { hasRole } from '@/utils/permissions';

/**
 * Enhanced component that protects routes based on user role
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if authorized
 * @param {string|string[]} props.allowedRoles - Role or array of roles allowed to access
 * @param {string} [props.redirectTo="/"] - Path to redirect to if unauthorized
 * @param {boolean} [props.bypassInDevMode=true] - Whether to bypass role check in development
 */
const RoleProtectedRoute = ({ 
  children, 
  allowedRoles, 
  redirectTo = "/",
  bypassInDevMode = true
}) => {
  const [authError, setAuthError] = useState(null);
  const [authTimeout, setAuthTimeout] = useState(false);
  const navigate = useNavigate();
  
  // Get auth state from context with error handling
  let auth = { loading: true, user: null, profile: null };
  try {
    auth = useAuth();
  } catch (error) {
    console.error('Error using auth context:', error);
    setAuthError(error);
  }
  
  const { user, loading, profile } = auth;
  
  // Convert allowedRoles to array if it's a string
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  
  useEffect(() => {
    console.log('RoleProtectedRoute: Current state', { 
      loading, 
      user: user ? 'Logged in' : 'Not logged in', 
      profile: profile || 'No profile',
      allowedRoles: roles,
      error: authError?.message || null
    });
  }, [loading, user, profile, roles, authError]);
  
  // Safety timeout to prevent infinite loading
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (loading) {
        console.warn('RoleProtectedRoute: Loading timeout reached');
        setAuthTimeout(true);
      }
    }, 5000); // 5 second timeout
    
    return () => clearTimeout(timeoutId);
  }, [loading]);
  
  // Check for app modes that bypass role checks
  const isBypassMode = () => {
    // Bypass auth in special modes (minimal, emergency) or in development with flag
    const url = new URL(window.location.href);
    return (
      url.searchParams.has('minimal') || 
      url.searchParams.has('mode') && ['minimal', 'emergency'].includes(url.searchParams.get('mode')) ||
      bypassInDevMode && process.env.NODE_ENV === 'development' && url.searchParams.has('bypass-auth')
    );
  };
  
  // If we're in a special mode that bypasses auth, render children
  if (isBypassMode()) {
    console.log('RoleProtectedRoute: Bypassing role check due to special mode');
    return children;
  }
  
  // If we have an auth context error, show error state
  if (authError) {
    console.error('RoleProtectedRoute: Auth context error:', authError);
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
    console.log('RoleProtectedRoute: Loading auth state');
    
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
    
    return <Loading />;
  }
  
  // Redirect to auth page if not logged in
  if (!user) {
    console.log('RoleProtectedRoute: User not logged in, redirecting to /auth');
    return <Navigate to="/auth" replace />;
  }
  
  // If we have a user but no profile yet, show loading
  if (!profile) {
    console.log('RoleProtectedRoute: User logged in but profile not loaded yet');
    return <Loading message="Loading user profile..." />;
  }
  
  // Check if user has the required role(s)
  const hasRequiredRole = roles.some(role => hasRole(profile, role));
  
  // For development, bypass role check if configured
  if (!hasRequiredRole) {
    console.log(`RoleProtectedRoute: User role ${profile.role} not in allowed roles: ${roles.join(', ')}`);
    
    // Use development bypass if enabled
    if (bypassInDevMode && process.env.NODE_ENV === 'development') {
      console.log('RoleProtectedRoute: DEVELOPMENT MODE - allowing access despite role mismatch');
      return children;
    }
    
    // Enforce role restriction in production
    return <Navigate to={redirectTo} replace />;
  }

  console.log('RoleProtectedRoute: Access granted');
  // User is authenticated and has the required role, render children
  return children;
};

export default RoleProtectedRoute;
