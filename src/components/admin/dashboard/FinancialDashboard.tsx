
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const FinancialDashboard: React.FC = () => (
  <Card>
    <CardHeader>
      <CardTitle>Financial Dashboard</CardTitle>
      <CardDescription>Revenue tracking and financial reports</CardDescription>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground">This section allows CFO users to access financial reporting and analytics.</p>
    </CardContent>
  </Card>
);
