
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface TermsCheckboxProps {
  checked: boolean;
  error?: string;
  onCheckedChange: (checked: boolean) => void;
}

const TermsCheckbox: React.FC<TermsCheckboxProps> = ({
  checked,
  error,
  onCheckedChange
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="agreeTerms"
          name="agreeTerms"
          checked={checked}
          onCheckedChange={onCheckedChange}
        />
        <Label htmlFor="agreeTerms" className="text-sm">
          I agree to the{' '}
          <a href="/terms" className="text-puzzle-aqua hover:underline">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="/privacy" className="text-puzzle-aqua hover:underline">
            Privacy Policy
          </a>
        </Label>
      </div>
      {error && (
        <p className="text-red-500 text-xs">{error}</p>
      )}
    </div>
  );
};

export default TermsCheckbox;
