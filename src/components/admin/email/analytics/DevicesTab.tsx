
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart } from "@/components/ui/charts";

interface DevicesTabProps {
  deliveryStats: {
    mobile_pct: number;
    desktop_pct: number;
    webmail_pct: number;
    other_pct: number;
  };
}

export const DevicesTab: React.FC<DevicesTabProps> = ({ deliveryStats }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Email Client Distribution</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center">
        <div className="w-[300px] h-[300px]">
          {deliveryStats.mobile_pct > 0 || deliveryStats.desktop_pct > 0 ? (
            <PieChart 
              data={[
                { name: "Mobile", value: deliveryStats.mobile_pct },
                { name: "Desktop", value: deliveryStats.desktop_pct },
                { name: "Webmail", value: deliveryStats.webmail_pct },
                { name: "Other", value: deliveryStats.other_pct }
              ]}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <p className="text-muted-foreground mb-2">No device data available</p>
              <p className="text-sm text-muted-foreground">
                Device information will appear here once emails are sent and tracked
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
