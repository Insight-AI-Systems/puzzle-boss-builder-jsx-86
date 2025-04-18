
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface EmailAuthState {
  email: string;
  password: string;
  confirmPassword: string;
  errorMessage: string;
  isLoading: boolean;
}

interface EmailAuthActions {
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setConfirmPassword: (confirmPassword: string) => void;
  setErrorMessage: (message: string) => void;
  resetForm: () => void;
  handleEmailAuth: (isSignUp: boolean) => Promise<void>;
}

export function useEmailAuth(): EmailAuthState & EmailAuthActions {
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
    if (!email) {
      setErrorMessage('Email is required');
      return;
    }

    if (!password) {
      setErrorMessage('Password is required');
      return;
    }
    
    try {
      setIsLoading(true);
      setErrorMessage('');
      
      console.log(`Attempting to ${isSignUp ? 'sign up' : 'sign in'} with email: ${email}`);
      
      if (isSignUp) {
        // Extract username from email for profile creation
        const username = email.split('@')[0];
        
        // Sign up with additional metadata for profile creation
        const { data, error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            data: {
              username: username,
              avatar_url: null,
              bio: null
            }
          }
        });
        
        console.log('Sign up response:', data, error);
        
        if (error) {
          console.error('Auth error:', error);
          setErrorMessage(error.message);
          setIsLoading(false);
          return;
        }
        
        // Show success toast
        toast({
          title: 'Account created!',
          description: 'Please check your email to verify your account.',
        });
      } else {
        // Regular sign in
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        
        console.log('Sign in response:', data, error);
        
        if (error) {
          console.error('Auth error:', error);
          setErrorMessage(error.message);
          setIsLoading(false);
          return;
        }
        
        // Show success toast
        toast({
          title: 'Welcome back!',
          description: 'Successfully signed in.',
        });
        
        // Redirect to home page on successful sign-in
        if (data.session) {
          navigate('/', { replace: true });
        }
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
    handleEmailAuth
  };
}
