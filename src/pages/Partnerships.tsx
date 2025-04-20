
import React from 'react';
import PageLayout from '@/components/layouts/PageLayout';
import WhyPartnerWithUs from '@/components/partnerships/WhyPartnerWithUs';
import PartnershipOpportunities from '@/components/partnerships/PartnershipOpportunities';
import CurrentPartners from '@/components/partnerships/CurrentPartners';
import PartnershipForm from '@/components/partnerships/PartnershipForm';

const Partnerships = () => {
  return (
    <PageLayout 
      title="Partnerships" 
      subtitle="Collaborate with The Puzzle Boss to reach our engaged audience"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        <WhyPartnerWithUs />
        <PartnershipOpportunities />
      </div>
      <CurrentPartners />
      <PartnershipForm />
    </PageLayout>
  );
};

export default Partnerships;
