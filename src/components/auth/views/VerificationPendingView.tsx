
import React from 'react';
import { Button } from '@/components/ui/button';
import { Mail, ArrowLeft, RefreshCcw } from 'lucide-react';
import { Alert } from '@/components/ui/alert';

interface VerificationPendingViewProps {
  email?: string;
  goToSignIn: () => void;
  resendVerificationEmail?: () => void;
}

export const VerificationPendingView: React.FC<VerificationPendingViewProps> = ({
  email,
  goToSignIn,
  resendVerificationEmail
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-puzzle-aqua/20 rounded-full flex items-center justify-center mb-4">
          <Mail className="h-8 w-8 text-puzzle-aqua" />
        </div>
        <h2 className="text-2xl font-semibold">Check your email</h2>
        <p className="text-muted-foreground mt-2">
          We've sent a verification email to{' '}
          <span className="text-puzzle-aqua font-medium">
            {email || 'your email address'}
          </span>
        </p>
      </div>
      
      <Alert className="bg-puzzle-aqua/10 border-puzzle-aqua">
        <p className="text-sm">
          Click the link in the email to verify your account and continue.
          If you don't see it, check your spam folder.
        </p>
      </Alert>
      
      <div className="space-y-3">
        {resendVerificationEmail && (
          <Button 
            variant="outline" 
            className="w-full border-puzzle-aqua/30 hover:bg-puzzle-aqua/10"
            onClick={resendVerificationEmail}
          >
            <RefreshCcw className="h-4 w-4 mr-2" />
            Resend verification email
          </Button>
        )}
        
        <Button 
          variant="ghost" 
          className="w-full"
          onClick={goToSignIn}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Sign In
        </Button>
      </div>
    </div>
  );
};
