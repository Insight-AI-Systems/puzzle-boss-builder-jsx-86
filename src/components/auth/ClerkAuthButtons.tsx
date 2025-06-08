
import React from 'react';
import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';

interface ClerkAuthButtonsProps {
  isMobile?: boolean;
}

export const ClerkAuthButtons: React.FC<ClerkAuthButtonsProps> = ({ isMobile = false }) => {
  const { isSignedIn, user } = useUser();

  if (isSignedIn) {
    return <UserButton afterSignOutUrl="/" />;
  }

  if (isMobile) {
    return (
      <div className="flex items-center space-x-2">
        <SignInButton mode="modal">
          <Button variant="ghost" className="text-muted-foreground">
            Sign In
          </Button>
        </SignInButton>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <SignInButton mode="modal">
        <Button variant="ghost" className="text-muted-foreground hover:text-puzzle-white">
          Sign In
        </Button>
      </SignInButton>
      <SignUpButton mode="modal">
        <Button className="bg-puzzle-aqua hover:bg-puzzle-aqua/80">
          Sign Up
        </Button>
      </SignUpButton>
    </div>
  );
};
