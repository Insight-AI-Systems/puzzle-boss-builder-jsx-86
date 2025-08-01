
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileInfoTab from '@/components/profile/tabs/ProfileInfoTab';
import { ProfileContactTab } from '@/components/profile/tabs/ProfileContactTab';
import { ProfileAddressTab } from '@/components/profile/tabs/ProfileAddressTab';
import { ProfilePreferencesTab } from '@/components/profile/tabs/ProfilePreferencesTab';
import { ProfileMembershipTab } from '@/components/profile/tabs/ProfileMembershipTab';
import { ProfilePaymentMethodsTab } from '@/components/profile/tabs/ProfilePaymentMethodsTab';
import { ProfileTransactionHistoryTab } from '@/components/profile/tabs/ProfileTransactionHistoryTab';
import ProfileFinancialTab from '@/components/profile/tabs/ProfileFinancialTab';
import { ProfileGameHistoryTab } from '@/components/profile/tabs/ProfileGameHistoryTab';
import { SecuritySettings } from '@/components/profile/SecuritySettings';
import { useMemberProfile } from '@/hooks/useMemberProfile';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { Badge } from '@/components/ui/badge';
import { Loader2, User, Phone, MapPin, Settings, CreditCard, Receipt, DollarSign, Gamepad2, Shield, AlertCircle } from 'lucide-react';

const Profile: React.FC = () => {
  const { profile, isLoading: isLoadingMemberProfile, isAdmin, updateProfile, upsertAddress, deleteAddress, acceptTerms } = useMemberProfile();
  const { userRole, isAdmin: isSupabaseAdmin } = useAuth();
  const { isLoading: isLoadingUserProfile } = useUserProfile();
  const [activeTab, setActiveTab] = useState('personal');
  
  const isLoading = isLoadingUserProfile || isLoadingMemberProfile;

  console.log('Profile component render:', { 
    profile, 
    isLoading, 
    isLoadingMemberProfile, 
    isLoadingUserProfile, 
    isAdmin,
    profileExists: !!profile,
    profileId: profile?.id,
    profileRole: profile?.role
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-puzzle-black p-6 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 text-puzzle-aqua animate-spin" />
          <p className="text-puzzle-white">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-puzzle-black p-6 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <AlertCircle className="h-12 w-12 text-red-400" />
          <div className="text-puzzle-white">
            <h2 className="text-xl font-semibold mb-2">Profile Not Found</h2>
            <p className="text-puzzle-white/70">Unable to load your profile. Please try refreshing the page.</p>
          </div>
        </div>
      </div>
    );
  }

  // Get display name with fallback chain: username -> display_name -> email -> "Anonymous User"
  const getDisplayName = () => {
    return profile.username || profile.display_name || profile.email || 'Anonymous User';
  };

  // Calculate grid columns based on admin status
  const getGridCols = () => {
    const baseTabsCount = 7; // personal, contact, addresses, preferences, membership, payments, transactions, games, security
    const adminTabsCount = isAdmin ? 2 : 0; // financial (admin only)
    const totalTabs = baseTabsCount + adminTabsCount;
    
    if (totalTabs <= 5) return 'grid-cols-5';
    if (totalTabs <= 8) return 'lg:grid-cols-8 grid-cols-4';
    return 'lg:grid-cols-10 grid-cols-5';
  };

  return (
    <div className="min-h-screen bg-puzzle-black text-white">
      <div className="container mx-auto p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex justify-between items-center border-b border-puzzle-aqua/20 pb-6">
            <div>
              <div className="flex items-center gap-4">
                <h1 className="text-3xl font-game text-puzzle-aqua">
                  {isSupabaseAdmin ? 'Admin Profile' : 'Member Profile'}
                </h1>
                {isSupabaseAdmin && (
                  <Badge className="bg-puzzle-gold text-puzzle-black font-semibold">
                    {userRole === 'super_admin' || userRole === 'super-admin' ? 'Super Admin' : 'Admin'}
                  </Badge>
                )}
              </div>
              <p className="text-puzzle-white/70 mt-2">
                Comprehensive {isSupabaseAdmin ? 'admin' : 'member'} relationship management
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-puzzle-white/60">
                {isSupabaseAdmin ? (userRole === 'super_admin' || userRole === 'super-admin' ? 'Super Admin' : 'Admin') : 'Member'}
              </p>
              <p className="text-puzzle-aqua font-medium text-lg">{getDisplayName()}</p>
              <p className="text-sm text-puzzle-white/60 mt-1">Credits: {profile.credits || 0}</p>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className={`bg-puzzle-black/50 border border-puzzle-aqua/20 mb-6 grid ${getGridCols()} w-full`}>
              <TabsTrigger 
                value="personal" 
                className="data-[state=active]:bg-puzzle-aqua/10 data-[state=active]:text-puzzle-aqua"
              >
                <User className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Personal</span>
              </TabsTrigger>
              <TabsTrigger 
                value="contact" 
                className="data-[state=active]:bg-puzzle-gold/10 data-[state=active]:text-puzzle-gold"
              >
                <Phone className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Contact</span>
              </TabsTrigger>
              <TabsTrigger 
                value="addresses" 
                className="data-[state=active]:bg-puzzle-aqua/10 data-[state=active]:text-puzzle-aqua"
              >
                <MapPin className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Addresses</span>
              </TabsTrigger>
              <TabsTrigger 
                value="preferences" 
                className="data-[state=active]:bg-puzzle-gold/10 data-[state=active]:text-puzzle-gold"
              >
                <Settings className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Preferences</span>
              </TabsTrigger>
              <TabsTrigger 
                value="membership" 
                className="data-[state=active]:bg-puzzle-aqua/10 data-[state=active]:text-puzzle-aqua"
              >
                <CreditCard className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Membership</span>
              </TabsTrigger>
              <TabsTrigger 
                value="payments" 
                className="data-[state=active]:bg-puzzle-gold/10 data-[state=active]:text-puzzle-gold"
              >
                <CreditCard className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Payments</span>
              </TabsTrigger>
              <TabsTrigger 
                value="transactions" 
                className="data-[state=active]:bg-puzzle-aqua/10 data-[state=active]:text-puzzle-aqua"
              >
                <Receipt className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Transactions</span>
              </TabsTrigger>
              {/* Financial tab - only visible to admins */}
              {isAdmin && (
                <TabsTrigger 
                  value="financial" 
                  className="data-[state=active]:bg-puzzle-gold/10 data-[state=active]:text-puzzle-gold"
                >
                  <DollarSign className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Financial</span>
                </TabsTrigger>
              )}
              <TabsTrigger 
                value="games" 
                className="data-[state=active]:bg-puzzle-aqua/10 data-[state=active]:text-puzzle-aqua"
              >
                <Gamepad2 className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Games</span>
              </TabsTrigger>
              <TabsTrigger 
                value="security" 
                className="data-[state=active]:bg-red-500/10 data-[state=active]:text-red-400"
              >
                <Shield className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Security</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="personal" className="pt-4">
              <ProfileInfoTab 
                profile={profile} 
                updateProfile={updateProfile} 
                acceptTerms={acceptTerms}
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
            
            <TabsContent value="preferences" className="pt-4">
              <ProfilePreferencesTab 
                profile={profile}
                updateProfile={updateProfile}
              />
            </TabsContent>
            
            <TabsContent value="membership" className="pt-4">
              <ProfileMembershipTab 
                profile={profile}
                membershipDetails={profile.membership_details}
              />
            </TabsContent>
            
            <TabsContent value="payments" className="pt-4">
              <ProfilePaymentMethodsTab 
                userId={profile.id}
              />
            </TabsContent>
            
            <TabsContent value="transactions" className="pt-4">
              <ProfileTransactionHistoryTab 
                userId={profile.id}
              />
            </TabsContent>
            
            {/* Financial tab content - only accessible by admins */}
            {isAdmin && (
              <TabsContent value="financial" className="pt-4">
                <ProfileFinancialTab />
              </TabsContent>
            )}
            
            <TabsContent value="games" className="pt-4">
              <ProfileGameHistoryTab 
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
