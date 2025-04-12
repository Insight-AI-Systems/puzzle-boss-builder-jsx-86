
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProfileCard from '@/components/profile/ProfileCard';
import ProfileForm from '@/components/profile/ProfileForm';
import GameHistory from '@/components/profile/GameHistory';
import AvailablePuzzles from '@/components/profile/AvailablePuzzles';
import RewardsReferrals from '@/components/profile/RewardsReferrals';
import AccountSettings from '@/components/profile/AccountSettings';
import { useAuth } from '@/contexts/auth';

const ProfileTabs = ({ activeTab, setActiveTab, user, profile }) => {
  const { updateUserProfile, signOut } = useAuth();

  return (
    <Tabs defaultValue="profile" onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-3 mb-8 bg-puzzle-black border border-puzzle-aqua/30">
        <TabsTrigger value="profile" className="text-puzzle-white data-[state=active]:bg-puzzle-aqua/20">
          Profile
        </TabsTrigger>
        <TabsTrigger value="gameplay" className="text-puzzle-white data-[state=active]:bg-puzzle-aqua/20">
          Gameplay
        </TabsTrigger>
        <TabsTrigger value="account" className="text-puzzle-white data-[state=active]:bg-puzzle-aqua/20">
          Account
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="profile" className="space-y-6">
        <ProfileCard 
          user={user} 
          profile={profile} 
          onSignOut={signOut} 
          onUpdateProfile={updateUserProfile}
        />
        <ProfileForm 
          user={user} 
          profile={profile} 
          onUpdateProfile={updateUserProfile} 
        />
      </TabsContent>
      
      <TabsContent value="gameplay" className="space-y-6">
        <GameHistory user={user} profile={profile} />
        <AvailablePuzzles user={user} profile={profile} />
      </TabsContent>
      
      <TabsContent value="account" className="space-y-6">
        <RewardsReferrals user={user} profile={profile} />
        <AccountSettings user={user} profile={profile} onSignOut={signOut} />
      </TabsContent>
    </Tabs>
  );
};

export default ProfileTabs;
