
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const PartnersDashboard: React.FC = () => (
  <Card>
    <CardHeader>
      <CardTitle>Partners Dashboard</CardTitle>
      <CardDescription>Manage prize suppliers and partnerships</CardDescription>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground">This section allows partner managers to handle supplier relationships and prize data.</p>
    </CardContent>
  </Card>
);
