
import React from 'react';
import { TabsContent } from "@/components/ui/tabs";
import { StatCard } from '../StatCard';
import { ChartPlaceholder } from '../ChartPlaceholder';

export const UsersTab: React.FC = () => {
  return (
    <TabsContent value="users" className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Users" value="15,482" />
        <StatCard title="Active Players" value="8,249" />
        <StatCard title="Conversion Rate" value="23.4%" />
        <StatCard title="Retention Rate" value="76.8%" />
      </div>

      <ChartPlaceholder 
        title="User Demographics" 
        description="User distribution by country and age"
        type="pie"
      />
    </TabsContent>
  );
};
