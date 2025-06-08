
import React, { createContext, useContext } from 'react';

export interface AuthContextType {
  user: { id: string; email?: string } | null;
  userRole: string;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  session: any;
  error: Error | null;
  rolesLoaded: boolean;
  hasRole: (role: string) => boolean;
  signUp: (email: string, password: string, options?: any) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<any>;
  resetPassword: (email: string) => Promise<any>;
  updatePassword: (password: string) => Promise<any>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const contextValue: AuthContextType = {
    user: null,
    userRole: 'player',
    isAuthenticated: false,
    isLoading: false,
    isAdmin: false,
    session: null,
    error: null,
    rolesLoaded: true,
    hasRole: () => false,
    signUp: async () => ({ error: new Error('Authentication not configured') }),
    signIn: async () => ({ error: new Error('Authentication not configured') }),
    signOut: async () => ({ error: new Error('Authentication not configured') }),
    resetPassword: async () => ({ error: new Error('Authentication not configured') }),
    updatePassword: async () => ({ error: new Error('Authentication not configured') }),
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
