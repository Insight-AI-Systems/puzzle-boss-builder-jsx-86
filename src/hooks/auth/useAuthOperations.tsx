
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthOperationsProps {
  lastAuthAttempt: number;
  setLastAuthAttempt: (time: number) => void;
  MIN_TIME_BETWEEN_AUTH_ATTEMPTS: number;
  setError: (error: Error | AuthError | null) => void;
  toast: any;
  navigate: (path: string) => void;
  fetchUserRoles: (userId: string) => Promise<void>;
}

export function useAuthOperations({
  lastAuthAttempt,
  setLastAuthAttempt,
  MIN_TIME_BETWEEN_AUTH_ATTEMPTS,
  setError,
  toast,
  navigate,
  fetchUserRoles
}: AuthOperationsProps) {
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
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error('Session refresh error:', error);
        throw error;
      }
      
      if (data.session?.user) {
        await fetchUserRoles(data.session.user.id);
      }
    } catch (e) {
      console.error('Session refresh error:', e);
      if (e instanceof AuthError && e.status === 401) {
        navigate('/auth');
      }
      throw e;
    }
  };

  const signIn = async (email: string, password: string, options?: { rememberMe?: boolean }) => {
    if (!checkRateLimit()) return;
    
    try {
      setError(null);
      
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password
      });
      
      if (error) throw error;
      
      if (data.session && data.user) {
        await trackSessionActivity(data.session, data.user);
      }
      
      toast({
        title: 'Welcome back!',
        description: 'Successfully signed in.',
      });
      
    } catch (e) {
      console.error('Sign in error:', e);
      setError(e instanceof Error ? e : new Error('Unknown sign in error'));
      
      toast({
        title: 'Authentication failed',
        description: 'Invalid email or password',
        variant: 'destructive',
      });
    }
  };

  const signUp = async (email: string, password: string, metadata?: { [key: string]: any }) => {
    if (!checkRateLimit()) return;

    try {
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
      
      if (error) throw error;
      
      const requiresConfirmation = !data.session;
      
      toast({
        title: 'Account created!',
        description: requiresConfirmation 
          ? 'Please check your email to verify your account.' 
          : 'Your account has been created successfully.',
      });

      if (requiresConfirmation) {
        navigate('/auth?view=verification-pending');
      }
    } catch (e) {
      console.error('Sign up error:', e);
      setError(e instanceof Error ? e : new Error('Unknown sign up error'));
      
      toast({
        title: 'Registration failed',
        description: e instanceof Error ? e.message : 'Failed to create account',
        variant: 'destructive',
      });
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      
      // Get current session first
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (sessionData.session?.access_token && sessionData.session?.user) {
        await supabase
          .from('user_sessions')
          .update({ is_active: false })
          .eq('user_id', sessionData.session.user.id)
          .eq('session_token', sessionData.session.access_token);
      }
      
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
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
    }
  };

  const resetPassword = async (email: string) => {
    if (!checkRateLimit()) return;

    try {
      setError(null);
      
      const startTime = Date.now();
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?type=recovery`,
      });
      
      if (error) throw error;
      
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime < 1000) {
        await new Promise(resolve => setTimeout(resolve, 1000 - elapsedTime));
      }
      
      toast({
        title: 'Password reset email sent',
        description: 'If an account with this email exists, you will receive password reset instructions.',
      });
      
      navigate('/auth?view=verification-pending');
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
    }
  };

  const updatePassword = async (password: string) => {
    try {
      setError(null);
      
      if (!password || password.length < 8) {
        setError(new Error('Password must be at least 8 characters'));
        return;
      }
      
      const { error } = await supabase.auth.updateUser({ password });
      
      if (error) throw error;
      
      // Get current session to access user ID
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (sessionData.session?.user) {
        await supabase
          .from('profiles')
          .update({
            last_password_change: new Date().toISOString()
          })
          .eq('id', sessionData.session.user.id);
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
    }
  };

  const trackSessionActivity = async (session: Session, user: User) => {
    try {
      await supabase
        .from('user_sessions')
        .insert({
          user_id: user.id,
          session_token: session.access_token,
          user_agent: navigator.userAgent,
          ip_address: 'client-side',
          device_info: {
            platform: navigator.platform,
            userAgent: navigator.userAgent,
            language: navigator.language
          },
          is_active: true
        });
    } catch (error) {
      console.error('Error creating session record:', error);
    }
  };

  return {
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    refreshSession
  };
}
