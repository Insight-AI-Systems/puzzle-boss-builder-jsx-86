
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SignInCardProps {
  onSignIn: () => void;
}

const SignInCard: React.FC<SignInCardProps> = ({ onSignIn }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Save Your Scores</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground mb-4">
          Sign in to save your progress, track your scores, and compete on the leaderboard.
        </p>
        <Button onClick={onSignIn} className="w-full">
          Sign In to Save Progress
        </Button>
      </CardContent>
    </Card>
  );
};

export default SignInCard;
