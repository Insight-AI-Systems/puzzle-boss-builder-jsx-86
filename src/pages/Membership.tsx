
import React, { useEffect } from 'react';
import { MembershipOverview } from '@/components/account/MembershipOverview';
import { useSubscription } from '@/hooks/useSubscription';
import { useUserProfile } from '@/hooks/useUserProfile';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ShieldCheck } from 'lucide-react';

const Membership: React.FC = () => {
  const { currentUserId, profile } = useUserProfile();
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

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-3xl font-game text-puzzle-aqua text-center">Membership</h1>
        <p className="text-center text-xl text-muted-foreground max-w-3xl mx-auto">
          Manage your membership and subscription details
        </p>
        
        {profile?.role === 'super_admin' && (
          <Alert className="mb-6 bg-green-900/30 border-green-500">
            <ShieldCheck className="h-4 w-4 text-green-500" />
            <AlertDescription className="text-green-100">
              You have Super Admin privileges. You have access to all features regardless of subscription status.
            </AlertDescription>
          </Alert>
        )}
        
        <MembershipOverview 
          subscriptionData={subscriptionData}
          isLoadingPortal={isLoadingPortal}
          isCheckingSubscription={isCheckingSubscription}
          onCheckSubscription={checkSubscription}
          onOpenCustomerPortal={openCustomerPortal}
        />
      </div>
    </div>
  );
};

export default Membership;
