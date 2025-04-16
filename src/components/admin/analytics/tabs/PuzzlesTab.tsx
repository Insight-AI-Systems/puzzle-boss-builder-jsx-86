
import React from 'react';
import { TabsContent } from "@/components/ui/tabs";
import { StatCard } from '../StatCard';
import { ChartPlaceholder } from '../ChartPlaceholder';

export const PuzzlesTab: React.FC = () => {
  return (
    <TabsContent value="puzzles" className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Active Puzzles" value="24" />
        <StatCard title="Avg. Completion Time" value="7:42" />
        <StatCard title="Completion Rate" value="68.3%" />
        <StatCard title="Prize Redemption" value="92.7%" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ChartPlaceholder 
          title="Most Popular Puzzles" 
          description="By number of completions"
          type="bar"
        />
        <ChartPlaceholder 
          title="Puzzle Difficulty Analysis" 
          description="Correlation between difficulty and engagement"
          type="line"
        />
      </div>
    </TabsContent>
  );
};
