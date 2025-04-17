
import React, { useState, useEffect } from 'react';
import { Tabs } from "@/components/ui/tabs";
import { useUserProfile } from '@/hooks/useUserProfile';
import { UserRole } from '@/types/userTypes';
import { DashboardTabSelector } from './dashboard/DashboardTabSelector';
import { DashboardContent } from './dashboard/DashboardContent';
import { getTabDefinitions } from './dashboard/TabDefinitions';
import { useToast } from '@/hooks/use-toast';

export const RoleBasedDashboard: React.FC = () => {
  // All hooks must be called at the top level, consistently
  const { profile } = useUserProfile();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [accessibleTabs, setAccessibleTabs] = useState<ReturnType<typeof getTabDefinitions>>([]);
  
  // Define handlers outside of conditional statements
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    toast({
      title: `Navigated to ${tabId.charAt(0).toUpperCase() + tabId.slice(1)}`,
      description: `Viewing ${tabId} dashboard content`,
    });
  };
  
  // Use effect for tab loading and filtering
  useEffect(() => {
    if (!profile) return;
    
    console.log('Tab filtering effect running with role:', profile.role);
    
    // Get all tab definitions
    const tabs = getTabDefinitions();
    
    // Filter tabs based on user role
    const filtered = tabs.filter(tab => 
      tab.roles.includes(profile.role as UserRole)
    );
    
    console.log('Filtered tabs:', filtered.map(t => t.id));
    setAccessibleTabs(filtered);
    
    // If we have tabs and current active tab isn't in filtered list, set to first available
    if (filtered.length > 0 && !filtered.some(tab => tab.id === activeTab)) {
      setActiveTab(filtered[0].id);
    }
  }, [profile, activeTab]);
  
  // Early return before rendering if profile is not available
  if (!profile) {
    console.log('No profile available, returning null');
    return null;
  }

  console.log('Rendering dashboard with active tab:', activeTab);
  console.log('Accessible tabs:', accessibleTabs.map(t => t.id));

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
