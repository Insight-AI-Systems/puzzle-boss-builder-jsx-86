
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User } from '@/hooks/auth/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface AuthenticatedUserCardProps {
  user: User;
}

const AuthenticatedUserCard: React.FC<AuthenticatedUserCardProps> = ({ user }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Your Game Progress</CardTitle>
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar_url || ''} alt={user.display_name || user.email || 'User'} />
            <AvatarFallback>{(user.display_name || user.email || 'U').charAt(0)}</AvatarFallback>
          </Avatar>
        </div>
        <CardDescription>{user.display_name || user.email}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-2">
          <div className="text-sm text-muted-foreground">
            Your progress will be saved automatically.
          </div>
          <Button variant="outline" size="sm">View My Puzzles</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuthenticatedUserCard;
