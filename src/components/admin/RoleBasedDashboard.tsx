
import React, { useState, useEffect } from 'react';
import { Tabs } from "@/components/ui/tabs";
import { useUserProfile } from '@/hooks/useUserProfile';
import { UserRole } from '@/types/userTypes';
import { DashboardTabSelector } from './dashboard/DashboardTabSelector';
import { DashboardContent } from './dashboard/DashboardContent';
import { getTabDefinitions } from './dashboard/TabDefinitions';
import { useToast } from '@/hooks/use-toast';

export const RoleBasedDashboard: React.FC = () => {
  const { profile } = useUserProfile();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("overview");
  
  // Early return with null if profile is not available
  if (!profile) {
    return null;
  }
  
  // Get user role from profile
  const userRole = profile.role;
  
  // Get all tab definitions
  const tabs = getTabDefinitions();
  
  // Filter tabs based on user role
  const accessibleTabs = tabs.filter(tab => tab.roles.includes(userRole as UserRole));

  // Handle tab change with feedback
  const handleTabChange = (tabId: string) => {
    console.log('Changing to tab:', tabId);
    setActiveTab(tabId);
    toast({
      title: `Navigated to ${tabId.charAt(0).toUpperCase() + tabId.slice(1)}`,
      description: `Viewing ${tabId} dashboard content`,
    });
  };

  // If no tabs are accessible, show the first one
  useEffect(() => {
    if (accessibleTabs.length > 0 && !accessibleTabs.some(tab => tab.id === activeTab)) {
      setActiveTab(accessibleTabs[0].id);
    }
  }, [accessibleTabs, activeTab]);

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
