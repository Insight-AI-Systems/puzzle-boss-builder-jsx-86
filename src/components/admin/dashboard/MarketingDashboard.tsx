
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MarketingTabs } from './marketing/MarketingTabs';

export const MarketingDashboard: React.FC = () => (
  <Card>
    <CardHeader>
      <CardTitle>Marketing Dashboard</CardTitle>
      <CardDescription>Manage your marketing campaigns, SEO, social media and brand monitoring</CardDescription>
    </CardHeader>
    <CardContent>
      <MarketingTabs />
    </CardContent>
  </Card>
);

export default MarketingDashboard;
