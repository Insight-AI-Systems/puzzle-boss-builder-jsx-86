
import React, { createContext, useContext, useEffect } from 'react';
import { AuthError, User, Session } from '@supabase/supabase-js';
import { UserRole } from '@/types/userTypes';
import { useAuthProvider } from '@/hooks/auth/useAuthProvider';
import { useAuthOperations } from '@/hooks/auth/useAuthOperations';
import { supabase } from '@/integrations/supabase/client';
import { useSecurity } from '@/hooks/useSecurityContext';
import { SecurityEventType } from '@/utils/security/auditLogging';

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  error: AuthError | Error | null;
  
  signIn: (email: string, password: string, options?: { rememberMe?: boolean }) => Promise<void>;
  signUp: (email: string, password: string, metadata?: { [key: string]: any }) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  refreshSession: () => Promise<void>;
  
  isAuthenticated: boolean;
  isAdmin: boolean;
  hasRole: (role: string) => boolean;
  userRole: UserRole | null;
  userRoles: string[];
  rolesLoaded: boolean;
  
  clearAuthError: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const {
    user,
    session,
    isLoading,
    error,
    isAuthenticated,
    isAdmin,
    userRole,
    userRoles,
    rolesLoaded,
    clearAuthError,
    fetchUserRoles,
    setError,
    lastAuthAttempt,
    setLastAuthAttempt,
    MIN_TIME_BETWEEN_AUTH_ATTEMPTS,
    toast,
    roleCache
  } = useAuthProvider();

  const securityContext = useSecurity();

  // Implement authentication operations without useNavigate dependencies
  const auth = useAuthOperations({
    lastAuthAttempt,
    setLastAuthAttempt,
    MIN_TIME_BETWEEN_AUTH_ATTEMPTS,
    setError,
    toast,
    fetchUserRoles
  });

  // Role initialization - only fetch roles if not loaded
  useEffect(() => {
    if (session?.user && !rolesLoaded) {
      console.log('AuthProvider - Fetching roles for user:', session.user.id);
      setTimeout(() => {
        fetchUserRoles(session.user.id);
      }, 0);
    }
  }, [session?.user, fetchUserRoles, rolesLoaded]);

  const handleSignIn = async (email: string, password: string, options?: { rememberMe?: boolean }) => {
    try {
      await auth.signIn(email, password, options);
      
      // If sign-in was successful and we have a user session, update the last_sign_in
      if (session?.user) {
        try {
          console.log('Calling handle_user_signin edge function for user:', session.user.id);
          const response = await supabase.functions.invoke('handle_user_signin', {
            body: { userId: session.user.id }
          });
          
          if (response.error) {
            console.error('Error updating last sign in time:', response.error);
          } else {
            console.log('Successfully updated last sign in time:', response.data);
          }

          // Log successful login
          securityContext.logSecurityEvent({
            eventType: SecurityEventType.LOGIN_SUCCESS,
            userId: session.user.id,
            email: session.user.email,
            severity: 'info',
            details: {
              method: 'password',
              timestamp: new Date().toISOString()
            }
          });

          // Update session state and refresh CSRF token
          await securityContext.refreshCsrf();
          
        } catch (error) {
          console.error('Exception calling handle_user_signin function:', error);
        }
      }
    } catch (error) {
      // Log failed login attempt
      securityContext.logSecurityEvent({
        eventType: SecurityEventType.LOGIN_FAILURE,
        email,
        severity: 'warning',
        details: {
          method: 'password',
          reason: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString()
        }
      });
    }
  };

  const handleSignOut = async () => {
    if (user) {
      // Log the sign out event before actually signing out
      await securityContext.logSecurityEvent({
        eventType: SecurityEventType.LOGOUT,
        userId: user.id,
        email: user.email,
        severity: 'info',
        details: {
          method: 'explicit',
          timestamp: new Date().toISOString()
        }
      });
    }
    
    // Now proceed with the sign out
    await auth.signOut();
  };

  const hasRole = async (role: string): Promise<boolean> => {
    // Check cache first
    const cacheKey = `${user?.id || 'anonymous'}-${role}`;
    
    if (roleCache.current[cacheKey] !== undefined) {
      return roleCache.current[cacheKey];
    }
    
    // Enhanced debug logging
    console.debug('DEBUG - hasRole check:', {
      requestedRole: role,
      currentUserEmail: user?.email,
      currentUserRole: userRole,
      availableRoles: userRoles,
      rolesLoaded
    });
    
    // If requesting admin role, use the secure validation method
    if (role === 'super_admin') {
      const isAdmin = await securityContext.validateAdminAccess();
      roleCache.current[cacheKey] = isAdmin;
      return isAdmin;
    }
    
    // Super admin can access all roles
    if (userRole === 'super_admin') {
      roleCache.current[cacheKey] = true;
      return true;
    }
    
    // Exact role match
    if (userRole === role) {
      roleCache.current[cacheKey] = true;
      return true;
    }
    
    // Check role array as fallback
    const hasRoleInArray = userRoles.includes(role);
    
    // Cache result
    roleCache.current[cacheKey] = hasRoleInArray;
    return hasRoleInArray;
  };

  const value: AuthContextType = {
    user,
    session,
    isLoading,
    error,
    signIn: handleSignIn,
    signUp: auth.signUp,
    signOut: handleSignOut,
    resetPassword: auth.resetPassword,
    updatePassword: auth.updatePassword,
    refreshSession: auth.refreshSession,
    isAuthenticated,
    isAdmin,
    hasRole,
    userRole,
    userRoles,
    rolesLoaded,
    clearAuthError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}
