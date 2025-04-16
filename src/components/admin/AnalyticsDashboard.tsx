
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";
import { AnalyticsTabs } from './analytics/AnalyticsTabs';
import { OverviewTab } from './analytics/tabs/OverviewTab';
import { UsersTab } from './analytics/tabs/UsersTab';
import { RevenueTab } from './analytics/tabs/RevenueTab';
import { PuzzlesTab } from './analytics/tabs/PuzzlesTab';

export const AnalyticsDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Analytics Dashboard</CardTitle>
          <CardDescription>Performance metrics and user engagement</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="space-y-6">
            <AnalyticsTabs />
            <OverviewTab />
            <UsersTab />
            <RevenueTab />
            <PuzzlesTab />
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
