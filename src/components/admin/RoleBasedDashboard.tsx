
import React from 'react';
import { Tabs } from "@/components/ui/tabs";
import { useUserProfile } from '@/hooks/useUserProfile';
import { UserRole } from '@/types/userTypes';
import { DashboardTabSelector } from './dashboard/DashboardTabSelector';
import { DashboardContent } from './dashboard/DashboardContent';
import { getTabDefinitions, TabDefinition } from './dashboard/TabDefinitions';

export const RoleBasedDashboard: React.FC = () => {
  const { profile } = useUserProfile();
  
  if (!profile) return null;
  
  const userRole = profile.role;
  
  // Get tab definitions
  const tabs = getTabDefinitions();
  
  // Filter tabs based on user role
  const accessibleTabs = tabs.filter(tab => tab.roles.includes(userRole as UserRole));

  return (
    <Tabs defaultValue="overview" className="w-full">
      <DashboardTabSelector accessibleTabs={accessibleTabs} />
      <DashboardContent accessibleTabs={accessibleTabs} profile={profile} />
    </Tabs>
  );
};
