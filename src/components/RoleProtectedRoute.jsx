
import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import Loading from '@/components/ui/loading';
import { hasRole } from '@/utils/permissions';

/**
 * Enhanced component that protects routes based on user role with improved
 * error handling, timeout detection, and minimal mode support
 * 
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
  const [loadingState, setLoadingState] = useState('initializing');
  const navigate = useNavigate();
  
  // Get auth state from context with enhanced error handling
  let auth = { loading: true, user: null, profile: null };
  try {
    auth = useAuth();
  } catch (error) {
    console.error('RoleProtectedRoute: Error using auth context:', error);
    setAuthError(error);
  }
  
  const { user, loading, profile } = auth;
  
  // Convert allowedRoles to array if it's a string
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  
  // Track loading state for better user feedback
  useEffect(() => {
    console.log('RoleProtectedRoute: Current state', { 
      loading, 
      loadingState,
      user: user ? 'Logged in' : 'Not logged in', 
      profile: profile ? 'Present' : 'Not present',
      allowedRoles: roles,
      error: authError?.message || null
    });
    
    if (loading) {
      setLoadingState('authenticating');
    } else if (user && !profile) {
      setLoadingState('loading-profile');
    } else if (user && profile) {
      setLoadingState('checking-permissions');
    } else if (!user && !loading) {
      setLoadingState('unauthenticated');
    }
  }, [loading, user, profile, roles, authError]);
  
  // Safety timeout to prevent infinite loading
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (loading) {
        console.warn('RoleProtectedRoute: Loading timeout reached after 5 seconds');
        setAuthTimeout(true);
      }
    }, 5000); // 5 second timeout
    
    return () => clearTimeout(timeoutId);
  }, [loading]);
  
  // Enhanced bypass mode check
  const isBypassMode = () => {
    try {
      // Enhanced bypass mode detection
      const url = new URL(window.location.href);
      
      // Check URL parameters
      const hasMinimalParam = url.searchParams.has('minimal');
      const modeParam = url.searchParams.get('mode');
      const hasBypassAuth = bypassInDevMode && process.env.NODE_ENV === 'development' && url.searchParams.has('bypass-auth');
      
      // Check explicit bypass flags
      const bypassAuth = hasMinimalParam || 
        (modeParam && ['minimal', 'emergency'].includes(modeParam)) ||
        hasBypassAuth;
      
      if (bypassAuth) {
        console.log(`RoleProtectedRoute: Bypassing role check due to ${
          hasMinimalParam ? 'minimal' : 
          modeParam ? `${modeParam} mode` : 
          'bypass-auth'
        } parameter`);
      }
      
      return bypassAuth;
    } catch (error) {
      console.error('RoleProtectedRoute: Error checking bypass mode:', error);
      // Default to not bypassing in case of error
      return false;
    }
  };
  
  // If we're in a special mode that bypasses auth, render children
  if (isBypassMode()) {
    return children;
  }
  
  // If we have an auth context error, show enhanced error state
  if (authError) {
    console.error('RoleProtectedRoute: Auth context error:', authError);
    return (
      <div className="p-4 bg-puzzle-burgundy/20 border border-puzzle-burgundy rounded text-white">
        <h3 className="text-xl mb-2">Authentication Error</h3>
        <p className="mb-2">{authError.message}</p>
        <p className="text-sm text-gray-300 mb-4">
          There was a problem with the authentication system. This might be due to network issues,
          session expiration, or a system configuration problem.
        </p>
        <div className="flex gap-2">
          <button 
            onClick={() => window.location.reload()}
            className="px-3 py-1 bg-puzzle-aqua text-black rounded text-sm"
          >
            Reload Page
          </button>
          <button 
            onClick={() => {
              if (window.appRecovery?.switchMode) {
                window.appRecovery.switchMode('minimal');
              } else {
                const url = new URL(window.location.href);
                url.searchParams.set('minimal', 'true');
                window.location.href = url.toString();
              }
            }}
            className="px-3 py-1 bg-puzzle-gold text-black rounded text-sm"
          >
            Try Minimal Mode
          </button>
        </div>
      </div>
    );
  }
  
  // Handle auth loading state with enhanced timeout
  if (loading) {
    console.log(`RoleProtectedRoute: Loading auth state (${loadingState})`);
    
    if (authTimeout) {
      return (
        <div className="p-4 bg-puzzle-burgundy/20 border border-puzzle-burgundy rounded text-white">
          <h3 className="text-xl mb-2">Authentication Timeout</h3>
          <p className="mb-2">Unable to verify authentication status in a reasonable time.</p>
          <p className="text-sm text-gray-300 mb-4">
            This might be due to network issues, service unavailability, or browser privacy settings.
          </p>
          <div className="flex gap-2">
            <button 
              onClick={() => window.location.reload()}
              className="px-3 py-1 bg-puzzle-aqua text-black rounded text-sm"
            >
              Reload Page
            </button>
            <button 
              onClick={() => {
                if (window.appRecovery?.switchMode) {
                  window.appRecovery.switchMode('minimal');
                } else {
                  const url = new URL(window.location.href);
                  url.searchParams.set('minimal', 'true');
                  window.location.href = url.toString();
                }
              }}
              className="px-3 py-1 bg-puzzle-gold text-black rounded text-sm"
            >
              Try Minimal Mode
            </button>
            <button 
              onClick={() => {
                setAuthTimeout(false);
                setLoadingState('user-continued');
              }}
              className="px-3 py-1 bg-white/20 text-white rounded text-sm"
            >
              Continue Waiting
            </button>
          </div>
        </div>
      );
    }
    
    // Show more specific loading messages based on state
    const loadingMessages = {
      'initializing': 'Initializing authentication...',
      'authenticating': 'Verifying your access...',
      'loading-profile': 'Loading your profile...',
      'checking-permissions': 'Checking role permissions...',
      'user-continued': 'Still trying to verify access...'
    };
    
    return <Loading message={loadingMessages[loadingState] || 'Loading...'} />;
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
