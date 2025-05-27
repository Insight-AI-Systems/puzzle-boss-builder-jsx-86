
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

interface ResetPasswordSuccessViewProps {
  title?: string;
  description?: string;
  buttonText?: string;
  goToSignIn: () => void;
}

export const ResetPasswordSuccessView: React.FC<ResetPasswordSuccessViewProps> = ({
  title = 'Password Reset Successful',
  description = 'Your password has been successfully updated. You can now sign in with your new password.',
  buttonText = 'Continue to Sign In',
  goToSignIn,
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-green-900/30 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="h-8 w-8 text-green-500" />
        </div>
        <h2 className="text-2xl font-semibold">{title}</h2>
        <p className="text-muted-foreground mt-2">
          {description}
        </p>
      </div>
      
      <Button className="w-full" onClick={goToSignIn}>
        {buttonText}
      </Button>
    </div>
  );
};
