
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import ProfileAvatar from './avatar/ProfileAvatar';
import UsernameEditor from './username/UsernameEditor';
import ProfileStats from './stats/ProfileStats';

/**
 * Component that displays the user's profile information in a card format
 */
const ProfileCard = ({ user, profile, onSignOut, onUpdateProfile }) => {
  return (
    <Card className="md:col-span-1 bg-puzzle-black border-puzzle-aqua/30">
      <CardHeader className="text-center">
        <ProfileAvatar 
          user={user} 
          profile={profile} 
          onUpdateProfile={onUpdateProfile} 
        />
        
        <UsernameEditor 
          profile={profile} 
          onUpdateProfile={onUpdateProfile} 
        />
        
        <CardDescription className="text-muted-foreground">
          {user.email}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <ProfileStats profile={profile} />
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
