
import React, { createContext, useContext, useEffect, useRef } from 'react';
import { AuthError, User, Session } from '@supabase/supabase-js';
import { UserRole } from '@/types/userTypes';
import { useAuthProvider } from '@/hooks/auth/useAuthProvider';
import { useAuthOperations } from '@/hooks/auth/useAuthOperations';
import { supabase } from '@/integrations/supabase/client';

// Special admin email that should always have access
const PROTECTED_ADMIN_EMAIL = 'alan@insight-ai-systems.com';

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
      } catch (error) {
        console.error('Exception calling handle_user_signin function:', error);
      }
    }
  };

  const hasRole = (role: string): boolean => {
    // Check cache first
    const cacheKey = `${user?.id || 'anonymous'}-${role}`;
    
    if (roleCache.current[cacheKey] !== undefined) {
      console.log(`DEBUG - Using cached hasRole result for ${role}:`, roleCache.current[cacheKey]);
      return roleCache.current[cacheKey];
    }
    
    // Enhanced debug logging
    console.log('DEBUG - hasRole check:', {
      requestedRole: role,
      currentUserEmail: user?.email,
      protectedAdminEmail: PROTECTED_ADMIN_EMAIL,
      isProtectedAdmin: user?.email === PROTECTED_ADMIN_EMAIL,
      currentUserRole: userRole,
      availableRoles: userRoles,
      rolesLoaded
    });
    
    // Always give access to the protected admin email
    if (user?.email === PROTECTED_ADMIN_EMAIL) {
      console.log('DEBUG - Protected admin email detected, granting access');
      roleCache.current[cacheKey] = true;
      return true;
    }
    
    // Super admin can access all roles
    if (userRole === 'super_admin') {
      console.log('DEBUG - Super admin detected, granting access');
      roleCache.current[cacheKey] = true;
      return true;
    }
    
    // Exact role match
    if (userRole === role) {
      console.log(`DEBUG - Exact role match: ${userRole} = ${role}`);
      roleCache.current[cacheKey] = true;
      return true;
    }
    
    // Check role array as fallback
    const hasRoleInArray = userRoles.includes(role);
    console.log(`DEBUG - Role array check: ${role} in [${userRoles.join(', ')}] = ${hasRoleInArray}`);
    
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
    signOut: auth.signOut,
    resetPassword: auth.resetPassword,
    updatePassword: auth.updatePassword,
    refreshSession: auth.refreshSession,
    isAuthenticated,
    isAdmin: userRole === 'super_admin' || user?.email === PROTECTED_ADMIN_EMAIL,
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
