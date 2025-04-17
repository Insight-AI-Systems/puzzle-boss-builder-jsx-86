
import React from 'react';
import PageLayout from '@/components/layouts/PageLayout';
import { MembershipOverview } from '@/components/account/MembershipOverview';

const Membership: React.FC = () => {
  return (
    <PageLayout 
      title="Membership" 
      subtitle="Manage your membership and subscription details"
    >
      <MembershipOverview />
    </PageLayout>
  );
};

export default Membership;
