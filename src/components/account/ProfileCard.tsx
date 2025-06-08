
import React from 'react';
import { Link } from 'react-router-dom';
import { Edit } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserProfile } from '@/types/userTypes';

interface ProfileCardProps {
  profile: UserProfile | null;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ profile }) => {
  return (
    <Card className="border-puzzle-aqua/30 bg-puzzle-black/50">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-puzzle-white">Your Profile</CardTitle>
          <Link to="/profile">
            <Button variant="ghost" size="sm">
              <Edit className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-puzzle-white">
            {profile?.display_name || 'Puzzle Enthusiast'}
          </h3>
          <p className="text-sm text-puzzle-white/70 capitalize">{profile?.role || 'player'}</p>
        </div>
        
        <div className="pt-4 border-t border-puzzle-aqua/10">
          <Link to="/profile">
            <Button variant="outline" className="w-full border-puzzle-aqua/50 hover:bg-puzzle-aqua/10">
              Edit Profile
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
