
import React from 'react';
import SignInView from './views/SignInView';
import SignUpView from './views/SignUpView';
import ResetPasswordRequestView from './views/ResetPasswordRequestView';
import ResetPasswordConfirmView from './views/ResetPasswordConfirmView';
import ResetPasswordSuccessView from './views/ResetPasswordSuccessView';
import VerificationPendingView from './views/VerificationPendingView';
import { useAuthState } from '@/contexts/auth/AuthStateContext';
import { AuthView } from '@/types/auth';

interface AuthContentProps {
  currentView: AuthView;
  setCurrentView: (view: AuthView) => void;
  lastEnteredEmail: string;
}

const AuthContent: React.FC<AuthContentProps> = ({
  currentView,
  setCurrentView,
  lastEnteredEmail
}) => {
  const { isAuthenticated } = useAuthState();
  
  // Redirect authenticated users if needed
  React.useEffect(() => {
    if (isAuthenticated) {
      window.location.href = '/';
    }
  }, [isAuthenticated]);
  
  // Handler for going to sign in view
  const handleGoToSignIn = () => {
    setCurrentView('signin');
  };
  
  // Handler for going to sign up view
  const handleGoToSignUp = () => {
    setCurrentView('signup');
  };
  
  // Handler for going to reset password request view
  const handleGoToResetRequest = () => {
    setCurrentView('reset-request');
  };
  
  // Handler for completing a reset password request
  const handleResetRequestComplete = (email: string) => {
    setCurrentView('verification-pending');
  };
  
  // Handler for completing a reset password confirmation
  const handleResetComplete = () => {
    setCurrentView('reset-success');
  };
  
  // Handler for completing sign up
  const handleSignUpComplete = (email: string) => {
    setCurrentView('verification-pending');
  };
  
  // Render the current view based on state
  const renderView = () => {
    switch (currentView) {
      case 'signin':
        return (
          <SignInView
            onGoToSignUp={handleGoToSignUp}
            onGoToResetPassword={handleGoToResetRequest}
          />
        );
        
      case 'signup':
        return (
          <SignUpView
            onGoToSignIn={handleGoToSignIn}
            onSignUpComplete={handleSignUpComplete}
          />
        );
        
      case 'reset-request':
        return (
          <ResetPasswordRequestView
            onBackToSignIn={handleGoToSignIn}
            onResetRequestComplete={handleResetRequestComplete}
          />
        );
        
      case 'reset-confirm':
        return (
          <ResetPasswordConfirmView
            token={null}
            onResetComplete={handleResetComplete}
          />
        );
        
      case 'reset-success':
        return (
          <ResetPasswordSuccessView
            onBackToSignIn={handleGoToSignIn}
          />
        );
        
      case 'verification-pending':
        return (
          <VerificationPendingView
            email={lastEnteredEmail}
            onBackToSignIn={handleGoToSignIn}
          />
        );
        
      default:
        return (
          <div className="text-center p-4">
            <div className="text-xl font-semibold mb-2">Invalid View</div>
            <button
              onClick={handleGoToSignIn}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Go to Sign In
            </button>
          </div>
        );
    }
  };
  
  return (
    <div className="w-full max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">
        {currentView === 'signin' && 'Sign In'}
        {currentView === 'signup' && 'Create Account'}
        {currentView === 'reset-request' && 'Reset Password'}
        {currentView === 'reset-confirm' && 'Set New Password'}
        {currentView === 'reset-success' && 'Password Updated'}
        {currentView === 'verification-pending' && 'Check Your Email'}
        {currentView === 'verification-success' && 'Email Verified'}
      </h1>
      {renderView()}
    </div>
  );
};

export default AuthContent;
