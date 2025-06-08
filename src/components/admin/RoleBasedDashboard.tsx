
import React from 'react';
import { Tabs } from "@/components/ui/tabs"
import { DashboardContent } from './dashboard/DashboardContent';
import { DashboardTabSelector } from './dashboard/DashboardTabSelector';
import { getTabDefinitions } from './dashboard/TabDefinitions';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useSearchParams } from 'react-router-dom';
import { UserRole } from '@/types/userTypes';
import { useClerkAuth } from '@/hooks/useClerkAuth';
import { AdminErrorBoundary } from './ErrorBoundary';

export const RoleBasedDashboard: React.FC = () => {
  const { hasRole, userRole, isAdmin } = useClerkAuth();
  const { profile } = useUserProfile();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  
  // Get tab definitions and filter by role
  const allTabs = getTabDefinitions();
  const accessibleTabs = allTabs.filter(tab => {
    if (isAdmin) return true; // Admins see all tabs
    return tab.roles.some(role => hasRole(role as UserRole));
  });
  
  console.log('📊 RoleBasedDashboard - Accessible tabs:', accessibleTabs.map(t => t.id));
  
  // Set active tab
  const [activeTab, setActiveTab] = React.useState(() => {
    if (tabParam && accessibleTabs.some(tab => tab.id === tabParam)) {
      return tabParam;
    }
    return accessibleTabs.length > 0 ? accessibleTabs[0].id : "users";
  });
  
  // Handle tab changes
  const handleTabChange = (newTab: string) => {
    console.log('📊 Tab changing to:', newTab);
    setActiveTab(newTab);
    setSearchParams({ tab: newTab });
  };

  // Update active tab when URL changes
  React.useEffect(() => {
    if (tabParam && accessibleTabs.some(tab => tab.id === tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam, accessibleTabs]);

  // Create mapped profile for compatibility
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
    <AdminErrorBoundary>
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
    </AdminErrorBoundary>
  );
};

export default RoleBasedDashboard;
