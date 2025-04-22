import React, { createContext, useContext, useEffect } from 'react';
import { AuthError, User, Session } from '@supabase/supabase-js';
import { UserRole } from '@/types/userTypes';
import { useAuthProvider } from '@/hooks/auth/useAuthProvider';
import { useAuthOperations } from '@/hooks/auth/useAuthOperations';
import { supabase } from '@/integrations/supabase/client';

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
    clearAuthError,
    fetchUserRoles,
    setError,
    lastAuthAttempt,
    setLastAuthAttempt,
    MIN_TIME_BETWEEN_AUTH_ATTEMPTS,
    toast,
    navigate
  } = useAuthProvider();

  const {
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    refreshSession
  } = useAuthOperations({
    lastAuthAttempt,
    setLastAuthAttempt,
    MIN_TIME_BETWEEN_AUTH_ATTEMPTS,
    setError,
    toast,
    navigate,
    fetchUserRoles
  });

  useEffect(() => {
    if (session?.user) {
      setTimeout(() => {
        fetchUserRoles(session.user.id);
      }, 0);
    }
  }, [session?.user]);

  const handleSignIn = async (email: string, password: string, options?: { rememberMe?: boolean }) => {
    await signIn(email, password, options);
    
    // If sign-in was successful and we have a user session, update the last_sign_in
    if (session?.user) {
      try {
        await supabase.functions.invoke('handle_user_signin', {
          body: { userId: session.user.id }
        });
      } catch (error) {
        console.error('Error updating last sign in time:', error);
      }
    }
  };

  const hasRole = (role: string): boolean => {
    console.log('AuthContext - Checking role:', role);
    console.log('AuthContext - Current User Email:', user?.email);
    console.log('AuthContext - Current User Role:', userRole);
    
    // CRITICAL: Special case for Alan - always grant all roles
    if (user?.email === 'alan@insight-ai-systems.com') {
      console.log('AuthContext - Protected super admin email detected, granting all roles');
      return true;
    }
    
    // Super admin can access all roles
    if (userRole === 'super_admin') {
      console.log('AuthContext - Super admin detected, granting access to all roles');
      return true;
    }
    
    // Exact role match
    if (userRole === role) {
      console.log(`AuthContext - User has exact role: ${role}`);
      return true;
    }
    
    // Admin can access all non-super-admin roles
    if (userRole === 'admin' && role !== 'super_admin') {
      console.log(`AuthContext - Admin granted access to role: ${role}`);
      return true;
    }
    
    // Check role array as fallback
    const hasRoleInArray = userRoles.includes(role);
    console.log(`AuthContext - Role ${role} check from array: ${hasRoleInArray}`);
    return hasRoleInArray;
  };

  const value: AuthContextType = {
    user,
    session,
    isLoading,
    error,
    signIn: handleSignIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    refreshSession,
    isAuthenticated,
    isAdmin,
    hasRole,
    userRole,
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
