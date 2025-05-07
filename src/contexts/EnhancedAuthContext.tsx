
import React, { createContext, useContext } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { UserRole } from '@/types/userTypes';
import { useEnhancedAuth } from '@/hooks/auth/useEnhancedAuth';

export interface EnhancedAuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  error: AuthError | Error | null;
  
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, metadata?: { [key: string]: any }) => Promise<any>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  refreshSession: () => Promise<any>;
  
  isAuthenticated: boolean;
  isAdmin: boolean;
  hasRole: (role: string) => boolean;
  hasPermission: (permission: string) => boolean;
  userRole: UserRole | null;
  permissions: string[];
  isInitialized: boolean;
  
  invalidateOtherSessions: () => Promise<any>;
  verifyAdminAccess: () => Promise<boolean>;
  requireMfaForAdmin: (mfaCode?: string) => Promise<{ mfaRequired: boolean; mfaVerified: boolean }>;
  
  clearAuthError: () => void;
}

export const EnhancedAuthContext = createContext<EnhancedAuthContextType | undefined>(undefined);

export function EnhancedAuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useEnhancedAuth();
  
  return (
    <EnhancedAuthContext.Provider value={auth}>
      {children}
    </EnhancedAuthContext.Provider>
  );
}

export function useEnhancedAuthContext() {
  const context = useContext(EnhancedAuthContext);
  
  if (!context) {
    throw new Error('useEnhancedAuthContext must be used within an EnhancedAuthProvider');
  }
  
  return context;
}
