
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/types/userTypes';

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  error: AuthError | null;
  isAuthenticated: boolean;
  userRole: UserRole | null;
  userRoles: UserRole[];
  isAdmin: boolean;
  rolesLoaded: boolean;
  hasRole: (role: UserRole) => boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  refreshSession: () => Promise<void>;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export { AuthContext };

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [rolesLoaded, setRolesLoaded] = useState(false);

  const isAuthenticated = !!user;
  const isAdmin = userRole === 'admin' || userRole === 'super_admin';

  const hasRole = (role: UserRole): boolean => {
    return userRoles.includes(role);
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
        
        if (session?.user) {
          setTimeout(async () => {
            try {
              const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', session.user.id)
                .single();
              
              if (profile) {
                const role = profile.role as UserRole;
                setUserRole(role);
                setUserRoles([role]);
              }
              setRolesLoaded(true);
            } catch (error) {
              console.error('Error fetching user role:', error);
              setRolesLoaded(true);
            }
          }, 0);
        } else {
          setUserRole(null);
          setUserRoles([]);
          setRolesLoaded(false);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) setError(error);
  };

  const signUp = async (email: string, password: string) => {
    setError(null);
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) setError(error);
  };

  const signOut = async () => {
    setError(null);
    const { error } = await supabase.auth.signOut();
    if (error) setError(error);
  };

  const resetPassword = async (email: string) => {
    setError(null);
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) setError(error);
  };

  const updatePassword = async (password: string) => {
    setError(null);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) setError(error);
  };

  const refreshSession = async () => {
    setError(null);
    const { error } = await supabase.auth.refreshSession();
    if (error) setError(error);
  };

  const clearAuthError = () => {
    setError(null);
  };

  const value: AuthContextType = {
    user,
    session,
    isLoading,
    error,
    isAuthenticated,
    userRole,
    userRoles,
    isAdmin,
    rolesLoaded,
    hasRole,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    refreshSession,
    clearAuthError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
