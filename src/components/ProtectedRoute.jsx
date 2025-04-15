
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import Loading from '@/components/ui/loading';

/**
 * Enhanced Protected Route with error handling, timeout detection,
 * and comprehensive minimal mode support
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
  const [loadingState, setLoadingState] = useState('initializing');
  
  // Get auth state from context with enhanced error handling
  let auth = { loading: true, user: null, profile: null };
  try {
    auth = useAuth();
  } catch (error) {
    console.error('ProtectedRoute: Error using auth context:', error);
    setAuthError(error);
  }
  
  const { user, loading, profile } = auth;

  // Enhanced logging for debugging
  useEffect(() => {
    console.log('ProtectedRoute: Current state', { 
      loading, 
      loadingState,
      user: user ? 'Present' : 'Not present', 
      profile: profile ? 'Present' : 'Not present',
      requiredRole,
      error: authError?.message || null
    });
    
    if (loading) {
      setLoadingState('authenticating');
    } else if (user && requiredRole && !profile) {
      setLoadingState('loading-profile');
    } else if (user && !requiredRole) {
      setLoadingState('authenticated');
    } else if (user && requiredRole && profile) {
      setLoadingState('checking-permissions');
    } else if (!user && !loading) {
      setLoadingState('unauthenticated');
    }
  }, [loading, user, profile, requiredRole, authError]);
  
  // Set up timeout for auth loading
  useEffect(() => {
    // Safety timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      if (loading) {
        console.warn('ProtectedRoute: Auth loading timeout reached after 5 seconds');
        setAuthTimeout(true);
      }
    }, 5000); // 5 second timeout
    
    return () => clearTimeout(timeoutId);
  }, [loading]);

  // Check for app modes that bypass auth
  const isBypassMode = () => {
    // Enhanced bypass mode detection
    try {
      const url = new URL(window.location.href);
      
      // Check URL parameters
      const hasMinimalParam = url.searchParams.has('minimal');
      const modeParam = url.searchParams.get('mode');
      const hasBypassAuth = process.env.NODE_ENV === 'development' && url.searchParams.has('bypass-auth');
      
      // Check explicit bypass flags
      const bypassAuth = hasMinimalParam || 
        (modeParam && ['minimal', 'emergency'].includes(modeParam)) ||
        hasBypassAuth;
      
      if (bypassAuth) {
        console.log(`ProtectedRoute: Bypassing auth check due to ${
          hasMinimalParam ? 'minimal' : 
          modeParam ? `${modeParam} mode` : 
          'bypass-auth'
        } parameter`);
      }
      
      return bypassAuth;
    } catch (error) {
      console.error('ProtectedRoute: Error checking bypass mode:', error);
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
    console.error('ProtectedRoute: Auth context error:', authError);
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
    console.log(`ProtectedRoute: Loading auth state (${loadingState})`);
    
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
      'checking-permissions': 'Checking permissions...',
      'user-continued': 'Still trying to authenticate...'
    };
    
    return <Loading color="aqua" message={loadingMessages[loadingState] || 'Verifying access...'} />;
  }

  // If loading is undefined, show error
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
