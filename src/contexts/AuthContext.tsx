
import React, { createContext, useContext } from 'react';
import { useClerkAuth } from '@/hooks/useClerkAuth';

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
  const authData = useClerkAuth();
  
  const contextValue: AuthContextType = {
    user: authData.user,
    profile: authData.profile,
    isLoading: authData.isLoading,
    isAdmin: authData.isAdmin,
    isAuthenticated: authData.isAuthenticated,
    userRole: authData.userRole,
    hasRole: authData.hasRole,
    signOut: authData.signOut
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
