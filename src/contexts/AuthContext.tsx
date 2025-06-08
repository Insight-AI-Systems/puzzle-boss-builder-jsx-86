import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { UserRole } from '@/types/userTypes';

interface AuthUser extends User {
  member_id?: string;
  credits?: number;
}

interface AuthContextType {
  user: AuthUser | null;
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

const fetchUserProfile = async (userId: string): Promise<Partial<AuthUser>> => {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('member_id, credits, role')
      .eq('id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching user profile:', error);
      return {};
    }

    return {
      member_id: profile?.member_id,
      credits: profile?.credits || 0
    };
  } catch (error) {
    console.error('Exception fetching user profile:', error);
    return {};
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [rolesLoaded, setRolesLoaded] = useState(false);
  const { toast } = useToast();

  const updateLastSignIn = async (userId: string, isSignIn: boolean = false) => {
    try {
      console.log('AuthContext - Updating last_sign_in for user:', userId, isSignIn ? '(SIGN_IN)' : '(ACTIVITY)');
      
      const { error: directError } = await supabase
        .from('profiles')
        .update({ last_sign_in: new Date().toISOString() })
        .eq('id', userId);
      
      if (directError) {
        console.error('AuthContext - Error updating last_sign_in directly:', directError);
      } else {
        console.log('AuthContext - Successfully updated last_sign_in directly');
      }

      if (isSignIn) {
        try {
          const { error: functionError } = await supabase.functions.invoke('handle_user_signin', {
            body: { userId }
          });
          
          if (functionError) {
            console.error('AuthContext - Edge function error (non-critical):', functionError);
          }
        } catch (functionException) {
          console.error('AuthContext - Edge function exception (non-critical):', functionException);
        }
      }
    } catch (error) {
      console.error('AuthContext - Exception updating last_sign_in:', error);
    }
  };

  const fetchUserRole = async (userId: string, email: string | undefined) => {
    try {
      console.log('AuthContext - Fetching role for user:', { userId, email });
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('AuthContext - Error fetching user profile:', error);
        setUserRole('player');
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
          
          if (initialSession?.user) {
            // Fetch additional profile data
            const profileData = await fetchUserProfile(initialSession.user.id);
            const enhancedUser: AuthUser = { ...initialSession.user, ...profileData };
            setUser(enhancedUser);
            
            updateLastSignIn(initialSession.user.id, false);
            await fetchUserRole(initialSession.user.id, initialSession.user.email);
          } else {
            setUser(null);
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
          setError(null);
          
          if (currentSession?.user) {
            // Fetch additional profile data
            const profileData = await fetchUserProfile(currentSession.user.id);
            const enhancedUser: AuthUser = { ...currentSession.user, ...profileData };
            setUser(enhancedUser);
            
            if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
              console.log('AuthContext - User activity detected, updating last_sign_in');
              setTimeout(() => {
                updateLastSignIn(currentSession.user.id, event === 'SIGNED_IN');
              }, 100);
            }
            
            setTimeout(() => {
              if (mounted) {
                fetchUserRole(currentSession.user.id, currentSession.user.email);
              }
            }, 0);
          } else {
            setUser(null);
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
      if (user?.id) {
        console.log('AuthContext - Updating last_sign_in timestamp for logout:', user.id);
        try {
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ last_sign_in: new Date().toISOString() })
            .eq('id', user.id);
          
          if (updateError) {
            console.error('AuthContext - Error updating last_sign_in on logout:', updateError);
          } else {
            console.log('AuthContext - Successfully updated last_sign_in on logout');
          }
        } catch (updateException) {
          console.error('AuthContext - Exception updating last_sign_in on logout:', updateException);
        }
      }

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
        if (data.user) {
          const profileData = await fetchUserProfile(data.user.id);
          const enhancedUser: AuthUser = { ...data.user, ...profileData };
          setUser(enhancedUser);
        }
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
    return userRole === role;
  };

  const userRoles: UserRole[] = userRole ? [userRole] : [];
  const isAdmin = userRole === 'admin' || userRole === 'super_admin';

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
