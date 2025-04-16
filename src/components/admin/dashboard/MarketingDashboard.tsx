
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const MarketingDashboard: React.FC = () => (
  <Card>
    <CardHeader>
      <CardTitle>Marketing Dashboard</CardTitle>
      <CardDescription>Social media and promotion management</CardDescription>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground">This section allows social media managers to schedule promotions and track marketing metrics.</p>
    </CardContent>
  </Card>
);
