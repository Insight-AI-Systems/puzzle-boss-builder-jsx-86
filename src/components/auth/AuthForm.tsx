
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SignInView } from './views/SignInView';
import { ResetPasswordRequestView } from './views/ResetPasswordRequestView';
import { ResetPasswordConfirmView } from './views/ResetPasswordConfirmView';
import { ResetPasswordSuccessView } from './views/ResetPasswordSuccessView';
import { useAuth } from '@/hooks/auth/useAuth';

type AuthView = 'signin' | 'signup' | 'reset-request' | 'reset-confirm' | 'reset-success';

export const AuthForm = () => {
  const [searchParams] = useSearchParams();
  const [currentView, setCurrentView] = useState<AuthView>('signin');
  const {
    email,
    password,
    confirmPassword,
    errorMessage,
    isLoading,
    setEmail,
    setPassword,
    setConfirmPassword,
    resetForm,
    handleEmailAuth,
    handleGoogleAuth,
    handlePasswordResetRequest,
    handlePasswordReset
  } = useAuth();
  
  // Check for password reset token in URL
  useEffect(() => {
    const type = searchParams.get('type');
    if (type === 'recovery') {
      setCurrentView('reset-confirm');
    }
  }, [searchParams]);

  const renderAuthView = () => {
    switch (currentView) {
      case 'signin':
      case 'signup':
        return (
          <SignInView 
            email={email}
            password={password}
            errorMessage={errorMessage}
            isLoading={isLoading}
            setEmail={setEmail}
            setPassword={setPassword}
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
            errorMessage={errorMessage}
            isLoading={isLoading}
            setEmail={setEmail}
            handlePasswordResetRequest={() => handlePasswordResetRequest(email)}
            goBack={() => {
              resetForm();
              setCurrentView('signin');
            }}
          />
        );
        
      case 'reset-confirm':
        return (
          <ResetPasswordConfirmView 
            password={password}
            confirmPassword={confirmPassword}
            errorMessage={errorMessage}
            isLoading={isLoading}
            setPassword={setPassword}
            setConfirmPassword={setConfirmPassword}
            handlePasswordReset={() => {
              handlePasswordReset();
              setCurrentView('reset-success');
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
        
      default:
        return null;
    }
  };

  return (
    <div className="card-highlight p-6 bg-puzzle-black/50 border border-puzzle-aqua/20 rounded-lg shadow-lg">
      {renderAuthView()}
    </div>
  );
};
