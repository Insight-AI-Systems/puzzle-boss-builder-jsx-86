
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

interface ResetPasswordSuccessProps {
  goToSignIn: () => void;
}

export const ResetPasswordSuccess: React.FC<ResetPasswordSuccessProps> = ({ goToSignIn }) => {
  return (
    <div className="space-y-6 text-center">
      <div className="mx-auto rounded-full bg-green-100 p-3 w-fit">
        <Check className="h-8 w-8 text-green-600" />
      </div>
      
      <div className="space-y-2">
        <h3 className="text-xl font-medium">Password Reset Successful</h3>
        <p className="text-muted-foreground">
          Your password has been successfully reset. You can now sign in with your new password.
        </p>
      </div>

      <Button onClick={goToSignIn} className="w-full">
        Return to Sign In
      </Button>
    </div>
  );
};
