
import React, { useEffect } from 'react';
import { SignInView } from './views/SignInView';
import { ResetRequestView } from './views/ResetRequestView';
import { ResetConfirmView } from './views/ResetConfirmView';
import { ResetSuccessView } from './views/ResetSuccessView';
import { VerificationPendingView } from './views/VerificationPendingView';
import { VerificationSuccessView } from './views/VerificationSuccessView';
import { useAuth } from '@/hooks/auth';
import { AuthView } from '@/types/auth';

interface AuthContentProps {
  currentView: AuthView;
  setCurrentView: (view: AuthView) => void;
  lastEnteredEmail: string;
}

export const AuthContent: React.FC<AuthContentProps> = ({ 
  currentView,
  setCurrentView, 
  lastEnteredEmail
}) => {
  const {
    // From useAuthState
    error,
    clearAuthError,
    
    // From useAuthOperations
    signIn,
    signUp,
    resetPassword,
    updatePassword,
  } = useAuth();
  
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [rememberMe, setRememberMe] = React.useState(false);
  const [acceptTerms, setAcceptTerms] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  
  // Update error state when error from auth context changes
  useEffect(() => {
    if (error) {
      setErrorMessage(error.message);
    } else {
      setErrorMessage('');
    }
  }, [error]);
  
  // Reset error when view changes
  useEffect(() => {
    clearAuthError();
    setErrorMessage('');
  }, [currentView, clearAuthError]);
  
  // Fill email field with last entered email when view changes
  useEffect(() => {
    if (lastEnteredEmail && currentView === 'reset-request') {
      setEmail(lastEnteredEmail);
    }
  }, [lastEnteredEmail, currentView]);
  
  // Validate form inputs
  const validateForm = (isSignUp: boolean = false): boolean => {
    clearAuthError();
    
    // Validate email
    if (!email) {
      setErrorMessage('Email is required');
      return false;
    }
    
    // Validate password
    if (!password && currentView !== 'reset-request') {
      setErrorMessage('Password is required');
      return false;
    }
    
    // Additional validation for signup
    if (isSignUp) {
      // Validate username
      if (!username) {
        setErrorMessage('Username is required');
        return false;
      }
      
      // Validate password confirmation
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match');
        return false;
      }
      
      // Validate terms acceptance
      if (!acceptTerms) {
        setErrorMessage('You must accept the terms and conditions');
        return false;
      }
    }
    
    return true;
  };
  
  // Handle email authentication
  const handleEmailAuth = async (isSignUp: boolean) => {
    try {
      if (!validateForm(isSignUp)) {
        return;
      }
      
      setIsLoading(true);
      
      if (isSignUp) {
        await signUp(email, password, { username });
        setCurrentView('verification-pending');
      } else {
        await signIn(email, password, { rememberMe });
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setErrorMessage((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle password reset request
  const handlePasswordResetRequest = async () => {
    try {
      if (!email) {
        setErrorMessage('Email is required');
        return;
      }
      
      setIsLoading(true);
      await resetPassword(email);
      setCurrentView('reset-request');
    } catch (error) {
      console.error('Password reset error:', error);
      setErrorMessage((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle password reset
  const handlePasswordReset = async () => {
    try {
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match');
        return;
      }
      
      if (!password) {
        setErrorMessage('Password is required');
        return;
      }
      
      setIsLoading(true);
      await updatePassword(password);
      setCurrentView('reset-success');
    } catch (error) {
      console.error('Password reset error:', error);
      setErrorMessage((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleForgotPassword = () => {
    setCurrentView('reset-request');
  };

  // Render the appropriate view based on the current view state
  switch (currentView) {
    case 'signin':
    case 'signup':
      return (
        <SignInView
          email={email}
          password={password}
          confirmPassword={confirmPassword}
          username={username}
          rememberMe={rememberMe}
          acceptTerms={acceptTerms}
          errorMessage={errorMessage}
          isLoading={isLoading}
          setEmail={setEmail}
          setPassword={setPassword}
          setConfirmPassword={setConfirmPassword}
          setUsername={setUsername}
          setRememberMe={setRememberMe}
          setAcceptTerms={setAcceptTerms}
          handleEmailAuth={handleEmailAuth}
          handleGoogleAuth={() => {}} // We'll implement this later
          onForgotPassword={handleForgotPassword}
          currentView={currentView}
          setCurrentView={setCurrentView}
        />
      );
    case 'reset-request':
      return (
        <ResetRequestView
          email={email}
          setEmail={setEmail}
          errorMessage={errorMessage}
          isLoading={isLoading}
          onSubmit={handlePasswordResetRequest}
          onBackToSignIn={() => setCurrentView('signin')}
        />
      );
    case 'reset-confirm':
      return (
        <ResetConfirmView
          password={password}
          confirmPassword={confirmPassword}
          setPassword={setPassword}
          setConfirmPassword={setConfirmPassword}
          errorMessage={errorMessage}
          isLoading={isLoading}
          onSubmit={handlePasswordReset}
        />
      );
    case 'reset-success':
      return (
        <ResetSuccessView onBackToSignIn={() => setCurrentView('signin')} />
      );
    case 'verification-pending':
      return (
        <VerificationPendingView 
          email={email}
          onBackToSignIn={() => setCurrentView('signin')}
        />
      );
    case 'verification-success':
      return (
        <VerificationSuccessView onContinue={() => setCurrentView('signin')} />
      );
    default:
      return (
        <SignInView
          email={email}
          password={password}
          confirmPassword={confirmPassword}
          username={username}
          rememberMe={rememberMe}
          acceptTerms={acceptTerms}
          errorMessage={errorMessage}
          isLoading={isLoading}
          setEmail={setEmail}
          setPassword={setPassword}
          setConfirmPassword={setConfirmPassword}
          setUsername={setUsername}
          setRememberMe={setRememberMe}
          setAcceptTerms={setAcceptTerms}
          handleEmailAuth={handleEmailAuth}
          handleGoogleAuth={() => {}} // We'll implement this later
          onForgotPassword={handleForgotPassword}
          currentView={'signin'}
          setCurrentView={setCurrentView}
        />
      );
  }
};
