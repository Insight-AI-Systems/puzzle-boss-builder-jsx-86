
import React from 'react';
import { ResetPasswordRequestForm } from '../forms/ResetPasswordRequestForm';

interface ResetPasswordRequestViewProps {
  email: string;
  errorMessage: string;
  isLoading: boolean;
  setEmail: (email: string) => void;
  handlePasswordResetRequest: () => void;
  goBack: () => void;
}

export const ResetPasswordRequestView: React.FC<ResetPasswordRequestViewProps> = ({
  email,
  errorMessage,
  isLoading,
  setEmail,
  handlePasswordResetRequest,
  goBack,
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold">Reset Password</h2>
        <p className="text-muted-foreground mt-1">
          Enter your email and we'll send you instructions to reset your password
        </p>
      </div>
      
      <ResetPasswordRequestForm 
        email={email}
        errorMessage={errorMessage}
        isLoading={isLoading}
        setEmail={setEmail}
        handleSubmit={handlePasswordResetRequest}
        goBack={goBack}
      />
    </div>
  );
};
