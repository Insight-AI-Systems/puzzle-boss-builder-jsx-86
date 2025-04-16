
import React from 'react';
import { TabsContent } from "@/components/ui/tabs";
import { StatCard } from '../StatCard';
import { ChartPlaceholder } from '../ChartPlaceholder';

export const OverviewTab: React.FC = () => {
  return (
    <TabsContent value="overview" className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard 
          title="Active Users" 
          value="1,248" 
          trend={{ value: "12%", direction: "up" }}
          subtext="vs. last month"
        />
        <StatCard 
          title="New Signups" 
          value="286" 
          trend={{ value: "18%", direction: "up" }}
          subtext="vs. last month"
        />
        <StatCard 
          title="Puzzles Completed" 
          value="8,392" 
          trend={{ value: "24%", direction: "up" }}
          subtext="vs. last month"
        />
        <StatCard 
          title="Revenue" 
          value="$34,219" 
          trend={{ value: "8%", direction: "down" }}
          subtext="vs. last month"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ChartPlaceholder 
          title="Revenue by Category" 
          description="Top 5 categories by revenue"
          type="bar"
        />
        <ChartPlaceholder 
          title="User Activity" 
          description="Daily active users over time"
          type="line"
        />
      </div>
    </TabsContent>
  );
};
