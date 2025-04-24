
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

  // Validate the form data
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

  // Check if rate limited using our security definer function
  const checkIfRateLimited = async (email: string): Promise<boolean> => {
    try {
      // Call our security definer function
      const { data, error } = await supabase.rpc('is_password_reset_rate_limited', { 
        _email: email,
        _max_attempts: 3,
        _timeframe_minutes: 30
      });
      
      if (error) throw error;
      return !!data; // Convert to boolean
    } catch (error) {
      console.error('Error checking rate limit:', error);
      return false; // Default to not rate limited on error
    }
  };

  // Record a password reset attempt using our security definer function
  const recordResetAttempt = async (email: string): Promise<void> => {
    try {
      // Get IP address (this will be 'client-side' when called from the browser)
      const ipAddress = 'client-side';
      
      // Call our security definer function to record the attempt
      const { error } = await supabase.rpc('handle_password_reset_attempt', { 
        _email: email, 
        _ip_address: ipAddress 
      });
      
      if (error) throw error;
    } catch (error) {
      console.error('Error recording reset attempt:', error);
      // Non-blocking - we continue even if recording fails
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
      
      // Check if rate limited
      const isRateLimited = await checkIfRateLimited(email);
      
      if (isRateLimited) {
        setErrorMessage('Too many reset attempts. Please try again later.');
        return;
      }
      
      // Record this attempt
      await recordResetAttempt(email);
      
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
