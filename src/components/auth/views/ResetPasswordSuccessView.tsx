
import React from 'react';

interface ResetPasswordSuccessViewProps {
  onBackToSignIn: () => void;
}

const ResetPasswordSuccessView: React.FC<ResetPasswordSuccessViewProps> = ({
  onBackToSignIn
}) => {
  return (
    <div className="text-center space-y-4">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-8 w-8 text-green-600" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M5 13l4 4L19 7" 
          />
        </svg>
      </div>
      
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Password Reset Successfully</h2>
      
      <p className="text-gray-600 dark:text-gray-300">
        Your password has been updated successfully. You can now sign in with your new password.
      </p>
      
      <div className="pt-4">
        <button
          onClick={onBackToSignIn}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Sign In
        </button>
      </div>
    </div>
  );
};

export default ResetPasswordSuccessView;
