
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Mail, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { PasswordStrengthIndicator } from '@/components/auth/PasswordStrengthIndicator';
import { getPasswordStrength } from '@/utils/authValidation';
import { Link } from 'react-router-dom';

interface SignUpFormProps {
  email: string;
  password: string;
  confirmPassword: string;
  username: string;
  acceptTerms: boolean;
  errorMessage: string;
  isLoading: boolean;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setConfirmPassword: (confirmPassword: string) => void;
  setUsername: (username: string) => void;
  setAcceptTerms: (acceptTerms: boolean) => void;
  handleSubmit: () => void;
}

export const SignUpForm: React.FC<SignUpFormProps> = ({
  email,
  password,
  confirmPassword,
  username,
  acceptTerms,
  errorMessage,
  isLoading,
  setEmail,
  setPassword,
  setConfirmPassword,
  setUsername,
  setAcceptTerms,
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

      <div className="space-y-2">
        <Label htmlFor="signup-email">Email</Label>
        <Input
          id="signup-email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          required
          autoComplete="email"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="signup-username">Username (optional)</Label>
        <Input
          id="signup-username"
          type="text"
          placeholder="How you'll appear to others"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={isLoading}
          autoComplete="username"
        />
        <p className="text-xs text-muted-foreground">
          Leave blank to use your email name
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="signup-password">Password</Label>
        <Input
          id="signup-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
          required
          autoComplete="new-password"
        />
        <PasswordStrengthIndicator score={passwordStrength.score} label={passwordStrength.label} />
        <p className="text-xs text-muted-foreground">
          Password must be at least 8 characters and include uppercase, lowercase, 
          number, and special character
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="signup-confirm-password">Confirm Password</Label>
        <Input
          id="signup-confirm-password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={isLoading}
          required
          autoComplete="new-password"
        />
      </div>

      <div className="flex items-start space-x-2 pt-2">
        <Checkbox
          id="signup-terms"
          checked={acceptTerms}
          onCheckedChange={(checked) => setAcceptTerms(checked === true)}
          disabled={isLoading}
        />
        <div className="grid gap-1.5 leading-none">
          <Label 
            htmlFor="signup-terms" 
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            I accept the <Link to="/terms" className="text-puzzle-aqua underline">Terms of Service</Link> and{' '}
            <Link to="/privacy" className="text-puzzle-aqua underline">Privacy Policy</Link>
          </Label>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Mail className="mr-2 h-4 w-4" />
        )}
        Create Account
      </Button>

      <div className="text-xs text-center text-muted-foreground">
        <Info className="inline-block h-3 w-3 mr-1" />
        We'll send a verification email to activate your account
      </div>
    </form>
  );
};
