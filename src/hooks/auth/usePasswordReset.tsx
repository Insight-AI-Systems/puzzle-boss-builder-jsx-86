
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { validatePassword } from '@/utils/authValidation';

interface PasswordResetState {
  email: string;
  password: string;
  confirmPassword: string;
  errorMessage: string;
  successMessage: string;
  isLoading: boolean;
}

interface PasswordResetActions {
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setConfirmPassword: (password: string) => void;
  setErrorMessage: (message: string) => void;
  setSuccessMessage: (message: string) => void;
  handlePasswordResetRequest: () => Promise<void>;
  handlePasswordReset: () => Promise<void>;
  validateResetForm: () => boolean;
}

export function usePasswordReset(): PasswordResetState & PasswordResetActions {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Rate limiting for security
  let lastAttemptTime = 0;
  const MIN_TIME_BETWEEN_ATTEMPTS = 30000; // 30 seconds

  const validateResetForm = (): boolean => {
    // For password reset request
    if (!password && !confirmPassword) {
      if (!email) {
        setErrorMessage('Email is required');
        return false;
      }
      return true;
    }

    // For password reset confirmation
    if (!password) {
      setErrorMessage('Password is required');
      return false;
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      setErrorMessage(passwordValidation.message);
      return false;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return false;
    }

    return true;
  };

  const handlePasswordResetRequest = async () => {
    // Rate limiting check
    const now = Date.now();
    if (now - lastAttemptTime < MIN_TIME_BETWEEN_ATTEMPTS) {
      setErrorMessage(`Please wait before requesting another reset`);
      return;
    }
    lastAttemptTime = now;

    if (!email) {
      setErrorMessage('Email is required');
      return;
    }
    
    try {
      setIsLoading(true);
      setErrorMessage('');
      setSuccessMessage('');
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?type=recovery`,
      });
      
      if (error) {
        console.error('Password reset request error:', error);
        // Don't reveal if email exists or not (security best practice)
        setSuccessMessage('If an account with this email exists, a reset link has been sent');
        return;
      }
      
      // Always show the same message whether email exists or not (prevent user enumeration)
      setSuccessMessage('If an account with this email exists, a reset link has been sent');
      
      toast({
        title: 'Password reset email sent',
        description: 'Please check your email for password reset instructions.',
      });
    } catch (error) {
      console.error('Password reset request error:', error);
      // Don't reveal specific errors
      setSuccessMessage('If an account with this email exists, a reset link has been sent');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePasswordReset = async () => {
    if (!validateResetForm()) {
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
        setErrorMessage('Error updating password. Please try again or request a new reset link.');
        return;
      }
      
      setSuccessMessage('Your password has been successfully updated');
      
      toast({
        title: 'Password reset successful',
        description: 'Your password has been updated. You can now sign in with your new password.',
      });
      
      // Clear the form
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Password reset error:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred while resetting your password',
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
    successMessage,
    isLoading,
    setEmail,
    setPassword,
    setConfirmPassword,
    setErrorMessage,
    setSuccessMessage,
    handlePasswordResetRequest,
    handlePasswordReset,
    validateResetForm
  };
}
