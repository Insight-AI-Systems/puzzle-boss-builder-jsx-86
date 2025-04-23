
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs } from "@/components/ui/tabs"
import { DashboardContent } from './dashboard/DashboardContent';
import { DashboardTabSelector } from './dashboard/DashboardTabSelector';
import { getTabDefinitions } from './dashboard/TabDefinitions';
import { useUserProfile } from '@/hooks/useUserProfile';

export const RoleBasedDashboard: React.FC = () => {
  const { hasRole } = useAuth();
  const { profile } = useUserProfile();
  const [activeTab, setActiveTab] = React.useState("overview");

  // Get all tab definitions
  const allTabs = getTabDefinitions();
  
  // Filter tabs based on user roles
  const accessibleTabs = allTabs.filter(tab => 
    tab.roles.some(role => hasRole(role))
  );

  if (!profile) {
    return null;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-game text-puzzle-aqua">Admin Dashboard</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <DashboardTabSelector 
          accessibleTabs={accessibleTabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
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
