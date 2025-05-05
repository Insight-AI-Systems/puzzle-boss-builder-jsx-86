
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AuthenticatedUserCardProps {
  user: {
    email?: string | null;
  };
}

const AuthenticatedUserCard: React.FC<AuthenticatedUserCardProps> = ({ user }) => {
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
};

export default AuthenticatedUserCard;
