
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const NotificationsDashboard: React.FC = () => (
  <Card>
    <CardHeader>
      <CardTitle>Notification Management</CardTitle>
      <CardDescription>Manage system notifications and alerts</CardDescription>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground">This section allows control of system-wide notifications and alerts.</p>
    </CardContent>
  </Card>
);
