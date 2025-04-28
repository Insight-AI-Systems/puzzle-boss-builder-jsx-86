
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Mail, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface ResetPasswordRequestFormProps {
  email: string;
  errorMessage: string;
  successMessage: string;
  isLoading: boolean;
  setEmail: (email: string) => void;
  handleSubmit: () => void;
  goBack: () => void;
}

export const ResetPasswordRequestForm: React.FC<ResetPasswordRequestFormProps> = ({
  email,
  errorMessage,
  successMessage,
  isLoading,
  setEmail,
  handleSubmit,
  goBack,
}) => {
  const [validationError, setValidationError] = useState<string>('');
  
  // Clear validation error when email changes or is already set
  useEffect(() => {
    if (email) {
      setValidationError('');
    }
  }, [email]);

  // Clear validation error when component mounts if email is already present
  useEffect(() => {
    if (email) {
      setValidationError('');
    }
  }, []);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Client-side validation
    if (!email) {
      setValidationError('Email is required');
      return;
    }
    
    // Clear validation error before submitting
    setValidationError('');
    
    handleSubmit();
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {errorMessage && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
      
      {successMessage && (
        <Alert variant="default" className="bg-puzzle-aqua/10 border-puzzle-aqua text-puzzle-white">
          <Info className="h-4 w-4" />
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      {validationError && !errorMessage && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{validationError}</AlertDescription>
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
        disabled={isLoading || !!successMessage || !email}
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Mail className="mr-2 h-4 w-4" />
        )}
        Send Reset Instructions
      </Button>
      
      <Button
        type="button"
        variant="ghost"
        className="w-full mt-2"
        onClick={goBack}
        disabled={isLoading}
      >
        Back to Sign In
      </Button>
      
      <div className="text-xs text-center text-muted-foreground">
        <Info className="inline-block h-3 w-3 mr-1" />
        For security reasons, we won&apos;t disclose if an email exists
      </div>
    </form>
  );
};
