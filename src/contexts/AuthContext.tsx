
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { UserRole } from '@/types/userTypes';

// Updated protected admin email
const PROTECTED_ADMIN_EMAIL = 'alantbooth@xtra.co.nz';

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
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [rolesLoaded, setRolesLoaded] = useState(false);
  const { toast } = useToast();

  const fetchUserRole = async (userId: string, email: string | undefined) => {
    try {
      console.log('AuthContext - Fetching role for user:', { userId, email });
      
      // Special case for protected admin - always grant super_admin role
      if (email === PROTECTED_ADMIN_EMAIL) {
        console.log('AuthContext - Protected admin detected, granting super_admin role');
        setUserRole('super_admin');
        setRolesLoaded(true);
        return;
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('AuthContext - Error fetching user profile:', error);
        setUserRole('player'); // Default fallback
      } else if (profile?.role) {
        console.log('AuthContext - Role found in profile:', profile.role);
        setUserRole(profile.role as UserRole);
      } else {
        console.log('AuthContext - No role found, defaulting to player');
        setUserRole('player');
      }
    } catch (error) {
      console.error('AuthContext - Exception fetching user role:', error);
      setUserRole('player');
    } finally {
      setRolesLoaded(true);
    }
  };

  useEffect(() => {
    let mounted = true;

    const getInitialSession = async () => {
      try {
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting initial session:", error);
          setError(error.message);
        }
        
        if (mounted) {
          setSession(initialSession);
          setUser(initialSession?.user || null);
          
          if (initialSession?.user) {
            await fetchUserRole(initialSession.user.id, initialSession.user.email);
          } else {
            setRolesLoaded(true);
          }
        }
      } catch (error) {
        console.error("Error getting initial session:", error);
        if (mounted) {
          setError(error instanceof Error ? error.message : 'Unknown error');
          setRolesLoaded(true);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, currentSession: Session | null) => {
        console.log('Auth state change:', event, currentSession?.user?.email);
        
        if (mounted) {
          setSession(currentSession);
          setUser(currentSession?.user || null);
          setError(null);
          
          if (currentSession?.user) {
            // Use setTimeout to prevent potential recursive issues
            setTimeout(() => {
              if (mounted) {
                fetchUserRole(currentSession.user.id, currentSession.user.email);
              }
            }, 0);
          } else {
            setUserRole(null);
            setRolesLoaded(true);
          }
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

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
        console.log('Sign in successful for:', email);
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
          emailRedirectTo: `${window.location.origin}/`
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
        console.log('Sign up successful for:', email);
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
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
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
    // Special case for protected admin
    if (user?.email === PROTECTED_ADMIN_EMAIL) {
      return role === 'super_admin' || role === 'admin';
    }
    return userRole === role;
  };

  // Computed values
  const userRoles: UserRole[] = userRole ? [userRole] : [];
  const isAdmin = userRole === 'admin' || userRole === 'super_admin' || user?.email === PROTECTED_ADMIN_EMAIL;

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
