
import React from 'react';
import { TabsContent } from "@/components/ui/tabs";
import { StatCard } from '../StatCard';
import { ChartPlaceholder } from '../ChartPlaceholder';
import { useAnalytics } from '@/hooks/admin/useAnalytics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { ChartContainer } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export const PuzzlesTab: React.FC = () => {
  const { 
    puzzleMetrics, 
    isLoadingPuzzleMetrics,
    formatTime
  } = useAnalytics();

  if (isLoadingPuzzleMetrics) {
    return (
      <TabsContent value="puzzles" className="space-y-6">
        <div className="flex justify-center items-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-puzzle-aqua" />
        </div>
      </TabsContent>
    );
  }

  // Get puzzle metrics
  const activePuzzles = puzzleMetrics?.active_puzzles || 0;
  const avgTimeSeconds = puzzleMetrics?.avg_completion_time || 0;
  const completionRate = `${(puzzleMetrics?.completion_rate || 0).toFixed(1)}%`;
  const redemptionRate = `${(puzzleMetrics?.prize_redemption_rate || 0).toFixed(1)}%`;

  return (
    <TabsContent value="puzzles" className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Active Puzzles" value={activePuzzles} />
        <StatCard title="Avg. Completion Time" value={formatTime(avgTimeSeconds)} />
        <StatCard title="Completion Rate" value={completionRate} />
        <StatCard title="Prize Redemption" value={redemptionRate} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ChartPlaceholder 
          title="Most Popular Puzzles" 
          description="Currently no data on most popular puzzles by completions"
          type="bar"
        />
        <ChartPlaceholder 
          title="Puzzle Difficulty Analysis" 
          description="Currently no data on difficulty correlations"
          type="line"
        />
      </div>
    </TabsContent>
  );
};
