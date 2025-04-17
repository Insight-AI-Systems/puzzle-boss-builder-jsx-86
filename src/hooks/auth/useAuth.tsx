
import { useState } from 'react';
import { useEmailAuth } from './useEmailAuth';
import { useSocialAuth } from './useSocialAuth';
import { usePasswordReset } from './usePasswordReset';
import { useSearchParams } from 'react-router-dom';

export function useAuth() {
  const [searchParams] = useSearchParams();
  
  const { 
    email,
    password,
    confirmPassword,
    errorMessage,
    isLoading: emailLoading,
    setEmail,
    setPassword,
    setConfirmPassword,
    setErrorMessage,
    resetForm,
    handleEmailAuth 
  } = useEmailAuth();
  
  const {
    isLoading: socialLoading,
    handleGoogleAuth
  } = useSocialAuth();
  
  const {
    isLoading: passwordResetLoading,
    handlePasswordResetRequest,
    handlePasswordReset: handlePasswordResetConfirm
  } = usePasswordReset();
  
  // Derive loading state from all sources
  const isLoading = emailLoading || socialLoading || passwordResetLoading;
  
  // Adapter method for password reset to maintain API compatibility
  const handlePasswordReset = async () => {
    await handlePasswordResetConfirm(password, confirmPassword);
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
