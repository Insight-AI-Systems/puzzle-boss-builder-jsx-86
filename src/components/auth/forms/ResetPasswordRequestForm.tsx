
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Mail, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (email) {
      setValidationError('');
    }
  }, [email]);

  useEffect(() => {
    if (email) {
      setValidationError('');
    }
  }, []);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setValidationError('Email is required');
      return;
    }
    
    setValidationError('');
    
    handleSubmit();
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      
      if (error) throw error;
      
      toast({
        title: "Password Reset Email Sent",
        description: "Check your email for a link to reset your password.",
        variant: "default"
      });
      
      // Show success state
      setIsSuccess(true);
    } catch (error) {
      console.error('Error requesting password reset:', error);
      
      // Show error toast
      toast({
        title: "Reset Request Failed",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
        variant: "destructive"
      });
      
      setError(error instanceof Error ? error.message : "Failed to request password reset");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {errorMessage && (
        <Alert variant="destructive" className="border-yellow-500 bg-yellow-500/10">
          <AlertCircle className="h-4 w-4 text-yellow-300" />
          <AlertDescription className="text-yellow-300">{errorMessage}</AlertDescription>
        </Alert>
      )}
      
      {successMessage && (
        <Alert variant="default" className="bg-puzzle-aqua/10 border-puzzle-aqua text-puzzle-white">
          <Info className="h-4 w-4" />
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      {validationError && !errorMessage && (
        <Alert variant="destructive" className="border-yellow-500 bg-yellow-500/10">
          <AlertCircle className="h-4 w-4 text-yellow-300" />
          <AlertDescription className="text-yellow-300">{validationError}</AlertDescription>
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
