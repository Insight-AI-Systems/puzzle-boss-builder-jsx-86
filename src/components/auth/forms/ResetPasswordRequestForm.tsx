
import React from 'react';
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
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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

      <div className="space-y-2">
        <Label htmlFor="reset-email">Email</Label>
        <Input
          id="reset-email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          required={!email} // Only required if there's no email value
          autoComplete="email"
        />
      </div>
      
      <Button
        type="submit"
        className="w-full"
        disabled={isLoading || !!successMessage}
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
        For security reasons, we won't disclose if an email exists
      </div>
    </form>
  );
};
