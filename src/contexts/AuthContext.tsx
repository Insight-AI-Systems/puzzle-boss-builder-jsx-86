
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
  const enhancedAuth = useEnhancedAuthContext();

  // Interface adapter to maintain backward compatibility
  const contextValue: AuthContextType = {
    user: enhancedAuth.user,
    session: enhancedAuth.session,
    isLoading: enhancedAuth.isLoading,
    error: enhancedAuth.error,
    signIn: async (email, password, options = {}) => {
      await enhancedAuth.signIn(email, password);
    },
    signUp: async (email, password, metadata = {}) => {
      await enhancedAuth.signUp(email, password, metadata);
    },
    signOut: enhancedAuth.signOut,
    resetPassword: enhancedAuth.resetPassword,
    updatePassword: enhancedAuth.updatePassword,
    refreshSession: enhancedAuth.refreshSession,
    isAuthenticated: enhancedAuth.isAuthenticated,
    isAdmin: enhancedAuth.isAdmin,
    hasRole: enhancedAuth.hasRole,
    userRole: enhancedAuth.userRole,
    userRoles: enhancedAuth.permissions, // Map permissions to userRoles for backward compatibility
    rolesLoaded: enhancedAuth.isInitialized && !enhancedAuth.isLoading,
    clearAuthError: enhancedAuth.clearAuthError
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
