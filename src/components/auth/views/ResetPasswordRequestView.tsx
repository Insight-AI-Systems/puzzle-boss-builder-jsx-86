
import React, { useState } from 'react';
import { ResetPasswordRequestForm } from '../forms/ResetPasswordRequestForm';
import { CustomPasswordResetForm } from '../forms/CustomPasswordResetForm';

interface ResetPasswordRequestViewProps {
  email: string;
  errorMessage: string;
  successMessage: string;
  isLoading: boolean;
  setEmail: (email: string) => void;
  handlePasswordResetRequest: () => void;
  goBack: () => void;
}

export const ResetPasswordRequestView: React.FC<ResetPasswordRequestViewProps> = ({
  email,
  errorMessage,
  successMessage,
  isLoading,
  setEmail,
  handlePasswordResetRequest,
  goBack,
}) => {
  const [useCustomReset, setUseCustomReset] = useState(false);

  if (useCustomReset) {
    return <CustomPasswordResetForm onBack={() => setUseCustomReset(false)} />;
  }

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
        successMessage={successMessage}
        isLoading={isLoading}
        setEmail={setEmail}
        handleSubmit={handlePasswordResetRequest}
        goBack={goBack}
      />

      {/* Alternative option if standard reset fails */}
      {errorMessage && (
        <div className="text-center pt-4 border-t">
          <p className="text-sm text-muted-foreground mb-2">
            Not receiving emails?
          </p>
          <button
            type="button"
            onClick={() => setUseCustomReset(true)}
            className="text-sm text-puzzle-aqua hover:underline"
          >
            Try our reliable reset service
          </button>
        </div>
      )}
    </div>
  );
};
