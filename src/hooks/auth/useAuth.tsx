
import { useState } from 'react';
import { useEmailAuth } from './useEmailAuth';
import { useSocialAuth } from './useSocialAuth';
import { usePasswordReset } from './usePasswordReset';
import { validateAuthForm } from '@/utils/auth/authValidation';

export function useAuth() {
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Get auth functions
  const { signUp, signIn, signOut, isLoading: emailLoading } = useEmailAuth();
  
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

  // Form validation
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

  // Reset form
  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setUsername('');
    setRememberMe(false);
    setAcceptTerms(false);
    setErrorMessage('');
  };

  // Handle authentication
  const handleEmailAuth = async (isSignUp: boolean) => {
    if (!validateForm(isSignUp)) {
      return;
    }

    try {
      if (isSignUp) {
        const result = await signUp(email, password, username);
        if (result.error) {
          setErrorMessage(result.error.message);
        } else {
          resetForm();
        }
      } else {
        const result = await signIn(email, password);
        if (result.error) {
          setErrorMessage(result.error.message);
        } else {
          resetForm();
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      setErrorMessage('An unexpected error occurred');
    }
  };

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
