
import React, { createContext, useContext, useEffect } from 'react';
import { AuthError, User, Session } from '@supabase/supabase-js';
import { UserRole } from '@/types/userTypes';
import { useAuthProvider } from '@/hooks/auth/useAuthProvider';
import { useAuthOperations } from '@/hooks/auth/useAuthOperations';

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

  const hasRole = (role: string): boolean => {
    // Special case check for super_admin
    if (userRole === 'super_admin') {
      console.log('hasRole - User is super_admin, granting access to all roles');
      return true;
    }
    
    // Special case for protected admin email
    if (user?.email === 'alan@insight-ai-systems.com') {
      console.log('hasRole - Protected admin email detected, granting access to all roles');
      return true;
    }
    
    // Role-specific check
    if (userRole === role) {
      console.log(`hasRole - User has exact role: ${role}`);
      return true;
    }
    
    // Admin has access to all non-super_admin roles
    if (userRole === 'admin' && role !== 'super_admin') {
      console.log(`hasRole - Admin granted access to role: ${role}`);
      return true;
    }
    
    // Check user roles array as a fallback
    const hasRoleInArray = userRoles.includes(role);
    console.log(`hasRole - Role ${role} check from array: ${hasRoleInArray}`);
    return hasRoleInArray;
  };

  const value: AuthContextType = {
    user,
    session,
    isLoading,
    error,
    signIn,
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
