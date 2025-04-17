
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Key } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface ResetPasswordConfirmFormProps {
  password: string;
  confirmPassword: string;
  errorMessage: string;
  isLoading: boolean;
  setPassword: (password: string) => void;
  setConfirmPassword: (confirmPassword: string) => void;
  handleSubmit: () => void;
}

export const ResetPasswordConfirmForm: React.FC<ResetPasswordConfirmFormProps> = ({
  password,
  confirmPassword,
  errorMessage,
  isLoading,
  setPassword,
  setConfirmPassword,
  handleSubmit,
}) => {
  return (
    <div className="space-y-4">
      {errorMessage && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errorMessage}</AlertDescription>
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
          disabled={isLoading}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirm-password">Confirm Password</Label>
        <Input
          id="confirm-password"
          type="password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={isLoading}
        />
      </div>
      
      <Button
        className="w-full"
        onClick={handleSubmit}
        disabled={isLoading || password !== confirmPassword || !password}
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Key className="mr-2 h-4 w-4" />
        )}
        Reset Password
      </Button>
    </div>
  );
};
