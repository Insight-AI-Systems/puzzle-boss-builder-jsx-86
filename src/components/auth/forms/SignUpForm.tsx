
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2, Mail } from 'lucide-react';
import LegalDocumentModal from '../modals/LegalDocumentModal';
import Terms from '@/pages/legal/Terms';
import Privacy from '@/pages/legal/Privacy';
import { PasswordSection } from './PasswordSection';
import { TermsAcceptanceSection } from './TermsAcceptanceSection';

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

        <PasswordSection
          password={password}
          confirmPassword={confirmPassword}
          setPassword={setPassword}
          setConfirmPassword={setConfirmPassword}
          isLoading={isLoading}
        />

        <TermsAcceptanceSection
          hasReadTerms={hasReadTerms}
          hasReadPrivacy={hasReadPrivacy}
          acceptTerms={acceptTerms}
          isLoading={isLoading}
          setAcceptTerms={setAcceptTerms}
          setShowTerms={setShowTerms}
          setShowPrivacy={setShowPrivacy}
        />

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
