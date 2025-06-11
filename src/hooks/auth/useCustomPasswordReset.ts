
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CustomPasswordResetState {
  email: string;
  newPassword: string;
  confirmPassword: string;
  resetToken: string;
  errorMessage: string;
  successMessage: string;
  isLoading: boolean;
  step: 'request' | 'confirm';
}

interface CustomPasswordResetActions {
  setEmail: (email: string) => void;
  setNewPassword: (password: string) => void;
  setConfirmPassword: (password: string) => void;
  setResetToken: (token: string) => void;
  setErrorMessage: (message: string) => void;
  setSuccessMessage: (message: string) => void;
  handlePasswordResetRequest: () => Promise<void>;
  handlePasswordReset: () => Promise<void>;
  setStep: (step: 'request' | 'confirm') => void;
}

export function useCustomPasswordReset(): CustomPasswordResetState & CustomPasswordResetActions {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'request' | 'confirm'>('request');
  const { toast } = useToast();

  const handlePasswordResetRequest = async () => {
    if (!email) {
      setErrorMessage('Email is required');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    
    try {
      // Generate a reset token and store it temporarily
      const resetToken = Math.random().toString(36).substring(2) + Date.now().toString(36);
      
      // Send email via SendGrid edge function
      const { error: emailError } = await supabase.functions.invoke('send-email', {
        body: {
          to: email,
          subject: 'Password Reset - The Puzzle Boss',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #0ea5e9;">Password Reset Request</h2>
              <p>You have requested to reset your password for The Puzzle Boss.</p>
              <p>Your reset code is: <strong style="font-size: 24px; color: #0ea5e9; letter-spacing: 2px;">${resetToken}</strong></p>
              <p>This code will expire in 15 minutes.</p>
              <p>If you didn't request this reset, you can safely ignore this email.</p>
            </div>
          `,
          from: 'noreply@puzzleboss.com'
        }
      });

      if (emailError) {
        throw emailError;
      }

      // Store the reset token temporarily (in a real app, you'd store this in the database)
      sessionStorage.setItem(`reset_token_${email}`, JSON.stringify({
        token: resetToken,
        expires: Date.now() + (15 * 60 * 1000) // 15 minutes
      }));

      setSuccessMessage('Reset code sent to your email. Please check your inbox.');
      setStep('confirm');
      
      toast({
        title: 'Reset code sent',
        description: 'Please check your email for the reset code.',
      });
    } catch (error) {
      console.error('Password reset request error:', error);
      setErrorMessage('Failed to send reset email. Please try again.');
      toast({
        title: 'Error',
        description: 'Failed to send reset email. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!resetToken) {
      setErrorMessage('Reset code is required');
      return;
    }

    if (!newPassword) {
      setErrorMessage('New password is required');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      // Verify the reset token
      const storedTokenData = sessionStorage.getItem(`reset_token_${email}`);
      if (!storedTokenData) {
        throw new Error('Invalid or expired reset code');
      }

      const { token, expires } = JSON.parse(storedTokenData);
      
      if (Date.now() > expires) {
        sessionStorage.removeItem(`reset_token_${email}`);
        throw new Error('Reset code has expired');
      }

      if (token !== resetToken) {
        throw new Error('Invalid reset code');
      }

      // Reset password using Supabase admin functions or direct update
      // First, let's try to sign in the user with a temporary session
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?type=recovery&email=${encodeURIComponent(email)}&token=${resetToken}`,
      });

      if (resetError) {
        throw resetError;
      }

      // Clear the stored token
      sessionStorage.removeItem(`reset_token_${email}`);
      
      setSuccessMessage('Password reset instructions sent. Please check your email to complete the process.');
      
      toast({
        title: 'Password reset initiated',
        description: 'Please check your email to complete the password reset.',
      });
    } catch (error) {
      console.error('Password reset error:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to reset password');
      toast({
        title: 'Error',
        description: 'Failed to reset password. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    newPassword,
    confirmPassword,
    resetToken,
    errorMessage,
    successMessage,
    isLoading,
    step,
    setEmail,
    setNewPassword,
    setConfirmPassword,
    setResetToken,
    setErrorMessage,
    setSuccessMessage,
    handlePasswordResetRequest,
    handlePasswordReset,
    setStep
  };
}
