
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PasswordStrengthIndicator } from '@/components/auth/PasswordStrengthIndicator';
import { getPasswordStrength } from '@/utils/authValidation';

interface PasswordSectionProps {
  password: string;
  confirmPassword: string;
  setPassword: (password: string) => void;
  setConfirmPassword: (password: string) => void;
  isLoading: boolean;
}

export const PasswordSection: React.FC<PasswordSectionProps> = ({
  password,
  confirmPassword,
  setPassword,
  setConfirmPassword,
  isLoading
}) => {
  const passwordStrength = getPasswordStrength(password);

  return (
    <>
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
    </>
  );
};
