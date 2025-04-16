
import React from 'react';
import { TabsContent } from "@/components/ui/tabs";
import { StatCard } from '../StatCard';
import { ChartPlaceholder } from '../ChartPlaceholder';

export const RevenueTab: React.FC = () => {
  return (
    <TabsContent value="revenue" className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard 
          title="Total Revenue" 
          value="$128,495" 
          subtext="Year to date"
        />
        <StatCard 
          title="Avg. Revenue Per User" 
          value="$8.29" 
          subtext="Year to date"
        />
        <StatCard 
          title="Credit Purchases" 
          value="42,183" 
          subtext="Year to date"
        />
      </div>

      <ChartPlaceholder 
        title="Revenue Breakdown" 
        description="By category and credit package"
        type="bar"
      />
    </TabsContent>
  );
};
