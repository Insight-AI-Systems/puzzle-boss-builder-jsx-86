
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

/**
 * Terms and conditions checkbox component
 */
const TermsCheckbox = ({ checked, onCheckedChange, error }) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="agreeTerms"
          checked={checked}
          onCheckedChange={onCheckedChange}
        />
        <Label htmlFor="agreeTerms" className="text-sm">
          I agree to the Terms & Conditions and Privacy Policy
        </Label>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default TermsCheckbox;
