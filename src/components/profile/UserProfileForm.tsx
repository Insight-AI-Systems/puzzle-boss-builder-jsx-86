
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, AlertCircle } from 'lucide-react';
import { ProfileInfoTab } from './tabs/ProfileInfoTab';
import { ProfileAddressTab } from './tabs/ProfileAddressTab';
import { ProfileMembershipTab } from './tabs/ProfileMembershipTab';
import { ProfileFinancialTab } from './tabs/ProfileFinancialTab';
import { ProfileXeroTab } from './tabs/ProfileXeroTab';
import { useMemberProfile } from '@/hooks/useMemberProfile';

export function UserProfileForm() {
  const [activeTab, setActiveTab] = useState('info');
  const { 
    profile, 
    isLoading, 
    error, 
    updateProfile,
    upsertAddress,
    deleteAddress,
    acceptTerms
  } = useMemberProfile();

  if (isLoading) {
    return (
      <Card className="bg-puzzle-black/50 border-puzzle-aqua/30">
        <CardHeader>
          <CardTitle className="text-puzzle-white flex items-center">
            <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Loading Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center p-8">
          <div className="text-puzzle-white">Loading your profile details...</div>
        </CardContent>
      </Card>
    );
  }

  if (error || !profile) {
    return (
      <Card className="bg-puzzle-black/50 border-puzzle-aqua/30">
        <CardHeader>
          <CardTitle className="text-puzzle-white flex items-center">
            <AlertCircle className="h-4 w-4 mr-2" /> Error Loading Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error?.message || "Could not load your profile. Please try again later."}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-puzzle-black/50 border-puzzle-aqua/30">
      <CardHeader>
        <CardTitle className="text-puzzle-white">Your Member Profile</CardTitle>
        <CardDescription className="text-puzzle-white/70">
          Manage your profile information, addresses, membership details, and financial information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-5 bg-puzzle-black/80 text-puzzle-white">
            <TabsTrigger value="info">Personal Info</TabsTrigger>
            <TabsTrigger value="address">Addresses</TabsTrigger>
            <TabsTrigger value="membership">Membership</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
            <TabsTrigger value="xero">Xero</TabsTrigger>
          </TabsList>
          
          <TabsContent value="info">
            <ProfileInfoTab 
              profile={profile} 
              updateProfile={updateProfile}
              acceptTerms={acceptTerms}
            />
          </TabsContent>
          
          <TabsContent value="address">
            <ProfileAddressTab 
              addresses={profile.addresses || []} 
              upsertAddress={upsertAddress}
              deleteAddress={deleteAddress}
            />
          </TabsContent>
          
          <TabsContent value="membership">
            <ProfileMembershipTab 
              profile={profile}
              membershipDetails={profile.membership_details}
            />
          </TabsContent>
          
          <TabsContent value="financial">
            <ProfileFinancialTab 
              profile={profile}
              isAdmin={false}
            />
          </TabsContent>
          
          <TabsContent value="xero">
            <ProfileXeroTab 
              profile={profile}
              xeroMapping={profile.xero_mapping}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
