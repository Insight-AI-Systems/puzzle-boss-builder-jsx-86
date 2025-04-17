
import React from 'react';
import { ResetPasswordConfirmForm } from '../forms/ResetPasswordConfirmForm';

interface ResetPasswordConfirmViewProps {
  password: string;
  confirmPassword: string;
  errorMessage: string;
  isLoading: boolean;
  setPassword: (password: string) => void;
  setConfirmPassword: (confirmPassword: string) => void;
  handlePasswordReset: () => void;
}

export const ResetPasswordConfirmView: React.FC<ResetPasswordConfirmViewProps> = ({
  password,
  confirmPassword,
  errorMessage,
  isLoading,
  setPassword,
  setConfirmPassword,
  handlePasswordReset,
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold">Create New Password</h2>
        <p className="text-muted-foreground mt-1">
          Enter your new password below
        </p>
      </div>
      
      <ResetPasswordConfirmForm 
        password={password}
        confirmPassword={confirmPassword}
        errorMessage={errorMessage}
        isLoading={isLoading}
        setPassword={setPassword}
        setConfirmPassword={setConfirmPassword}
        handleSubmit={handlePasswordReset}
      />
    </div>
  );
};
