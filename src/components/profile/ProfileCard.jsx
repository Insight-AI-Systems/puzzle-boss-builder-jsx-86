
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';

/**
 * Component that displays the user's profile information in a card format
 */
const ProfileCard = ({ user, profile, onSignOut }) => {
  // Get initials for avatar fallback
  const getInitials = () => {
    if (profile?.username) {
      return profile.username.charAt(0).toUpperCase();
    }
    return user.email.charAt(0).toUpperCase();
  };

  return (
    <Card className="md:col-span-1 bg-puzzle-black border-puzzle-aqua/30">
      <CardHeader className="text-center">
        <Avatar className="w-24 h-24 mx-auto">
          <AvatarImage src={profile.avatar_url} alt={profile.username || 'User'} />
          <AvatarFallback className="bg-puzzle-aqua text-puzzle-black text-2xl">
            {getInitials()}
          </AvatarFallback>
        </Avatar>
        <CardTitle className="text-puzzle-white mt-4">
          {profile.username || 'Username not set'}
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {user.email}
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <div className="flex flex-col space-y-2 text-sm text-muted-foreground">
          <div>
            <span className="font-semibold">Role:</span> {profile.role}
          </div>
          <div>
            <span className="font-semibold">Credits:</span> {profile.credits}
          </div>
          <div>
            <span className="font-semibold">Member since:</span> {new Date(profile.created_at).toLocaleDateString()}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={onSignOut} 
          variant="outline" 
          className="w-full border-puzzle-burgundy text-puzzle-burgundy hover:bg-puzzle-burgundy/10"
        >
          Sign Out
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProfileCard;
