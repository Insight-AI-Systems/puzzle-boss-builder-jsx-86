
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Mail } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface ResetPasswordRequestFormProps {
  email: string;
  errorMessage: string;
  isLoading: boolean;
  setEmail: (email: string) => void;
  handleSubmit: () => void;
  goBack: () => void;
}

export const ResetPasswordRequestForm: React.FC<ResetPasswordRequestFormProps> = ({
  email,
  errorMessage,
  isLoading,
  setEmail,
  handleSubmit,
  goBack,
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
        <Label htmlFor="reset-email">Email</Label>
        <Input
          id="reset-email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
        />
      </div>
      
      <Button
        className="w-full"
        onClick={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Mail className="mr-2 h-4 w-4" />
        )}
        Send Reset Instructions
      </Button>
      
      <Button
        variant="ghost"
        className="w-full mt-2"
        onClick={goBack}
        disabled={isLoading}
      >
        Back to Sign In
      </Button>
    </div>
  );
};
