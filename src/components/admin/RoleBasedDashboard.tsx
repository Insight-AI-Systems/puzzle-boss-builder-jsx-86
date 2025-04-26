
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs } from "@/components/ui/tabs"
import { DashboardContent } from './dashboard/DashboardContent';
import { DashboardTabSelector } from './dashboard/DashboardTabSelector';
import { getTabDefinitions } from './dashboard/TabDefinitions';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useSearchParams } from 'react-router-dom';

export const RoleBasedDashboard: React.FC = () => {
  const { hasRole } = useAuth();
  const { profile } = useUserProfile();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  
  // Get all tab definitions
  const allTabs = getTabDefinitions();
  
  // Filter tabs based on user roles
  const accessibleTabs = allTabs.filter(tab => 
    tab.roles.some(role => hasRole(role))
  );
  
  // Set initial active tab from URL or default to "overview"
  const [activeTab, setActiveTab] = React.useState(() => {
    // Check if the tab from URL is accessible to the user
    if (tabParam && accessibleTabs.some(tab => tab.id === tabParam)) {
      return tabParam;
    }
    return "overview";
  });
  
  // Update URL when tab changes
  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
    setSearchParams({ tab: newTab });
  };

  if (!profile) {
    return null;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-game text-puzzle-aqua">Admin Dashboard</h1>
      
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
    </div>
  );
};

export default RoleBasedDashboard;
