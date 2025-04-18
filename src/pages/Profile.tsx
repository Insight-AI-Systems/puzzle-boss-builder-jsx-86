
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileInfoTab } from '@/components/profile/tabs/ProfileInfoTab';
import { MyPuzzlesTab } from '@/components/profile/tabs/MyPuzzlesTab';
import { AchievementsTab } from '@/components/profile/tabs/AchievementsTab';
import { SecuritySettings } from '@/components/profile/SecuritySettings';
import { useUserProfile } from '@/hooks/useUserProfile';
import { Loader2, User, Trophy, Settings, Puzzle } from 'lucide-react';
import PageLayout from '@/components/layouts/PageLayout';

const Profile: React.FC = () => {
  const { isLoading } = useUserProfile();

  if (isLoading) {
    return (
      <PageLayout title="User Profile">
        <div className="min-h-screen bg-puzzle-black p-6 flex items-center justify-center">
          <Loader2 className="h-8 w-8 text-puzzle-aqua animate-spin" />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="User Profile">
      <div className="space-y-8">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="bg-puzzle-black/50 border border-puzzle-aqua/20">
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
            <ProfileInfoTab />
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
    </PageLayout>
  );
};

export default Profile;
