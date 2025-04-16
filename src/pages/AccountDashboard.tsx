
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { RefreshCw, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useSubscription } from '@/hooks/useSubscription';
import { MembershipOverview } from '@/components/account/MembershipOverview';
import { RecentActivity } from '@/components/account/RecentActivity';
import { ProfileCard } from '@/components/account/ProfileCard';

const AccountDashboard = () => {
  const { profile, isLoading: profileLoading, currentUserId } = useUserProfile();
  const { 
    subscriptionData, 
    isCheckingSubscription, 
    isLoadingPortal,
    checkSubscription, 
    openCustomerPortal 
  } = useSubscription();
  
  useEffect(() => {
    if (currentUserId) {
      checkSubscription();
    }
  }, [currentUserId]);
  
  if (profileLoading) {
    return (
      <div className="min-h-screen bg-puzzle-black flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-puzzle-aqua animate-spin" />
      </div>
    );
  }

  if (!profileLoading && !currentUserId) {
    return <Navigate to="/auth" replace />;
  }
  
  return (
    <div className="min-h-screen bg-puzzle-black p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-puzzle-aqua">
              Account Dashboard
            </h1>
            <p className="text-puzzle-white/70">Manage your membership and profile</p>
          </div>
          
          <Button 
            variant="outline" 
            onClick={checkSubscription} 
            disabled={isCheckingSubscription}
            className="border-puzzle-aqua/50 hover:bg-puzzle-aqua/10"
          >
            {isCheckingSubscription ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Refresh Status
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs defaultValue="membership" className="w-full">
              <TabsList className="w-full grid grid-cols-2 mb-8 bg-puzzle-black border border-puzzle-aqua/30">
                <TabsTrigger value="membership">Membership</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>
              
              <TabsContent value="membership">
                <MembershipOverview 
                  subscriptionData={subscriptionData}
                  isLoadingPortal={isLoadingPortal}
                  isCheckingSubscription={isCheckingSubscription}
                  onCheckSubscription={checkSubscription}
                  onOpenCustomerPortal={openCustomerPortal}
                />
              </TabsContent>
              
              <TabsContent value="activity">
                <RecentActivity />
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="space-y-6">
            <ProfileCard profile={profile} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountDashboard;
