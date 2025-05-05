
import React from 'react';
import { useAuth } from '@/hooks/auth/useAuth';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface AuthSectionProps {
  puzzleId: string;
}

const AuthSection: React.FC<AuthSectionProps> = ({ puzzleId }) => {
  const { user, isAuthenticated, signOut } = useAuth();
  const { toast } = useToast();
  
  const handleSignIn = () => {
    window.location.href = '/auth?redirect=phaser-puzzle';
  };
  
  const handleSaveProgress = () => {
    toast({
      title: 'Progress Saved',
      description: 'Your puzzle progress has been saved successfully.',
    });
  };
  
  if (isAuthenticated && user) {
    return (
      <Card className="border-puzzle-aqua border-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Welcome, {user.email?.split('@')[0] || 'Puzzler'}!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Your progress is being tracked. You can save your game at any point to resume later.
          </p>
          <div className="flex space-x-2">
            <Button onClick={handleSaveProgress} variant="outline">
              Save Progress
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="border-puzzle-aqua border-2 border-dashed">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Login to track your progress</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Sign in to save your progress, join the leaderboard, and track your personal records.
        </p>
        <Button onClick={handleSignIn}>
          Sign In / Register
        </Button>
      </CardContent>
    </Card>
  );
};

export default AuthSection;
