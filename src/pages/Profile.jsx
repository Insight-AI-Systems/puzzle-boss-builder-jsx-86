
import React, { useState } from 'react';
import { useAuth } from '@/contexts/auth';
import ProfileCard from '@/components/profile/ProfileCard';
import ProfileForm from '@/components/profile/ProfileForm';
import GameHistory from '@/components/profile/GameHistory';
import AvailablePuzzles from '@/components/profile/AvailablePuzzles';
import RewardsReferrals from '@/components/profile/RewardsReferrals';
import AccountSettings from '@/components/profile/AccountSettings';
import Loading from '@/components/ui/loading';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';

/**
 * User dashboard/profile page that displays user information and game statistics
 */
const Profile = () => {
  const { user, profile, updateUserProfile, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const isMobile = useIsMobile();

  if (!user || !profile) {
    return <Loading />;
  }

  const handleSignOut = async () => {
    await signOut();
  };
  
  return (
    <div className="min-h-screen bg-puzzle-black py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-puzzle-white mb-8">User Dashboard</h1>
        
        {/* Mobile View - Tabs */}
        {isMobile ? (
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
                onSignOut={handleSignOut} 
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
              <AccountSettings user={user} profile={profile} onSignOut={handleSignOut} />
            </TabsContent>
          </Tabs>
        ) : (
          /* Desktop View - Grid Layout */
          <div className="grid grid-cols-1 gap-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ProfileCard 
                user={user} 
                profile={profile} 
                onSignOut={handleSignOut}
                onUpdateProfile={updateUserProfile}
              />
              
              <div className="md:col-span-2">
                <ProfileForm 
                  user={user} 
                  profile={profile} 
                  onUpdateProfile={updateUserProfile} 
                />
              </div>
            </div>
            
            <GameHistory user={user} profile={profile} />
            <AvailablePuzzles user={user} profile={profile} />
            <RewardsReferrals user={user} profile={profile} />
            <AccountSettings user={user} profile={profile} onSignOut={handleSignOut} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
