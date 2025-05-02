
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart } from "@/components/ui/charts";

interface EngagementTabProps {
  engagementStats: Array<{
    date: string;
    sent: number;
    opened: number;
    clicked: number;
  }>;
}

export const EngagementTab: React.FC<EngagementTabProps> = ({ engagementStats }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Email Engagement Over Time</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        {engagementStats && engagementStats.length > 0 ? (
          <LineChart
            data={engagementStats}
            xAxis="date"
            series={['sent', 'opened', 'clicked']}
            colors={['#94a3b8', '#0ea5e9', '#10b981']}
            height={300}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-[300px] text-center">
            <p className="text-muted-foreground mb-2">No engagement data available for this period</p>
            <p className="text-sm text-muted-foreground">
              Try selecting a different date range or campaign
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
