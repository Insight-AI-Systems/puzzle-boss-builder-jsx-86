
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export function useAuth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setErrorMessage('');
  };

  const handleEmailAuth = async (isSignUp: boolean) => {
    try {
      setIsLoading(true);
      setErrorMessage('');
      
      console.log(`Attempting to ${isSignUp ? 'sign up' : 'sign in'} with email: ${email}`);
      
      const { data, error } = isSignUp 
        ? await supabase.auth.signUp({ email, password })
        : await supabase.auth.signInWithPassword({ email, password });

      console.log('Auth response:', data, error);
      
      if (error) {
        console.error('Auth error:', error);
        setErrorMessage(error.message);
        setIsLoading(false);
        return;
      }

      // Show success toast
      toast({
        title: isSignUp ? 'Account created!' : 'Welcome back!',
        description: isSignUp 
          ? 'Please check your email to verify your account.'
          : 'Successfully signed in.',
      });

      // Redirect to home page on successful sign-in
      if (!isSignUp && data.session) {
        navigate('/', { replace: true });
      }
    } catch (error) {
      console.error('Authentication error:', error);
      
      toast({
        title: 'Authentication error',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      setIsLoading(true);
      setErrorMessage('');
      
      console.log('Attempting Google sign in');
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
      
      if (error) {
        console.error('Google auth error:', error);
        setErrorMessage(error.message);
        throw error;
      }
    } catch (error) {
      console.error('Google auth error:', error);
      
      toast({
        title: 'Authentication error',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };

  const handlePasswordResetRequest = async () => {
    if (!email) {
      setErrorMessage('Email is required');
      return;
    }
    
    try {
      setIsLoading(true);
      setErrorMessage('');
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?type=recovery`,
      });
      
      if (error) {
        console.error('Password reset request error:', error);
        setErrorMessage(error.message);
        return;
      }
      
      toast({
        title: 'Password reset email sent',
        description: 'Please check your email for password reset instructions.',
      });
      
      resetForm();
    } catch (error) {
      console.error('Password reset request error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePasswordReset = async () => {
    if (!password) {
      setErrorMessage('Password is required');
      return;
    }
    
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }
    
    try {
      setIsLoading(true);
      setErrorMessage('');
      
      const { error } = await supabase.auth.updateUser({
        password
      });
      
      if (error) {
        console.error('Password reset error:', error);
        setErrorMessage(error.message);
        return;
      }
      
      toast({
        title: 'Password reset successful',
        description: 'Your password has been updated. You can now sign in with your new password.',
      });
      
      resetForm();
    } catch (error) {
      console.error('Password reset error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    password,
    confirmPassword,
    errorMessage,
    isLoading,
    setEmail,
    setPassword,
    setConfirmPassword,
    setErrorMessage,
    resetForm,
    handleEmailAuth,
    handleGoogleAuth,
    handlePasswordResetRequest,
    handlePasswordReset
  };
}
