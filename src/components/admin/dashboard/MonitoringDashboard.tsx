
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const MonitoringDashboard: React.FC = () => (
  <Card>
    <CardHeader>
      <CardTitle>System Monitoring</CardTitle>
      <CardDescription>Real-time monitoring and alerts</CardDescription>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground">This section provides real-time monitoring of system activity and alerts.</p>
    </CardContent>
  </Card>
);
