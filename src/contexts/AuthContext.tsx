
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { UserRole } from '@/types/userTypes';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  error: string | null;
  userRoles: UserRole[];
  userRole: UserRole | null;
  rolesLoaded: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string, options?: any) => Promise<void>;
  signUp: (email: string, password: string, options?: any) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  hasRole: (role: UserRole) => boolean;
  clearAuthError: () => void;
  refreshSession: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [rolesLoaded, setRolesLoaded] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const getInitialSession = async () => {
      setIsLoading(true);
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        setSession(initialSession);
        setUser(initialSession?.user || null);
        if (initialSession?.user) {
          await fetchUserRoles(initialSession.user.id);
        } else {
          setRolesLoaded(true);
        }
      } catch (error) {
        console.error("Error getting initial session:", error);
        setError(error instanceof Error ? error.message : 'Unknown error');
        setRolesLoaded(true);
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, currentSession: Session | null) => {
        setSession(currentSession);
        setUser(currentSession?.user || null);
        setError(null);
        if (currentSession?.user) {
          await fetchUserRoles(currentSession.user.id);
        } else {
          setUserRoles([]);
          setRolesLoaded(true);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserRoles = async (userId: string) => {
    try {
      console.log('AuthContext - Fetching roles for user:', userId);
      
      // Only make the request if we have a valid session
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      if (!currentSession) {
        console.log('AuthContext - No session available, skipping role fetch');
        setUserRoles([]);
        setRolesLoaded(true);
        return;
      }

      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);

      if (error) {
        console.error('AuthContext - Error fetching user roles:', error);
        setUserRoles([]);
      } else {
        const roles = data?.map(item => item.role as UserRole) || [];
        console.log('AuthContext - Fetched roles:', roles);
        setUserRoles(roles);
      }
    } catch (error) {
      console.error('AuthContext - Exception fetching user roles:', error);
      setUserRoles([]);
    } finally {
      setRolesLoaded(true);
    }
  };

  const signIn = async (email: string, password: string, options?: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        console.error('Authentication error:', error.message);
        setError(error.message);
        toast({
          title: 'Authentication Failed',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        setUser(data.user);
        setSession(data.session);
      }
    } catch (error) {
      console.error('Authentication error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
      setError(errorMessage);
      toast({
        title: 'Authentication Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, options?: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: options,
        },
      });

      if (error) {
        console.error('Signup error:', error.message);
        setError(error.message);
        toast({
          title: 'Signup Failed',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        setUser(data.user);
        setSession(data.session);
        toast({
          title: 'Signup Successful',
          description: 'Please check your email to verify your account.',
        });
      }
    } catch (error) {
      console.error('Signup error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
      setError(errorMessage);
      toast({
        title: 'Signup Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Signout error:', error.message);
        setError(error.message);
        toast({
          title: 'Signout Failed',
          description: error.message,
          variant: 'destructive',
        });
      }
      setUser(null);
      setSession(null);
      setUserRoles([]);
    } catch (error) {
      console.error('Signout error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
      setError(errorMessage);
      toast({
        title: 'Signout Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setError(null);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) {
        setError(error.message);
        throw error;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
      setError(errorMessage);
      throw error;
    }
  };

  const updatePassword = async (password: string) => {
    setError(null);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        setError(error.message);
        throw error;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
      setError(errorMessage);
      throw error;
    }
  };

  const refreshSession = async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) {
        console.error('Session refresh error:', error);
        setError(error.message);
      } else {
        setSession(data.session);
        setUser(data.user);
      }
    } catch (error) {
      console.error('Session refresh error:', error);
      setError(error instanceof Error ? error.message : 'Failed to refresh session');
    }
  };

  const clearAuthError = () => {
    setError(null);
  };

  const hasRole = (role: UserRole): boolean => {
    return userRoles.includes(role);
  };

  const userRole = userRoles.length > 0 ? userRoles[0] : null;
  const isAdmin = userRoles.includes('admin') || userRoles.includes('super_admin');

  const value: AuthContextType = {
    user,
    session,
    isLoading,
    error,
    userRoles,
    userRole,
    rolesLoaded,
    isAuthenticated: !!user,
    isAdmin,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    refreshSession,
    clearAuthError,
    hasRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export type { AuthContextType };
