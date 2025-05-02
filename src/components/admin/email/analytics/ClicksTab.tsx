
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart } from "@/components/ui/charts";

interface ClicksTabProps {
  clickRates: Array<{
    link: string;
    clicks: number;
  }>;
}

export const ClicksTab: React.FC<ClicksTabProps> = ({ clickRates }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Link Click Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        {clickRates && clickRates.length > 0 ? (
          <BarChart
            data={clickRates}
            xAxis="link"
            yAxis="clicks"
            height={300}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-[300px] text-center">
            <p className="text-muted-foreground mb-2">No click data available for this period</p>
            <p className="text-sm text-muted-foreground">
              Try selecting a different date range or campaign
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
