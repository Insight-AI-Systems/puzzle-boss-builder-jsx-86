
import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/types/userTypes';

interface AuthContextType {
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
  
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<AuthError | Error | null>(null);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [lastAuthAttempt, setLastAuthAttempt] = useState<number>(0);
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  const { toast } = useToast();
  const navigate = useNavigate();

  const MIN_TIME_BETWEEN_AUTH_ATTEMPTS = 2000;

  const isAuthenticated = useMemo(() => !!user && !!session, [user, session]);
  const isAdmin = useMemo(() => userRole === 'admin' || userRole === 'super_admin', [userRole]);

  const clearAuthError = () => setError(null);

  const fetchUserRoles = async (userId: string) => {
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error fetching user profile:', profileError);
        return;
      }

      if (profile && profile.role) {
        // Store both the role array for backward compatibility and the single role
        setUserRoles([profile.role]);
        setUserRole(profile.role as UserRole);
        return;
      }

      // Legacy support for user_roles table
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);

      if (rolesError) {
        console.error('Error fetching user roles:', rolesError);
        return;
      }

      if (roles && roles.length > 0) {
        const extractedRoles = roles.map(roleObj => roleObj.role);
        setUserRoles(extractedRoles);
        // For backward compatibility, use the first role as the primary role
        setUserRole(extractedRoles[0] as UserRole);
      } else {
        setUserRoles(['player']);
        setUserRole('player');
      }
    } catch (error) {
      console.error('Error fetching user roles:', error);
      setUserRoles(['player']);
      setUserRole('player');
    }
  };

  const trackSessionActivity = async (sessionId: string) => {
    if (!user) return;
    
    try {
      await supabase
        .from('user_sessions')
        .update({
          last_active: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .eq('session_token', sessionId);
    } catch (error) {
      console.error('Error updating session activity:', error);
    }
  };

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, newSession) => {
      console.log('Auth state changed:', event);
      
      setSession(newSession);
      setUser(newSession?.user ?? null);
      
      if (newSession?.user) {
        setTimeout(() => {
          fetchUserRoles(newSession.user.id);
          
          if (newSession.access_token) {
            trackSessionActivity(newSession.access_token);
          }
        }, 0);
      } else {
        setUserRoles([]);
        setUserRole(null);
      }
      
      if (event === 'SIGNED_OUT') {
        setUserRoles([]);
        setUserRole(null);
      }
      
      setIsLoading(false);
    });

    const initializeAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        setSession(data.session);
        setUser(data.session?.user ?? null);
        
        if (data.session?.user) {
          await fetchUserRoles(data.session.user.id);
          
          if (data.session.access_token) {
            trackSessionActivity(data.session.access_token);
          }
        }
      } catch (e) {
        console.error('Error initializing auth:', e);
        setError(e instanceof Error ? e : new Error('Unknown auth error'));
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
    
    return () => {
      if (authListener && 'subscription' in authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  const checkRateLimit = (): boolean => {
    const now = Date.now();
    if (now - lastAuthAttempt < MIN_TIME_BETWEEN_AUTH_ATTEMPTS) {
      setError(new Error('Too many auth attempts. Please wait before trying again.'));
      return false;
    }
    setLastAuthAttempt(now);
    return true;
  };

  const refreshSession = async (): Promise<void> => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error('Session refresh error:', error);
        throw error;
      }
      
      setSession(data.session);
      setUser(data.session?.user ?? null);
      
      if (data.session?.user) {
        await fetchUserRoles(data.session.user.id);
      }
    } catch (e) {
      console.error('Session refresh error:', e);
      if (e instanceof AuthError && e.status === 401) {
        navigate('/auth', { replace: true });
      }
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string, options?: { rememberMe?: boolean }) => {
    if (!checkRateLimit()) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password
      });
      
      if (error) {
        throw error;
      }
      
      console.info('Auth successful:', {
        timestamp: new Date().toISOString(),
        userId: data.user?.id,
        email: email.substring(0, 3) + '***',
        success: true
      });
      
      if (data.session && data.user) {
        const { error: sessionError } = await supabase
          .from('user_sessions')
          .insert({
            user_id: data.user.id,
            session_token: data.session.access_token,
            user_agent: navigator.userAgent,
            ip_address: 'client-side',
            device_info: {
              platform: navigator.platform,
              userAgent: navigator.userAgent,
              language: navigator.language
            },
            is_active: true
          });
          
        if (sessionError) {
          console.error('Error creating session record:', sessionError);
        }
      }
      
      toast({
        title: 'Welcome back!',
        description: 'Successfully signed in.',
      });
      
    } catch (e) {
      console.error('Sign in error:', e);
      setError(e instanceof Error ? e : new Error('Unknown sign in error'));
      
      console.warn('Failed auth attempt:', {
        timestamp: new Date().toISOString(),
        email: email.substring(0, 3) + '***',
        success: false,
        error: e instanceof Error ? e.message : 'Unknown error'
      });
      
      toast({
        title: 'Authentication failed',
        description: 'Invalid email or password',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, metadata?: { [key: string]: any }) => {
    if (!checkRateLimit()) return;

    try {
      setIsLoading(true);
      setError(null);
      
      const userMetadata = metadata || {
        username: email.split('@')[0],
        avatar_url: null,
        bio: null
      };
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userMetadata,
          emailRedirectTo: `${window.location.origin}/auth?verificationSuccess=true`
        }
      });
      
      if (error) {
        throw error;
      }
      
      const requiresConfirmation = !data.session;
      
      toast({
        title: 'Account created!',
        description: requiresConfirmation 
          ? 'Please check your email to verify your account.' 
          : 'Your account has been created successfully.',
      });

      if (requiresConfirmation) {
        navigate('/auth?view=verification-pending', { replace: true });
      }
    } catch (e) {
      console.error('Sign up error:', e);
      setError(e instanceof Error ? e : new Error('Unknown sign up error'));
      
      toast({
        title: 'Registration failed',
        description: e instanceof Error ? e.message : 'Failed to create account',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (session?.access_token && user) {
        await supabase
          .from('user_sessions')
          .update({ is_active: false })
          .eq('user_id', user.id)
          .eq('session_token', session.access_token);
      }
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      toast({
        title: 'Signed out',
        description: 'You have been successfully logged out.',
      });

      navigate('/', { replace: true });
    } catch (e) {
      console.error('Sign out error:', e);
      setError(e instanceof Error ? e : new Error('Unknown sign out error'));
      
      toast({
        title: 'Logout failed',
        description: e instanceof Error ? e.message : 'Failed to log out',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    if (!checkRateLimit()) return;

    try {
      setIsLoading(true);
      setError(null);
      
      const startTime = Date.now();
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?type=recovery`,
      });
      
      if (error) {
        throw error;
      }
      
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime < 1000) {
        await new Promise(resolve => setTimeout(resolve, 1000 - elapsedTime));
      }
      
      toast({
        title: 'Password reset email sent',
        description: 'If an account with this email exists, you will receive password reset instructions.',
      });
      
      navigate('/auth?view=verification-pending', { replace: true });
    } catch (e) {
      console.error('Password reset error:', e);
      setError(e instanceof Error ? e : new Error('Unknown password reset error'));
      
      const elapsedTime = Date.now() - lastAuthAttempt;
      if (elapsedTime < 1000) {
        await new Promise(resolve => setTimeout(resolve, 1000 - elapsedTime));
      }
      
      toast({
        title: 'Password reset email sent',
        description: 'If an account with this email exists, you will receive password reset instructions.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updatePassword = async (password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (!password || password.length < 8) {
        setError(new Error('Password must be at least 8 characters'));
        return;
      }
      
      const { error } = await supabase.auth.updateUser({ password });
      
      if (error) {
        throw error;
      }
      
      if (user) {
        await supabase
          .from('profiles')
          .update({
            last_password_change: new Date().toISOString()
          })
          .eq('id', user.id);
      }
      
      toast({
        title: 'Password updated',
        description: 'Your password has been updated successfully.',
      });
      
      navigate('/', { replace: true });
    } catch (e) {
      console.error('Update password error:', e);
      setError(e instanceof Error ? e : new Error('Unknown update password error'));
      
      toast({
        title: 'Password update failed',
        description: e instanceof Error ? e.message : 'Failed to update password',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const hasRole = (role: string): boolean => {
    // If the user has the exact role
    if (userRole === role) return true;
    
    // Super admins have all roles
    if (userRole === 'super_admin') return true;
    
    // Admins have access to most roles except super_admin
    if (userRole === 'admin' && role !== 'super_admin') return true;
    
    // For legacy support, also check the userRoles array
    return userRoles.includes(role);
  };

  const value: AuthContextType = {
    user,
    session,
    isLoading,
    error,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    refreshSession,
    isAuthenticated,
    isAdmin,
    hasRole,
    userRole,
    clearAuthError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}
