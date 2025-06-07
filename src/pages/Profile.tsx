
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileInfoTab } from '@/components/profile/tabs/ProfileInfoTab';
import { ProfileContactTab } from '@/components/profile/tabs/ProfileContactTab';
import { ProfileAddressTab } from '@/components/profile/tabs/ProfileAddressTab';
import { ProfileFinancialTab } from '@/components/profile/tabs/ProfileFinancialTab';
import { ProfileGameHistoryTab } from '@/components/profile/tabs/ProfileGameHistoryTab';
import { ProfileWinningsTab } from '@/components/profile/tabs/ProfileWinningsTab';
import { SecuritySettings } from '@/components/profile/SecuritySettings';
import { useMemberProfile } from '@/hooks/useMemberProfile';
import { useUserProfile } from '@/hooks/useUserProfile';
import { Loader2, User, Phone, MapPin, DollarSign, Gamepad2, Trophy, Shield } from 'lucide-react';

const Profile: React.FC = () => {
  const { profile, isLoading: isLoadingMemberProfile, updateProfile, upsertAddress, deleteAddress, acceptTerms, awardCredits } = useMemberProfile();
  const { isLoading: isLoadingUserProfile, isAdmin } = useUserProfile();
  const [activeTab, setActiveTab] = useState('personal');
  
  const isLoading = isLoadingUserProfile || isLoadingMemberProfile;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-puzzle-black p-6 flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-puzzle-aqua animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-puzzle-black p-6 flex items-center justify-center">
        <div className="text-puzzle-white">Failed to load profile</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-puzzle-black text-white">
      <div className="container mx-auto p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex justify-between items-center border-b border-puzzle-aqua/20 pb-6">
            <div>
              <h1 className="text-3xl font-game text-puzzle-aqua">Member Profile</h1>
              <p className="text-puzzle-white/70 mt-2">
                Manage your account information, game history, and preferences
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-puzzle-white/60">Member ID</p>
              <p className="text-puzzle-aqua font-mono text-sm">{profile.id.slice(0, 8)}...</p>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-puzzle-black/50 border border-puzzle-aqua/20 mb-6 grid grid-cols-7 w-full">
              <TabsTrigger 
                value="personal" 
                className="data-[state=active]:bg-puzzle-aqua/10 data-[state=active]:text-puzzle-aqua"
              >
                <User className="h-4 w-4 mr-2" />
                Personal
              </TabsTrigger>
              <TabsTrigger 
                value="contact" 
                className="data-[state=active]:bg-puzzle-gold/10 data-[state=active]:text-puzzle-gold"
              >
                <Phone className="h-4 w-4 mr-2" />
                Contact
              </TabsTrigger>
              <TabsTrigger 
                value="addresses" 
                className="data-[state=active]:bg-puzzle-aqua/10 data-[state=active]:text-puzzle-aqua"
              >
                <MapPin className="h-4 w-4 mr-2" />
                Addresses
              </TabsTrigger>
              <TabsTrigger 
                value="financial" 
                className="data-[state=active]:bg-puzzle-gold/10 data-[state=active]:text-puzzle-gold"
              >
                <DollarSign className="h-4 w-4 mr-2" />
                Financial
              </TabsTrigger>
              <TabsTrigger 
                value="games" 
                className="data-[state=active]:bg-puzzle-aqua/10 data-[state=active]:text-puzzle-aqua"
              >
                <Gamepad2 className="h-4 w-4 mr-2" />
                Games
              </TabsTrigger>
              <TabsTrigger 
                value="winnings" 
                className="data-[state=active]:bg-puzzle-gold/10 data-[state=active]:text-puzzle-gold"
              >
                <Trophy className="h-4 w-4 mr-2" />
                Winnings
              </TabsTrigger>
              <TabsTrigger 
                value="security" 
                className="data-[state=active]:bg-red-500/10 data-[state=active]:text-red-400"
              >
                <Shield className="h-4 w-4 mr-2" />
                Security
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="personal" className="pt-4">
              <ProfileInfoTab 
                profile={profile} 
                updateProfile={updateProfile} 
                acceptTerms={acceptTerms}
                awardCredits={isAdmin ? awardCredits : undefined}
              />
            </TabsContent>
            
            <TabsContent value="contact" className="pt-4">
              <ProfileContactTab 
                profile={profile} 
                updateProfile={updateProfile}
                isAdmin={isAdmin}
              />
            </TabsContent>
            
            <TabsContent value="addresses" className="pt-4">
              <ProfileAddressTab 
                addresses={profile.addresses || []} 
                upsertAddress={upsertAddress}
                deleteAddress={deleteAddress}
              />
            </TabsContent>
            
            <TabsContent value="financial" className="pt-4">
              <ProfileFinancialTab 
                profile={profile}
                awardCredits={isAdmin ? awardCredits : undefined}
                isAdmin={isAdmin}
              />
            </TabsContent>
            
            <TabsContent value="games" className="pt-4">
              <ProfileGameHistoryTab 
                userId={profile.id}
              />
            </TabsContent>
            
            <TabsContent value="winnings" className="pt-4">
              <ProfileWinningsTab 
                userId={profile.id}
              />
            </TabsContent>
            
            <TabsContent value="security" className="pt-4">
              <SecuritySettings />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;
