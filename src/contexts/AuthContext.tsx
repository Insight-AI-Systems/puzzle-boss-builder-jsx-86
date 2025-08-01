
import React, { createContext, useContext } from 'react';
import { useAuthProvider } from '@/hooks/auth/useAuthProvider';

interface AuthContextType {
  user: any;
  profile: any;
  isLoading: boolean;
  isAdmin: boolean;
  isAuthenticated: boolean;
  userRole: string;
  hasRole: (role: string) => boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  let authData;
  
  try {
    authData = useAuthProvider();
  } catch (error) {
    console.error('❌ AuthProvider: Failed to initialize Supabase auth:', error);
    // Provide safe fallback values
    authData = {
      user: null,
      session: null,
      profile: null,
      isLoading: true,
      isAdmin: false,
      isAuthenticated: false,
      userRole: 'player',
      userRoles: [],
      hasRole: () => false,
      clearAuthError: () => {},
      fetchUserRoles: async () => {},
      setError: () => {},
      setLastAuthAttempt: () => {},
      MIN_TIME_BETWEEN_AUTH_ATTEMPTS: 0,
      toast: () => {},
      roleCache: new Map(),
      error: null
    };
  }
  
  const contextValue: AuthContextType = {
    user: authData.user,
    profile: authData.profile,
    isLoading: authData.isLoading,
    isAdmin: authData.isAdmin,
    isAuthenticated: authData.isAuthenticated,
    userRole: authData.userRole,
    hasRole: authData.hasRole,
    signOut: async () => {
      // Supabase sign out will be handled by the auth provider
      try {
        const { supabase } = await import('@/integrations/supabase/client');
        await supabase.auth.signOut();
      } catch (error) {
        console.error('Sign out error:', error);
      }
    }
  };
  
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
