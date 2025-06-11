
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Mail, Key, ArrowLeft } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { useCustomPasswordReset } from '@/hooks/auth/useCustomPasswordReset';

interface CustomPasswordResetFormProps {
  onBack: () => void;
}

export const CustomPasswordResetForm: React.FC<CustomPasswordResetFormProps> = ({ onBack }) => {
  const {
    email,
    newPassword,
    confirmPassword,
    resetToken,
    errorMessage,
    successMessage,
    isLoading,
    step,
    setEmail,
    setNewPassword,
    setConfirmPassword,
    setResetToken,
    setErrorMessage,
    handlePasswordResetRequest,
    handlePasswordReset,
    setStep
  } = useCustomPasswordReset();

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    handlePasswordResetRequest();
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    handlePasswordReset();
  };

  const handleBackToRequest = () => {
    setStep('request');
    setErrorMessage('');
    setResetToken('');
  };

  if (step === 'request') {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Reset Password</h2>
          <p className="text-muted-foreground mt-1">
            Enter your email and we'll send you a reset code
          </p>
        </div>
        
        <form onSubmit={handleRequestSubmit} className="space-y-4">
          {errorMessage && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
          
          {successMessage && (
            <Alert className="bg-green-50 border-green-200 text-green-800">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="reset-email">Email</Label>
            <Input
              id="reset-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              autoComplete="email"
            />
          </div>
          
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || !email}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Mail className="mr-2 h-4 w-4" />
            )}
            Send Reset Code
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={onBack}
            disabled={isLoading}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Sign In
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold">Enter Reset Code</h2>
        <p className="text-muted-foreground mt-1">
          Enter the reset code sent to {email}
        </p>
      </div>
      
      <form onSubmit={handleResetSubmit} className="space-y-4">
        {errorMessage && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
        
        {successMessage && (
          <Alert className="bg-green-50 border-green-200 text-green-800">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="reset-code">Reset Code</Label>
          <Input
            id="reset-code"
            type="text"
            placeholder="Enter the code from your email"
            value={resetToken}
            onChange={(e) => setResetToken(e.target.value)}
            disabled={isLoading}
            className="text-center text-lg tracking-wider"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="new-password">New Password</Label>
          <Input
            id="new-password"
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm-password">Confirm Password</Label>
          <Input
            id="confirm-password"
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={isLoading}
          />
        </div>
        
        <Button
          type="submit"
          className="w-full"
          disabled={isLoading || !resetToken || !newPassword || !confirmPassword}
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Key className="mr-2 h-4 w-4" />
          )}
          Reset Password
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          className="w-full"
          onClick={handleBackToRequest}
          disabled={isLoading}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Email Entry
        </Button>
      </form>
    </div>
  );
};
