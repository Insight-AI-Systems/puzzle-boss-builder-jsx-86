
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatsCardsProps {
  deliveryStats: {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    delivery_rate: number;
    open_rate: number;
    click_rate: number;
  };
}

export const StatsCards: React.FC<StatsCardsProps> = ({ deliveryStats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Delivery Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{deliveryStats.delivery_rate.toFixed(1)}%</div>
          <p className="text-xs text-muted-foreground mt-1">
            {deliveryStats.delivered} delivered out of {deliveryStats.sent} sent
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Open Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{deliveryStats.open_rate.toFixed(1)}%</div>
          <p className="text-xs text-muted-foreground mt-1">
            {deliveryStats.opened} opened out of {deliveryStats.delivered} delivered
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Click Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{deliveryStats.click_rate.toFixed(1)}%</div>
          <p className="text-xs text-muted-foreground mt-1">
            {deliveryStats.clicked} clicks out of {deliveryStats.opened} opened
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
