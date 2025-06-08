
import React from 'react';
import { Tabs } from "@/components/ui/tabs"
import { DashboardContent } from './dashboard/DashboardContent';
import { DashboardTabSelector } from './dashboard/DashboardTabSelector';
import { getTabDefinitions } from './dashboard/TabDefinitions';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useSearchParams } from 'react-router-dom';
import { UserRole } from '@/types/userTypes';
import { useClerkAuth } from '@/hooks/useClerkAuth';

export const RoleBasedDashboard: React.FC = () => {
  const { hasRole, userRole, isAdmin } = useClerkAuth();
  const { profile } = useUserProfile();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  
  // Debug logging
  React.useEffect(() => {
    console.log('📊 RoleBasedDashboard Debug:', {
      userRole,
      isAdmin,
      tabParam,
      hasAdminRole: hasRole('admin'),
      hasSuperAdminRole: hasRole('super_admin')
    });
  }, [userRole, isAdmin, tabParam, hasRole]);
  
  // Get all tab definitions
  const allTabs = getTabDefinitions();
  
  // Enhanced role checking - if user is admin, show all tabs
  const accessibleTabs = allTabs.filter(tab => {
    if (isAdmin) return true; // Admins see all tabs
    return tab.roles.some(role => hasRole(role as UserRole));
  });
  
  console.log('📊 Accessible tabs:', accessibleTabs.map(t => t.id));
  
  // Set initial active tab from URL or default to first accessible tab
  const [activeTab, setActiveTab] = React.useState(() => {
    // Check if the tab from URL is accessible to the user
    if (tabParam && accessibleTabs.some(tab => tab.id === tabParam)) {
      return tabParam;
    }
    // Default to the first accessible tab
    return accessibleTabs.length > 0 ? accessibleTabs[0].id : "users";
  });
  
  // Update URL when tab changes
  const handleTabChange = (newTab: string) => {
    console.log('📊 Tab changing to:', newTab);
    setActiveTab(newTab);
    setSearchParams({ tab: newTab });
  };

  // Update active tab when URL changes
  React.useEffect(() => {
    if (tabParam && accessibleTabs.some(tab => tab.id === tabParam)) {
      console.log('📊 Setting active tab from URL:', tabParam);
      setActiveTab(tabParam);
    }
  }, [tabParam, accessibleTabs]);

  if (!profile && !isAdmin) {
    console.log('📊 No profile and not admin, showing loading or null');
    return null;
  }

  // Convert the profile to match expected interface
  const mappedProfile = profile ? {
    ...profile,
    display_name: profile.display_name || profile.email || 'Unknown User',
    bio: profile.bio || '',
    role: profile.role,
    country: profile.country || '',
    categories_played: profile.categories_played || [],
    credits: profile.credits || 0,
    achievements: profile.achievements || [],
    referral_code: profile.referral_code || null
  } : {
    id: 'temp-admin',
    display_name: 'Admin User',
    bio: '',
    role: 'super_admin' as UserRole,
    country: '',
    categories_played: [],
    credits: 0,
    achievements: [],
    referral_code: null,
    email: '',
    avatar_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
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
