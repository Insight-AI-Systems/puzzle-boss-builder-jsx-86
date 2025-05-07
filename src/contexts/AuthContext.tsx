
import React, { createContext, useContext } from 'react';
import { AuthError, User, Session } from '@supabase/supabase-js';
import { UserRole } from '@/types/userTypes';
import { useEnhancedAuthContext } from './EnhancedAuthContext';

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

// Create the context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  // Use the enhanced auth system
  const {
    user,
    session,
    isLoading,
    error,
    clearAuthError,
    isAuthenticated,
    isAdmin,
    userRole,
    permissions,
    isInitialized,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    refreshSession,
    hasRole,
    hasPermission
  } = useEnhancedAuthContext();

  // Interface adapter to maintain backward compatibility
  const contextValue: AuthContextType = {
    user,
    session,
    isLoading,
    error,
    signIn: async (email, password, options = {}) => {
      await signIn(email, password);
    },
    signUp: async (email, password, metadata = {}) => {
      await signUp(email, password, metadata);
    },
    signOut,
    resetPassword,
    updatePassword,
    refreshSession,
    isAuthenticated,
    isAdmin,
    hasRole,
    userRole,
    userRoles: permissions, // Map permissions to userRoles for backward compatibility
    rolesLoaded: isInitialized && !isLoading,
    clearAuthError
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
