
import React, { useEffect } from 'react';
import PageLayout from '@/components/layouts/PageLayout';
import { MembershipOverview } from '@/components/account/MembershipOverview';
import { useSubscription } from '@/hooks/useSubscription';
import { useUserProfile } from '@/hooks/useUserProfile';

const Membership: React.FC = () => {
  const { currentUserId } = useUserProfile();
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
