
import React from 'react';
import { SignInView } from './views/SignInView';
import { ResetPasswordRequestView } from './views/ResetPasswordRequestView';
import { ResetPasswordConfirmView } from './views/ResetPasswordConfirmView';
import { ResetPasswordSuccessView } from './views/ResetPasswordSuccessView';
import { VerificationPendingView } from './views/VerificationPendingView';
import { useAuth } from '@/contexts/AuthContext';
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
  const auth = useAuth();
  
  // Local state for form handling
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [rememberMe, setRememberMe] = React.useState(false);
  const [acceptTerms, setAcceptTerms] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [resetPasswordVal, setResetPassword] = React.useState('');
  const [resetConfirmPassword, setResetConfirmPassword] = React.useState('');
  const [resetErrorMessage, setResetErrorMessage] = React.useState('');
  const [resetSuccessMessage, setResetSuccessMessage] = React.useState('');
  
  // Clear error messages when changing views
  React.useEffect(() => {
    setErrorMessage('');
    setResetErrorMessage('');
    
    if (auth.error) {
      setErrorMessage(auth.error);
    }
  }, [currentView, auth.error]);

  // Helper functions for auth operations
  const handleEmailAuth = async (isSignUp: boolean) => {
    try {
      if (isSignUp) {
        await auth.signUp(email, password, { username, acceptTerms });
        setCurrentView('verification-pending');
      } else {
        await auth.signIn(email, password);
      }
    } catch (err) {
      const error = err as Error;
      setErrorMessage(error.message || 'Authentication failed');
    }
  };
  
  const handleGoogleAuth = async () => {
    // Implement Google auth if needed
    console.log("Google auth not implemented");
  };
  
  const handlePasswordResetRequest = async (resetEmail: string) => {
    try {
      await auth.resetPassword(resetEmail);
      setResetSuccessMessage('Password reset email sent successfully');
      setCurrentView('reset-password-success');
    } catch (err) {
      const error = err as Error;
      setResetErrorMessage(error.message || 'Failed to send reset email');
    }
  };

  const handlePasswordUpdate = async (newPassword: string) => {
    try {
      await auth.updatePassword(newPassword);
      setResetSuccessMessage('Password updated successfully');
      setCurrentView('reset-password-success');
    } catch (err) {
      const error = err as Error;
      setResetErrorMessage(error.message || 'Failed to update password');
    }
  };

  // Render different views based on current state
  switch (currentView) {
    case 'signin':
    case 'signup':
      return (
        <SignInView
          currentView={currentView}
          setCurrentView={setCurrentView}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          username={username}
          setUsername={setUsername}
          rememberMe={rememberMe}
          setRememberMe={setRememberMe}
          acceptTerms={acceptTerms}
          setAcceptTerms={setAcceptTerms}
          errorMessage={errorMessage}
          handleEmailAuth={handleEmailAuth}
          handleGoogleAuth={handleGoogleAuth}
          isLoading={auth.isLoading}
        />
      );

    case 'reset-password-request':
      return (
        <ResetPasswordRequestView
          setCurrentView={setCurrentView}
          resetEmail={resetPasswordVal}
          setResetEmail={setResetPassword}
          resetErrorMessage={resetErrorMessage}
          handlePasswordResetRequest={handlePasswordResetRequest}
        />
      );

    case 'reset-password-confirm':
      return (
        <ResetPasswordConfirmView
          setCurrentView={setCurrentView}
          newPassword={resetPasswordVal}
          setNewPassword={setResetPassword}
          confirmNewPassword={resetConfirmPassword}
          setConfirmNewPassword={setResetConfirmPassword}
          resetErrorMessage={resetErrorMessage}
          handlePasswordUpdate={handlePasswordUpdate}
        />
      );

    case 'reset-password-success':
      return (
        <ResetPasswordSuccessView
          setCurrentView={setCurrentView}
          successMessage={resetSuccessMessage}
        />
      );

    case 'verification-pending':
      return (
        <VerificationPendingView
          setCurrentView={setCurrentView}
          email={lastEnteredEmail || email}
        />
      );

    default:
      return (
        <SignInView
          currentView="signin"
          setCurrentView={setCurrentView}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          username={username}
          setUsername={setUsername}
          rememberMe={rememberMe}
          setRememberMe={setRememberMe}
          acceptTerms={acceptTerms}
          setAcceptTerms={setAcceptTerms}
          errorMessage={errorMessage}
          handleEmailAuth={handleEmailAuth}
          handleGoogleAuth={handleGoogleAuth}
          isLoading={auth.isLoading}
        />
      );
  }
};
