
import React, { useEffect } from 'react';
import PageLayout from '@/components/layouts/PageLayout';
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
    <PageLayout 
      title="Membership" 
      subtitle="Manage your membership and subscription details"
    >
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
    </PageLayout>
  );
};

export default Membership;
