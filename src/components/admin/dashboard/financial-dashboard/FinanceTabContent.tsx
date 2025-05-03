
import React from 'react';
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { FinanceStats } from '@/components/finance/FinanceStats';
import IncomeStreams from '@/components/cfo/IncomeStreams';
import CostStreams from '@/components/cfo/CostStreams';
import CommissionsManagement from '@/components/cfo/CommissionsManagement';
import MembershipSummary from '@/components/cfo/MembershipSummary';

interface FinanceTabContentProps {
  activeTab: string;
  selectedMonth: string;
}

export const FinanceTabContent: React.FC<FinanceTabContentProps> = ({ 
  activeTab, 
  selectedMonth 
}) => {
  return (
    <>
      <TabsContent value="overview">
        <Card>
          <CardContent className="pt-6">
            <FinanceStats />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="income">
        <IncomeStreams selectedMonth={selectedMonth} />
      </TabsContent>
      
      <TabsContent value="expenses">
        <CostStreams selectedMonth={selectedMonth} />
      </TabsContent>
      
      <TabsContent value="commissions">
        <CommissionsManagement selectedMonth={selectedMonth} />
      </TabsContent>
      
      <TabsContent value="membership">
        <MembershipSummary selectedMonth={selectedMonth} />
      </TabsContent>
    </>
  );
};
