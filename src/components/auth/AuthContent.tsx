
import React from 'react';
import SignInView from './views/SignInView';
import SignUpView from './views/SignUpView';
import ResetPasswordRequestView from './views/ResetPasswordRequestView';
import ResetPasswordConfirmView from './views/ResetPasswordConfirmView';
import ResetPasswordSuccessView from './views/ResetPasswordSuccessView';
import VerificationPendingView from './views/VerificationPendingView';
import { useAuthState } from '@/contexts/auth/AuthStateContext';

/**
 * Auth view type definitions
 */
type AuthViewType =
  | 'signIn'
  | 'signUp'
  | 'resetRequest'
  | 'resetConfirm'
  | 'resetSuccess'
  | 'verificationPending'
  | 'verificationSuccess';

/**
 * Props for the AuthContent component
 */
interface AuthContentProps {
  defaultView?: AuthViewType;
  allowedViews?: AuthViewType[];
  redirectAuthenticated?: string;
  showTitle?: boolean;
}

/**
 * Props for the VerificationPendingView component
 */
interface VerificationPendingViewProps {
  email: string;
  onBackToSignIn?: () => void;
}

/**
 * AuthContent component that manages different authentication views
 * such as sign in, sign up, and password reset flows.
 */
const AuthContent: React.FC<AuthContentProps> = ({
  defaultView = 'signIn',
  allowedViews = ['signIn', 'signUp', 'resetRequest', 'resetConfirm', 'resetSuccess', 'verificationPending', 'verificationSuccess'],
  redirectAuthenticated,
  showTitle = true,
}) => {
  // Authentication state
  const { isAuthenticated } = useAuthState();
  
  // View state management
  const [currentView, setCurrentView] = React.useState<AuthViewType>(defaultView);
  const [email, setEmail] = React.useState<string>('');
  const [token, setToken] = React.useState<string | null>(null);
  
  // Redirect authenticated users if needed
  React.useEffect(() => {
    if (isAuthenticated && redirectAuthenticated) {
      window.location.href = redirectAuthenticated;
    }
  }, [isAuthenticated, redirectAuthenticated]);
  
  // Check for reset password token in URL
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const resetToken = urlParams.get('token');
    
    if (resetToken) {
      setToken(resetToken);
      if (allowedViews.includes('resetConfirm')) {
        setCurrentView('resetConfirm');
      }
    }
  }, [allowedViews]);
  
  // Handler for going to sign in view
  const handleGoToSignIn = () => {
    if (allowedViews.includes('signIn')) {
      setCurrentView('signIn');
    }
  };
  
  // Handler for going to sign up view
  const handleGoToSignUp = () => {
    if (allowedViews.includes('signUp')) {
      setCurrentView('signUp');
    }
  };
  
  // Handler for going to reset password request view
  const handleGoToResetRequest = () => {
    if (allowedViews.includes('resetRequest')) {
      setCurrentView('resetRequest');
    }
  };
  
  // Handler for completing a reset password request
  const handleResetRequestComplete = (requestEmail: string) => {
    setEmail(requestEmail);
    setCurrentView('verificationPending');
  };
  
  // Handler for completing a reset password confirmation
  const handleResetComplete = () => {
    if (allowedViews.includes('resetSuccess')) {
      setCurrentView('resetSuccess');
    }
  };
  
  // Handler for completing sign up
  const handleSignUpComplete = (signUpEmail: string) => {
    setEmail(signUpEmail);
    setCurrentView('verificationPending');
  };
  
  // Render the current view based on state
  const renderView = () => {
    switch (currentView) {
      case 'signIn':
        return (
          <SignInView
            onGoToSignUp={allowedViews.includes('signUp') ? handleGoToSignUp : undefined}
            onGoToResetPassword={allowedViews.includes('resetRequest') ? handleGoToResetRequest : undefined}
          />
        );
        
      case 'signUp':
        return (
          <SignUpView
            onGoToSignIn={handleGoToSignIn}
            onSignUpComplete={handleSignUpComplete}
          />
        );
        
      case 'resetRequest':
        return (
          <ResetPasswordRequestView
            onBackToSignIn={handleGoToSignIn}
            onResetRequestComplete={handleResetRequestComplete}
          />
        );
        
      case 'resetConfirm':
        return (
          <ResetPasswordConfirmView
            token={token}
            onResetComplete={handleResetComplete}
          />
        );
        
      case 'resetSuccess':
        return (
          <ResetPasswordSuccessView
            onBackToSignIn={handleGoToSignIn}
          />
        );
        
      case 'verificationPending':
        return (
          <VerificationPendingView
            email={email}
            onBackToSignIn={handleGoToSignIn}
          />
        );

      // Add other cases as needed
        
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
      {showTitle && (
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">
          {currentView === 'signIn' && 'Sign In'}
          {currentView === 'signUp' && 'Create Account'}
          {currentView === 'resetRequest' && 'Reset Password'}
          {currentView === 'resetConfirm' && 'Set New Password'}
          {currentView === 'resetSuccess' && 'Password Updated'}
          {currentView === 'verificationPending' && 'Check Your Email'}
          {currentView === 'verificationSuccess' && 'Email Verified'}
        </h1>
      )}
      {renderView()}
    </div>
  );
};

export default AuthContent;
