
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserManagement } from './UserManagement';
import { RoleManagement } from './RoleManagement';
import { useUserProfile } from '@/hooks/useUserProfile';
import { getTabDefinitions } from './dashboard/TabDefinitions';
import { DashboardTabSelector } from './dashboard/DashboardTabSelector';
import { DashboardContent } from './dashboard/DashboardContent';
import { useLocation, useNavigate } from 'react-router-dom';

export function RoleBasedDashboard() {
  const { profile, isAdmin } = useUserProfile();
  const [activeTab, setActiveTab] = useState("overview");
  const location = useLocation();
  const navigate = useNavigate();
  
  const isSuperAdmin = profile?.role === 'super_admin';
  
  // For debugging
  console.log('RoleBasedDashboard - Current profile:', profile);
  console.log('RoleBasedDashboard - Is Super Admin:', isSuperAdmin);
  console.log('RoleBasedDashboard - Is Admin:', isAdmin);
  
  // Get all available tabs based on user role
  const allTabs = getTabDefinitions();
  
  // Filter tabs based on user role
  const accessibleTabs = allTabs.filter(tab => 
    tab.roles.includes(profile?.role || 'player')
  );
  
  // Check URL for tab parameter on initial load
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    
    if (tabParam && accessibleTabs.some(tab => tab.id === tabParam)) {
      setActiveTab(tabParam);
    } else if (accessibleTabs.length > 0 && !tabParam) {
      // Default to first accessible tab if no tab parameter
      setActiveTab(accessibleTabs[0].id);
    }
  }, [location.search, accessibleTabs]);
  
  // Update URL when tab changes
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    navigate(`/admin-dashboard?tab=${tabId}`, { replace: true });
  };
  
  if (!profile) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="w-full">
      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={handleTabChange} className="w-full">
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
}
