
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from '@supabase/supabase-js';

interface AuthenticatedUserCardProps {
  user: User;
}

const AuthenticatedUserCard: React.FC<AuthenticatedUserCardProps> = ({ user }) => {
  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Logged in as</CardTitle>
        <CardDescription>{user.email}</CardDescription>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="text-sm space-y-2">
          <p>Your game stats will be saved and you can compete on the leaderboard.</p>
          <div className="mt-4">
            <h3 className="text-sm font-semibold mb-1">Your Best Time</h3>
            <p className="text-muted-foreground">No records yet</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuthenticatedUserCard;
