
import React from 'react';
import { Button } from '@/components/ui/button';
import { SignInButton, SignUpButton, UserButton } from '@clerk/clerk-react';
import { useClerkAuth } from '@/hooks/useClerkAuth';

interface AuthSectionProps {
  onAuthRequired?: () => void;
}

export const AuthSection: React.FC<AuthSectionProps> = ({ onAuthRequired }) => {
  const { isAuthenticated, user } = useClerkAuth();

  if (isAuthenticated && user) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-puzzle-white">Welcome, {user.username || user.firstName || user.primaryEmailAddress?.emailAddress}!</span>
        <UserButton afterSignOutUrl="/" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-6 bg-puzzle-gray rounded-lg border border-puzzle-border">
      <h3 className="text-lg font-semibold text-puzzle-white">Sign in to play!</h3>
      <p className="text-puzzle-white/70">
        Create an account or sign in to save your progress and compete on the leaderboards.
      </p>
      <div className="flex gap-2">
        <SignInButton mode="modal">
          <Button variant="outline" className="flex-1">
            Sign In
          </Button>
        </SignInButton>
        <SignUpButton mode="modal">
          <Button className="flex-1 bg-puzzle-aqua hover:bg-puzzle-aqua/80">
            Sign Up
          </Button>
        </SignUpButton>
      </div>
    </div>
  );
};
