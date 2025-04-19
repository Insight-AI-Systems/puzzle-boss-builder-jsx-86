
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { handleAuthError } from '@/utils/auth/authErrorHandler';
import { validateAuthForm } from '@/utils/auth/authValidation';
import { useRateLimiting } from './useRateLimiting';
import { AuthError } from '@supabase/supabase-js';

interface EmailAuthState {
  email: string;
  password: string;
  confirmPassword: string;
  username: string;
  rememberMe: boolean;
  acceptTerms: boolean;
  errorMessage: string;
  isLoading: boolean;
}

export function useEmailAuth(): EmailAuthState & {
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setConfirmPassword: (confirmPassword: string) => void;
  setUsername: (username: string) => void;
  setRememberMe: (remember: boolean) => void;
  setAcceptTerms: (accept: boolean) => void;
  setErrorMessage: (message: string) => void;
  resetForm: () => void;
  handleEmailAuth: (isSignUp: boolean) => Promise<void>;
  validateForm: (isSignUp: boolean) => boolean;
} {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const { checkRateLimit } = useRateLimiting();

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setUsername('');
    setRememberMe(false);
    setAcceptTerms(false);
    setErrorMessage('');
  };

  const validateForm = (isSignUp: boolean): boolean => {
    return validateAuthForm(
      email,
      password,
      confirmPassword,
      acceptTerms,
      isSignUp,
      setErrorMessage
    );
  };

  const handleEmailAuth = async (isSignUp: boolean) => {
    if (!checkRateLimit()) {
      setErrorMessage('Please wait before trying again');
      return;
    }
    
    if (!validateForm(isSignUp)) {
      return;
    }
    
    try {
      setIsLoading(true);
      setErrorMessage('');
      
      console.log(`Attempting to ${isSignUp ? 'sign up' : 'sign in'} with email: ${email}`);
      
      if (isSignUp) {
        const userDisplayName = username || email.split('@')[0];
        
        const { data, error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            data: {
              username: userDisplayName,
              avatar_url: null,
              bio: null
            },
            emailRedirectTo: `${window.location.origin}/auth?verificationSuccess=true` 
          }
        });
        
        if (error) {
          // Handle the error and update errorMessage
          handleAuthError(error, setErrorMessage);
          
          // Also show a toast notification for "email already registered" errors
          if (error.message.includes('email') && (error.message.includes('taken') || error.message.includes('already exists'))) {
            toast({
              title: 'Email Already Registered',
              description: errorMessage || '🔑 Looks like you already have an account with this email. Want to sign in or reset your password?',
              variant: 'destructive',
            });
          } else {
            toast({
              title: 'Registration Error',
              description: errorMessage || 'An error occurred during registration',
              variant: 'destructive',
            });
          }
          
          return;
        }
        
        const requiresConfirmation = data.user?.identities?.length === 0 || 
                                   data.session === null;
                                   
        if (requiresConfirmation) {
          toast({
            title: 'Account created!',
            description: 'Please check your email to verify your account.',
          });
          
          navigate('/auth?view=verification-pending', { replace: true });
        } else {
          toast({
            title: 'Account created!',
            description: 'Your account has been created and you are now logged in.',
          });
          
          navigate('/', { replace: true });
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ 
          email, 
          password
        });
        
        if (error) {
          handleAuthError(error, setErrorMessage);
          
          toast({
            title: 'Authentication Error',
            description: errorMessage || 'An error occurred during authentication',
            variant: 'destructive',
          });
          return;
        }
        
        toast({
          title: 'Welcome back!',
          description: 'Successfully signed in.',
        });
        
        if (data.session) {
          navigate('/', { replace: true });
        }
      }
    } catch (error) {
      handleAuthError(error as AuthError | Error, setErrorMessage);
      
      toast({
        title: 'Authentication error',
        description: errorMessage || 'An error occurred during authentication',
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
    username,
    rememberMe,
    acceptTerms,
    errorMessage,
    isLoading,
    setEmail,
    setPassword,
    setConfirmPassword,
    setUsername,
    setRememberMe,
    setAcceptTerms,
    setErrorMessage,
    resetForm,
    handleEmailAuth,
    validateForm
  };
}
