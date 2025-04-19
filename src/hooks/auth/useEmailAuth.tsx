
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { validatePassword, validateEmail } from '@/utils/authValidation';
import { AuthError } from '@supabase/supabase-js';

type ErrorCodeMessages = {
  [key: string]: string;
};

// Standardized error messages to avoid revealing sensitive info
const ERROR_MESSAGES: ErrorCodeMessages = {
  'invalid_credentials': 'The email or password you entered is incorrect',
  'email_taken': 'An account with this email already exists',
  'user_already_exists': 'An account with this email already exists',
  'user_not_found': 'No account found with this email',
  'too_many_attempts': 'Too many attempts. Please try again later',
  'default': 'An error occurred during authentication'
};

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

interface EmailAuthActions {
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
}

export function useEmailAuth(): EmailAuthState & EmailAuthActions {
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

  // Timer to track authentication attempts (rate limiting)
  let lastAttemptTime = 0;
  const MIN_TIME_BETWEEN_ATTEMPTS = 2000; // 2 seconds

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setUsername('');
    setRememberMe(false);
    setAcceptTerms(false);
    setErrorMessage('');
  };

  // Form validation with detailed errors
  const validateForm = (isSignUp: boolean): boolean => {
    // Always validate email for both signup and signin
    if (!email) {
      setErrorMessage('Email is required');
      return false;
    }
    
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      setErrorMessage(emailValidation.message);
      return false;
    }

    // Always validate password for both signup and signin
    if (!password) {
      setErrorMessage('Password is required');
      return false;
    }
    
    // Additional signup validations
    if (isSignUp) {
      // Validate password strength only on signup
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.valid) {
        setErrorMessage(passwordValidation.message);
        return false;
      }

      // Confirm password match
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match');
        return false;
      }

      // Terms acceptance
      if (!acceptTerms) {
        setErrorMessage('You must accept the Terms of Service to continue');
        return false;
      }
    }

    return true;
  };

  // Map Supabase errors to user-friendly messages
  const handleAuthError = (error: AuthError | Error) => {
    console.error('Authentication error:', error);
    
    // TypeGuard for AuthError
    const isAuthError = (err: any): err is AuthError => {
      return err && typeof err === 'object' && 'code' in err;
    };

    if (isAuthError(error)) {
      // Handle known error codes
      const errorCode = error.code || '';
      
      // Rate limiting check
      if (errorCode === 'too_many_requests') {
        setErrorMessage(ERROR_MESSAGES.too_many_attempts);
        return;
      }
      
      // Map known error codes to user-friendly messages
      // Directly check for user_already_exists code first
      if (errorCode === 'user_already_exists') {
        setErrorMessage(ERROR_MESSAGES.user_already_exists);
        return;
      }
      
      // Then check for other errors
      const errorKey = Object.keys(ERROR_MESSAGES).find(key => errorCode.includes(key));
      setErrorMessage(errorKey ? ERROR_MESSAGES[errorKey] : ERROR_MESSAGES.default);
    } else {
      // Generic error handling
      setErrorMessage(ERROR_MESSAGES.default);
    }
    
    // Log for security monitoring (would connect to a monitoring service in production)
    console.warn('Auth attempt failed:', {
      timestamp: new Date().toISOString(),
      email: email.substring(0, 3) + '***', // Log partial email for security
      success: false,
      error: error.message
    });
  };

  const handleEmailAuth = async (isSignUp: boolean) => {
    // Rate limiting check
    const now = Date.now();
    if (now - lastAttemptTime < MIN_TIME_BETWEEN_ATTEMPTS) {
      setErrorMessage('Please wait before trying again');
      return;
    }
    lastAttemptTime = now;
    
    // Form validation
    if (!validateForm(isSignUp)) {
      return;
    }
    
    try {
      setIsLoading(true);
      setErrorMessage('');
      
      console.log(`Attempting to ${isSignUp ? 'sign up' : 'sign in'} with email: ${email}`);
      
      if (isSignUp) {
        // Use provided username or extract from email if not provided
        const userDisplayName = username || email.split('@')[0];
        
        // Sign up with additional metadata for profile creation
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
        
        console.log('Sign up response:', data, error);
        
        if (error) {
          throw error;
        }
        
        // Check if email confirmation is required
        const requiresConfirmation = data.user?.identities?.length === 0 || 
                                    data.session === null;
                                    
        // Show appropriate toast based on email confirmation requirement
        if (requiresConfirmation) {
          toast({
            title: 'Account created!',
            description: 'Please check your email to verify your account.',
          });
          
          // Redirect to verification pending page
          navigate('/auth?view=verification-pending', { replace: true });
        } else {
          toast({
            title: 'Account created!',
            description: 'Your account has been created and you are now logged in.',
          });
          
          // Redirect to home page
          navigate('/', { replace: true });
        }
      } else {
        // Regular sign in
        const { data, error } = await supabase.auth.signInWithPassword({ 
          email, 
          password
        });
        
        console.log('Sign in response:', data, error);
        
        if (error) {
          throw error;
        }
        
        // Log successful login for security monitoring
        console.info('Auth successful:', {
          timestamp: new Date().toISOString(),
          userId: data.user?.id,
          email: email.substring(0, 3) + '***', // Log partial email for security
          success: true
        });
        
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
      handleAuthError(error as AuthError | Error);
      
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
