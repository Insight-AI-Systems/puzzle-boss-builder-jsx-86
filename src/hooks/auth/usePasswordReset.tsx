import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { validatePassword, validatePasswordMatch } from '@/utils/authValidation';

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

  const validateResetForm = (): boolean => {
    if (!password && !confirmPassword) {
      if (!email) {
        setErrorMessage('Email is required');
        return false;
      }
      return true;
    }

    if (!password) {
      setErrorMessage('Password is required');
      return false;
    }

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

  const checkIfRateLimited = async (email: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.rpc('is_password_reset_rate_limited', {
        _email: email,
        _max_attempts: 3,
        _timeframe_minutes: 15
      });
      
      if (error) throw error;
      return !!data;
    } catch (error) {
      console.error('Error checking rate limit:', error);
      return false;
    }
  };

  const recordResetAttempt = async (email: string): Promise<void> => {
    try {
      const ipAddress = 'client-side';
      
      const { error } = await supabase.rpc('handle_password_reset_attempt', {
        _email: email,
        _ip_address: ipAddress
      });
      
      if (error) throw error;
    } catch (error) {
      console.error('Error recording reset attempt:', error);
    }
  };

  const handlePasswordResetRequest = async () => {
    if (!validateResetForm()) {
      return;
    }
    
    try {
      setIsLoading(true);
      setErrorMessage('');
      setSuccessMessage('');
      
      const isRateLimited = await checkIfRateLimited(email);
      
      if (isRateLimited) {
        setErrorMessage('Too many reset attempts. Please try again later.');
        return;
      }
      
      await recordResetAttempt(email);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?type=recovery`,
      });
      
      if (error) {
        console.error('Password reset request error:', error);
        setSuccessMessage('If an account with this email exists, a reset link has been sent.');
        return;
      }
      
      setSuccessMessage('If an account with this email exists, a reset link has been sent.');
      
      toast({
        title: 'Password reset email sent',
        description: 'Please check your email for password reset instructions.',
      });
    } catch (error) {
      console.error('Password reset request error:', error);
      setSuccessMessage('If an account with this email exists, a reset link has been sent.');
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
