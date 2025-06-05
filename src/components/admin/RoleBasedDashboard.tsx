
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs } from "@/components/ui/tabs"
import { DashboardContent } from './dashboard/DashboardContent';
import { DashboardTabSelector } from './dashboard/DashboardTabSelector';
import { getTabDefinitions } from './dashboard/TabDefinitions';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useSearchParams } from 'react-router-dom';
import { UserRole } from '@/types/userTypes';

export const RoleBasedDashboard: React.FC = () => {
  const { hasRole } = useAuth();
  const { profile } = useUserProfile();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  
  // Get all tab definitions
  const allTabs = getTabDefinitions();
  
  // Filter tabs based on user roles
  const accessibleTabs = allTabs.filter(tab => 
    tab.roles.some(role => hasRole(role as UserRole))
  );
  
  // Set initial active tab from URL or default to first accessible tab
  const [activeTab, setActiveTab] = React.useState(() => {
    // Check if the tab from URL is accessible to the user
    if (tabParam && accessibleTabs.some(tab => tab.id === tabParam)) {
      return tabParam;
    }
    // Default to the first accessible tab instead of "overview"
    return accessibleTabs.length > 0 ? accessibleTabs[0].id : "users";
  });
  
  // Update URL when tab changes
  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
    setSearchParams({ tab: newTab });
  };

  if (!profile) {
    return null;
  }

  // Convert the profile to match expected interface
  const mappedProfile = {
    ...profile,
    display_name: profile.display_name || profile.email || 'Unknown User',
    bio: profile.bio || '',
    role: profile.role,
    country: profile.country || '',
    categories_played: profile.categories_played || [],
    credits: profile.credits || 0,
    achievements: profile.achievements || [],
    referral_code: profile.referral_code || null
  };

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
          profile={mappedProfile}
          activeTab={activeTab}
        />
      </Tabs>
    </div>
  );
};

export default RoleBasedDashboard;
