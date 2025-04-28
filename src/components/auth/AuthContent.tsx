
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
  const auth = useAuth();
  
  // Use the auth hook from contexts/AuthContext.tsx
  // We'll create a compatibility layer here
  const {
    signIn,
    signUp,
    resetPassword,
    updatePassword,
    error
  } = auth;
  
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
    
    if (error) {
      setErrorMessage(error.message || 'Authentication error');
    }
  }, [currentView, error]);

  // Helper functions for auth operations
  const handleEmailAuth = async (isSignUp: boolean) => {
    try {
      if (isSignUp) {
        await signUp(email, password, { username, acceptTerms });
      } else {
        await signIn(email, password, { rememberMe });
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
  
  const handlePasswordResetRequest = async () => {
    try {
      await resetPassword(email);
      setResetSuccessMessage('Password reset link has been sent to your email');
    } catch (err) {
      const error = err as Error;
      setResetErrorMessage(error.message || 'Failed to send reset link');
    }
  };
  
  const handlePasswordReset = async () => {
    try {
      await updatePassword(resetPasswordVal);
      setCurrentView('reset-success');
    } catch (err) {
      const error = err as Error;
      setResetErrorMessage(error.message || 'Failed to update password');
    }
  };
  
  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setUsername('');
    setRememberMe(false);
    setAcceptTerms(false);
    setErrorMessage('');
  };

  const handleVerificationResend = async () => {
    console.log('Attempting to resend verification email to:', lastEnteredEmail);
    // Implement verification resend logic
    setEmail(lastEnteredEmail);
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
            isLoading={auth.isLoading}
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
            isLoading={auth.isLoading}
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
            password={resetPasswordVal}
            confirmPassword={resetConfirmPassword}
            errorMessage={resetErrorMessage}
            successMessage={resetSuccessMessage}
            isLoading={auth.isLoading}
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
