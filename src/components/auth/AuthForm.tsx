
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SignInView } from './views/SignInView';
import { ResetPasswordRequestView } from './views/ResetPasswordRequestView';
import { ResetPasswordConfirmView } from './views/ResetPasswordConfirmView';
import { ResetPasswordSuccessView } from './views/ResetPasswordSuccessView';
import { VerificationPendingView } from './views/VerificationPendingView';
import { useAuth } from '@/hooks/auth/useAuth';

type AuthView = 
  | 'signin' 
  | 'signup' 
  | 'reset-request' 
  | 'reset-confirm' 
  | 'reset-success'
  | 'verification-pending'
  | 'verification-success';

export const AuthForm = () => {
  const [searchParams] = useSearchParams();
  const [currentView, setCurrentView] = useState<AuthView>('signin');
  const [lastEnteredEmail, setLastEnteredEmail] = useState<string>('');
  
  const {
    // Email auth states
    email,
    password,
    confirmPassword,
    username,
    rememberMe,
    acceptTerms,
    errorMessage,
    
    // Password reset states
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
    resetForm,
    handleEmailAuth,
    
    // Social auth methods
    handleGoogleAuth,
    
    // Password reset methods
    setResetPassword,
    setResetConfirmPassword,
    setResetErrorMessage,
    handlePasswordResetRequest,
    handlePasswordReset
  } = useAuth();
  
  // Track the last email entered for verification view
  useEffect(() => {
    if (email) {
      setLastEnteredEmail(email);
    }
  }, [email]);
  
  // Check for password reset token in URL (only once on initial load)
  useEffect(() => {
    // Check for verification success
    if (searchParams.get('verificationSuccess') === 'true') {
      setCurrentView('verification-success');
      return;
    }
    
    // Check for verification pending
    if (searchParams.get('view') === 'verification-pending') {
      setCurrentView('verification-pending');
      return;
    }
    
    // Check for password reset
    const type = searchParams.get('type');
    if (type === 'recovery') {
      setCurrentView('reset-confirm');
      return;
    }
    
    // Check for signup parameter
    if (searchParams.get('signup') === 'true') {
      setCurrentView('signup');
      return;
    }
  }, [searchParams]);

  const handlePasswordReset = async () => {
    await handlePasswordResetRequest();
    // Only show the verification pending view if there was no error
    if (!resetErrorMessage) {
      setCurrentView('verification-pending');
    }
  };

  const renderAuthView = () => {
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
            handleGoogleAuth={handleGoogleAuth}
            onForgotPassword={() => setCurrentView('reset-request')}
            currentView={currentView}
            setCurrentView={setCurrentView as (view: string) => void}
          />
        );
        
      case 'reset-request':
        return (
          <ResetPasswordRequestView 
            email={email}
            errorMessage={resetErrorMessage}
            successMessage={resetSuccessMessage}
            isLoading={isLoading}
            setEmail={setEmail}
            handlePasswordResetRequest={handlePasswordReset}
            goBack={() => {
              resetForm();
              setCurrentView('signin');
            }}
          />
        );
        
      case 'reset-confirm':
        return (
          <ResetPasswordConfirmView 
            password={resetPassword}
            confirmPassword={resetConfirmPassword}
            errorMessage={resetErrorMessage}
            successMessage={resetSuccessMessage}
            isLoading={isLoading}
            setPassword={setResetPassword}
            setConfirmPassword={setResetConfirmPassword}
            handlePasswordReset={() => {
              handlePasswordReset();
              // View will change if successful in the useEffect that monitors success
            }}
          />
        );
        
      case 'reset-success':
        return (
          <ResetPasswordSuccessView 
            goToSignIn={() => {
              resetForm();
              setCurrentView('signin');
            }} 
          />
        );
        
      case 'verification-pending':
        return (
          <VerificationPendingView 
            email={lastEnteredEmail}
            goToSignIn={() => {
              resetForm();
              setCurrentView('signin');
            }}
            // We could implement resend verification here
            // resendVerificationEmail={() => {}}
          />
        );
        
      case 'verification-success':
        return (
          <ResetPasswordSuccessView 
            title="Email Verified!"
            description="Your email has been successfully verified. You can now sign in to your account."
            buttonText="Continue to Sign In"
            goToSignIn={() => {
              resetForm();
              setCurrentView('signin');
            }} 
          />
        );
        
      default:
        return null;
    }
  };

  // Watch for password reset success
  useEffect(() => {
    if (resetSuccessMessage && currentView === 'reset-confirm') {
      setCurrentView('reset-success');
    }
  }, [resetSuccessMessage, currentView]);

  return (
    <div className="card-highlight p-6 bg-puzzle-black/50 border border-puzzle-aqua/20 rounded-lg shadow-lg">
      {renderAuthView()}
    </div>
  );
};
