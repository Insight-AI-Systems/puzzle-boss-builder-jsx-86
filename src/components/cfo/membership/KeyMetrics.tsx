
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MembershipStats } from '@/types/financeTypes';

interface KeyMetricsProps {
  currentMonthData: MembershipStats;
}

export const KeyMetrics = ({ currentMonthData }: KeyMetricsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Key Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Total Members</p>
            <p className="text-2xl font-bold">
              {(currentMonthData.active_members + currentMonthData.expired_members).toLocaleString()}
            </p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Retention Rate</p>
            <p className="text-2xl font-bold">
              {currentMonthData.active_members > 0 ? 
                `${((currentMonthData.active_members / (currentMonthData.active_members + currentMonthData.canceled_members)) * 100).toFixed(1)}%` : 
                'N/A'}
            </p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Monthly Revenue</p>
            <p className="text-2xl font-bold text-green-500">
              ${currentMonthData.revenue.toFixed(2)}
            </p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Avg. Revenue/Member</p>
            <p className="text-2xl font-bold">
              ${currentMonthData.active_members > 0 ? 
                (currentMonthData.revenue / currentMonthData.active_members).toFixed(2) : 
                '0.00'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
