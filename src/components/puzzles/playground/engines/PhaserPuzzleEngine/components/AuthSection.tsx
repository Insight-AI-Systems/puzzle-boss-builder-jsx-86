
import React from 'react';
import { useAuth } from '@/hooks/auth/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AuthSectionProps {
  puzzleId: string;
}

const AuthSection: React.FC<AuthSectionProps> = ({ puzzleId }) => {
  const { isAuthenticated, user, signIn } = useAuth();

  const handleSignIn = () => {
    // The error is here - signIn expects email and password parameters
    // Since we can't directly call signIn() without parameters, we need to route to the auth page instead
    window.location.href = '/auth?redirect=/puzzle-test-playground';
  };

  if (isAuthenticated && user) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Track Your Progress</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-sm text-muted-foreground mb-4">
            Your completed puzzles and scores are being saved to your account.
          </p>
          <div className="bg-muted rounded-md p-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                {user.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <p className="font-medium">{user.email?.split('@')[0] || 'User'}</p>
                <p className="text-xs text-muted-foreground">Signed in</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Save Your Scores</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground mb-4">
          Sign in to save your progress, track your scores, and compete on the leaderboard.
        </p>
        <Button onClick={handleSignIn} className="w-full">
          Sign In to Save Progress
        </Button>
      </CardContent>
    </Card>
  );
};

export default AuthSection;
