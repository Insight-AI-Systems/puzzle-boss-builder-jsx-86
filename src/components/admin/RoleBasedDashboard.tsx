
import React, { useState } from 'react';
import { Tabs } from "@/components/ui/tabs";
import { useUserProfile } from '@/hooks/useUserProfile';
import { UserRole } from '@/types/userTypes';
import { DashboardTabSelector } from './dashboard/DashboardTabSelector';
import { DashboardContent } from './dashboard/DashboardContent';
import { getTabDefinitions, TabDefinition } from './dashboard/TabDefinitions';

export const RoleBasedDashboard: React.FC = () => {
  const { profile } = useUserProfile();
  const [activeTab, setActiveTab] = useState<string>("overview");
  
  if (!profile) return null;
  
  const userRole = profile.role;
  
  // Get tab definitions
  const tabs = getTabDefinitions();
  
  // Filter tabs based on user role
  const accessibleTabs = tabs.filter(tab => tab.roles.includes(userRole as UserRole));

  // Handle tab change
  const handleTabChange = (tabId: string) => {
    console.log('Changing to tab:', tabId);
    setActiveTab(tabId);
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <DashboardTabSelector 
        accessibleTabs={accessibleTabs} 
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
      <DashboardContent 
        accessibleTabs={accessibleTabs} 
        profile={profile} 
        activeTab={activeTab}
      />
    </Tabs>
  );
};
