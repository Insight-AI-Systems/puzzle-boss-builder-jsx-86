
import React from 'react';
import { Tabs } from "@/components/ui/tabs"
import { DashboardContent } from './dashboard/DashboardContent';
import { DashboardTabSelector } from './dashboard/DashboardTabSelector';
import { getTabDefinitions } from './dashboard/TabDefinitions';
import { useSearchParams } from 'react-router-dom';
import { UserRole } from '@/types/userTypes';
import { useClerkRoles } from '@/hooks/useClerkRoles';
import { AdminErrorBoundary } from './ErrorBoundary';

export const RoleBasedDashboard: React.FC = () => {
  const { userRole, canAccessAdminDashboard } = useClerkRoles();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  
  console.log('📊 RoleBasedDashboard - Access check:', {
    userRole,
    canAccessAdminDashboard: canAccessAdminDashboard(),
    authSource: 'clerk_roles'
  });
  
  // Get tab definitions and filter by permissions
  const allTabs = getTabDefinitions();
  const accessibleTabs = allTabs.filter(tab => {
    // Super admins see all tabs
    if (userRole === 'super_admin') return true;
    
    // Check if current role is in the tab's allowed roles
    return tab.roles.some(role => role === userRole);
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

  // Create a default profile for admin access
  const mappedProfile = {
    id: 'admin-user',
    display_name: 'Admin User',
    bio: '',
    role: userRole as UserRole,
    country: '',
    categories_played: [],
    credits: 0,
    tokens: 0,
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
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-game text-puzzle-aqua">
            {userRole === 'super_admin' ? 'Super Admin Dashboard' : 
             userRole === 'admin' ? 'Admin Dashboard' : 
             `${userRole?.replace('_', ' ')} Dashboard`}
          </h1>
          <div className="text-sm text-muted-foreground">
            Role: {userRole} | Access: {canAccessAdminDashboard() ? 'Granted' : 'Denied'}
          </div>
        </div>
        
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
