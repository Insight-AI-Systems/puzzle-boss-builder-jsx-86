
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Key } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { PasswordStrengthIndicator } from '@/components/auth/PasswordStrengthIndicator';
import { getPasswordStrength } from '@/utils/authValidation';

interface ResetPasswordConfirmFormProps {
  password: string;
  confirmPassword: string;
  errorMessage: string;
  successMessage: string;
  isLoading: boolean;
  setPassword: (password: string) => void;
  setConfirmPassword: (confirmPassword: string) => void;
  handleSubmit: () => void;
}

export const ResetPasswordConfirmForm: React.FC<ResetPasswordConfirmFormProps> = ({
  password,
  confirmPassword,
  errorMessage,
  successMessage,
  isLoading,
  setPassword,
  setConfirmPassword,
  handleSubmit,
}) => {
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit();
  };
  
  // Calculate password strength for the indicator
  const passwordStrength = getPasswordStrength(password);

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {errorMessage && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
      
      {successMessage && (
        <Alert variant="default" className="bg-green-900/30 border-green-500 text-green-50">
          <AlertCircle className="h-4 w-4 text-green-500" />
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="new-password">New Password</Label>
        <Input
          id="new-password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading || !!successMessage}
          autoComplete="new-password"
        />
        <PasswordStrengthIndicator score={passwordStrength.score} label={passwordStrength.label} />
        <p className="text-xs text-muted-foreground">
          Password must be at least 8 characters and include uppercase, lowercase, 
          number, and special character
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirm-password">Confirm Password</Label>
        <Input
          id="confirm-password"
          type="password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={isLoading || !!successMessage}
          autoComplete="new-password"
        />
      </div>
      
      <Button
        type="submit"
        className="w-full"
        disabled={isLoading || password !== confirmPassword || !password || !!successMessage}
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Key className="mr-2 h-4 w-4" />
        )}
        Reset Password
      </Button>
    </form>
  );
};
