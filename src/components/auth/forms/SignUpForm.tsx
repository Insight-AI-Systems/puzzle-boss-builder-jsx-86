import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Mail, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { PasswordStrengthIndicator } from '@/components/auth/PasswordStrengthIndicator';
import { getPasswordStrength } from '@/utils/authValidation';
import LegalDocumentModal from '../modals/LegalDocumentModal';
import Terms from '@/pages/legal/Terms';
import Privacy from '@/pages/legal/Privacy';

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
  const [hasReadTerms, setHasReadTerms] = useState(false);
  const [hasReadPrivacy, setHasReadPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit();
  };

  // Calculate password strength for the indicator
  const passwordStrength = getPasswordStrength(password);

  const canAcceptTerms = hasReadTerms && hasReadPrivacy;

  // If they try to check the box before reading both documents
  const handleTermsCheckAttempt = (checked: boolean) => {
    if (!canAcceptTerms && checked) {
      alert("Please read both the Terms of Service and Privacy Policy before accepting");
      return;
    }
    setAcceptTerms(checked);
  };

  return (
    <>
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

        <div className="flex flex-col space-y-2 pt-2">
          <div className="flex items-start space-x-2">
            <Checkbox
              id="signup-terms"
              checked={acceptTerms}
              onCheckedChange={handleTermsCheckAttempt}
              disabled={!canAcceptTerms || isLoading}
            />
            <div className="grid gap-1.5 leading-none">
              <Label 
                htmlFor="signup-terms" 
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I accept the{" "}
                <Button 
                  variant="link" 
                  className="p-0 h-auto font-medium text-puzzle-aqua underline"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowTerms(true);
                  }}
                >
                  Terms of Service
                </Button>
                {" "}and{" "}
                <Button 
                  variant="link" 
                  className="p-0 h-auto font-medium text-puzzle-aqua underline"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowPrivacy(true);
                  }}
                >
                  Privacy Policy
                </Button>
              </Label>
              {!canAcceptTerms && (
                <p className="text-sm text-muted-foreground">
                  Please read both documents before accepting
                </p>
              )}
            </div>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading || !acceptTerms}
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

      <LegalDocumentModal
        isOpen={showTerms}
        title="Terms of Service"
        onClose={() => {
          setShowTerms(false);
          setHasReadTerms(true);
        }}
      >
        <Terms />
      </LegalDocumentModal>

      <LegalDocumentModal
        isOpen={showPrivacy}
        title="Privacy Policy"
        onClose={() => {
          setShowPrivacy(false);
          setHasReadPrivacy(true);
        }}
      >
        <Privacy />
      </LegalDocumentModal>
    </>
  );
};
