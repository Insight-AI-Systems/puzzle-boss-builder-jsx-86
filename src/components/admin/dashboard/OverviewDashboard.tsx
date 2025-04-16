
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShieldAlert } from "lucide-react";
import { UserProfile, ROLE_DEFINITIONS } from '@/types/userTypes';

interface OverviewDashboardProps {
  profile: UserProfile;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({ profile }) => {
  const userRole = profile.role;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin Dashboard</CardTitle>
        <CardDescription>
          Welcome to the admin dashboard, {profile.display_name || 'Admin'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert className="mb-6 bg-puzzle-aqua/10 border-puzzle-aqua">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Role: {ROLE_DEFINITIONS[userRole].label}</AlertTitle>
          <AlertDescription>
            {ROLE_DEFINITIONS[userRole].description}
          </AlertDescription>
        </Alert>
        <p className="text-muted-foreground">
          Your role gives you access to specific sections of the admin dashboard.
          Use the tabs above to navigate to different sections.
        </p>
      </CardContent>
    </Card>
  );
};
