
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";
import { AnalyticsTabs } from './AnalyticsTabs';
import { OverviewTab } from './tabs/OverviewTab';
import { UsersTab } from './tabs/UsersTab';
import { RevenueTab } from './tabs/RevenueTab';
import { PuzzlesTab } from './tabs/PuzzlesTab';

export const AnalyticsDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Analytics Dashboard</CardTitle>
          <CardDescription>Performance metrics and user engagement with date filtering</CardDescription>
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
