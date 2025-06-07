
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileInfoTab } from '@/components/profile/tabs/ProfileInfoTab';
import { MyPuzzlesTab } from '@/components/profile/tabs/MyPuzzlesTab';
import { AchievementsTab } from '@/components/profile/tabs/AchievementsTab';
import { SecuritySettings } from '@/components/profile/SecuritySettings';
import { UserProfileForm } from '@/components/profile/UserProfileForm';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useMemberProfile } from '@/hooks/useMemberProfile';
import { Loader2, User, Trophy, Settings, Puzzle } from 'lucide-react';

const Profile: React.FC = () => {
  const { isLoading: isLoadingUserProfile } = useUserProfile();
  const { profile, isLoading: isLoadingMemberProfile, updateProfile, acceptTerms, awardCredits } = useMemberProfile();
  const [activeTab, setActiveTab] = useState('profile');
  
  const isLoading = isLoadingUserProfile || isLoadingMemberProfile;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-puzzle-black p-6 flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-puzzle-aqua animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-puzzle-black text-white">
      <div className="container mx-auto p-6">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-game text-puzzle-aqua">User Profile</h1>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-puzzle-black/50 border border-puzzle-aqua/20 mb-6">
              <TabsTrigger value="profile" className="data-[state=active]:bg-puzzle-aqua/10">
                <User className="h-4 w-4 mr-2" />
                Profile Info
              </TabsTrigger>
              <TabsTrigger value="puzzles" className="data-[state=active]:bg-puzzle-aqua/10">
                <Puzzle className="h-4 w-4 mr-2" />
                My Puzzles
              </TabsTrigger>
              <TabsTrigger value="achievements" className="data-[state=active]:bg-puzzle-aqua/10">
                <Trophy className="h-4 w-4 mr-2" />
                Achievements
              </TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-puzzle-aqua/10">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="pt-4">
              {profile && (
                <ProfileInfoTab 
                  profile={profile} 
                  updateProfile={updateProfile} 
                  acceptTerms={acceptTerms}
                  awardCredits={awardCredits}
                />
              )}
            </TabsContent>
            
            <TabsContent value="puzzles" className="pt-4">
              <MyPuzzlesTab />
            </TabsContent>
            
            <TabsContent value="achievements" className="pt-4">
              <AchievementsTab />
            </TabsContent>
            
            <TabsContent value="settings" className="pt-4">
              <SecuritySettings />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;
