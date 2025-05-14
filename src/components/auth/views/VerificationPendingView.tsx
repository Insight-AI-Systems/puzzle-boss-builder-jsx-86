
import React from 'react';

interface VerificationPendingViewProps {
  email: string;
  onBackToSignIn?: () => void;
}

const VerificationPendingView: React.FC<VerificationPendingViewProps> = ({
  email,
  onBackToSignIn
}) => {
  return (
    <div className="text-center space-y-4">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-8 w-8 text-blue-600" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
          />
        </svg>
      </div>
      
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Check Your Email</h2>
      
      <p className="text-gray-600 dark:text-gray-300">
        We've sent a verification email to:
        <br />
        <span className="font-medium text-blue-600 dark:text-blue-400">{email}</span>
      </p>
      
      <p className="text-gray-600 dark:text-gray-300 text-sm">
        Click on the link in the email to verify your account. If you don't see the email, check your spam folder.
      </p>
      
      {onBackToSignIn && (
        <div className="pt-4">
          <button
            onClick={onBackToSignIn}
            className="px-4 py-2 text-blue-600 bg-transparent rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Back to Sign In
          </button>
        </div>
      )}
    </div>
  );
};

export default VerificationPendingView;
