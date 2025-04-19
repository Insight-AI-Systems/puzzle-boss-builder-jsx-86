
import React from 'react';
import { SignInView } from './views/SignInView';
import { ResetPasswordRequestView } from './views/ResetPasswordRequestView';
import { ResetPasswordConfirmView } from './views/ResetPasswordConfirmView';
import { ResetPasswordSuccessView } from './views/ResetPasswordSuccessView';
import { VerificationPendingView } from './views/VerificationPendingView';
import { useAuth } from '@/hooks/auth/useAuth';
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
    email,
    password,
    confirmPassword,
    username,
    rememberMe,
    acceptTerms,
    errorMessage,
    resetPassword,
    resetConfirmPassword,
    resetErrorMessage,
    resetSuccessMessage,
    isLoading,
    setEmail,
    setPassword,
    setConfirmPassword,
    setUsername,
    setRememberMe,
    setAcceptTerms,
    setErrorMessage,
    resetForm,
    handleEmailAuth,
    handleGoogleAuth,
    setResetPassword,
    setResetConfirmPassword,
    setResetErrorMessage,
    handlePasswordResetRequest,
    handlePasswordReset
  } = useAuth();

  // Clear error messages when changing views
  React.useEffect(() => {
    setErrorMessage('');
  }, [currentView, setErrorMessage]);

  const handleVerificationResend = async () => {
    console.log('Attempting to resend verification email to:', lastEnteredEmail);
    await handleEmailAuth(true);
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
            setCurrentView={setCurrentView}
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
            handlePasswordResetRequest={handlePasswordResetRequest}
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
            handlePasswordReset={handlePasswordReset}
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
            resendVerificationEmail={handleVerificationResend}
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

  return (
    <div className="card-highlight p-6 bg-puzzle-black/50 border border-puzzle-aqua/20 rounded-lg shadow-lg">
      {renderAuthView()}
    </div>
  );
};
