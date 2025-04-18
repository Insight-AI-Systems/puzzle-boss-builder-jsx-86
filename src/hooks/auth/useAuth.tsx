
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
    username,
    rememberMe,
    acceptTerms,
    errorMessage,
    isLoading: emailLoading,
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
  } = useEmailAuth();
  
  const {
    isLoading: socialLoading,
    handleGoogleAuth
  } = useSocialAuth();
  
  const {
    password: resetPassword,
    confirmPassword: resetConfirmPassword,
    errorMessage: resetErrorMessage,
    successMessage: resetSuccessMessage,
    isLoading: passwordResetLoading,
    setPassword: setResetPassword,
    setConfirmPassword: setResetConfirmPassword,
    setErrorMessage: setResetErrorMessage,
    handlePasswordResetRequest,
    handlePasswordReset
  } = usePasswordReset();
  
  // Derive loading state from all sources
  const isLoading = emailLoading || socialLoading || passwordResetLoading;

  return {
    // Email auth
    email,
    password,
    confirmPassword,
    username,
    rememberMe,
    acceptTerms,
    errorMessage,
    
    // Password reset
    resetPassword,
    resetConfirmPassword,
    resetErrorMessage,
    resetSuccessMessage,
    
    // Loading state
    isLoading,
    
    // Email auth methods
    setEmail,
    setPassword,
    setConfirmPassword,
    setUsername,
    setRememberMe,
    setAcceptTerms,
    setErrorMessage,
    resetForm,
    handleEmailAuth,
    validateForm,
    
    // Social auth methods
    handleGoogleAuth,
    
    // Password reset methods
    setResetPassword,
    setResetConfirmPassword,
    setResetErrorMessage,
    handlePasswordResetRequest,
    handlePasswordReset
  };
}
