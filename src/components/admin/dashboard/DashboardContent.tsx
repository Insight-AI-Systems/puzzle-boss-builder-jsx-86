
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { TabDefinition } from './TabDefinitions';
import { NoAccessMessage } from '@/components/auth/NoAccessMessage';
import { UserProfile } from '@/types/userTypes';

// Import the components needed for each tab
import { OverviewDashboard } from "./OverviewDashboard";
import { UserManagement } from "@/components/admin/UserManagement";
import { PuzzleManagement } from "@/components/admin/PuzzleManagement";
import { MarketingDashboard } from "./MarketingDashboard";
import { NotificationsDashboard } from "./NotificationsDashboard";
import { MonitoringDashboard } from "./MonitoringDashboard";
import { FinancialDashboard } from "./financial-dashboard/FinancialDashboard";
import { CategoryManagement } from "./CategoryManagement";

interface DashboardContentProps {
  accessibleTabs: TabDefinition[];
  profile: UserProfile;
  activeTab: string;
}

export const DashboardContent: React.FC<DashboardContentProps> = ({ 
  accessibleTabs, 
  profile,
  activeTab 
}) => {
  console.log('DashboardContent rendering with activeTab:', activeTab);
  
  const isTabAccessible = (tabId: string) => {
    return accessibleTabs.some(tab => tab.id === tabId);
  };

  return (
    <div>
      {/* Overview Tab */}
      <TabsContent value="overview" className="space-y-4">
        {isTabAccessible('overview') ? (
          <OverviewDashboard profile={profile} />
        ) : (
          <NoAccessMessage resourceName="Dashboard Overview" />
        )}
      </TabsContent>

      {/* Users Tab */}
      <TabsContent value="users" className="space-y-4">
        {isTabAccessible('users') ? (
          <UserManagement />
        ) : (
          <NoAccessMessage resourceName="User Management" />
        )}
      </TabsContent>

      {/* Puzzles Tab */}
      <TabsContent value="puzzles" className="space-y-4">
        {isTabAccessible('puzzles') ? (
          <PuzzleManagement />
        ) : (
          <NoAccessMessage resourceName="Puzzle Management" />
        )}
      </TabsContent>

      {/* Categories Tab */}
      <TabsContent value="categories" className="space-y-4">
        {isTabAccessible('categories') ? (
          <CategoryManagement />
        ) : (
          <NoAccessMessage resourceName="Category Management" />
        )}
      </TabsContent>

      {/* Marketing Tab */}
      <TabsContent value="marketing" className="space-y-4">
        {isTabAccessible('marketing') ? (
          <MarketingDashboard />
        ) : (
          <NoAccessMessage resourceName="Marketing & Social" />
        )}
      </TabsContent>

      {/* Finance Tab */}
      <TabsContent value="finance" className="space-y-4">
        {isTabAccessible('finance') ? (
          <FinancialDashboard />
        ) : (
          <NoAccessMessage resourceName="Financial Dashboard" />
        )}
      </TabsContent>

      {/* Scheduling Tab */}
      <TabsContent value="scheduling" className="space-y-4">
        {isTabAccessible('scheduling') ? (
          <NotificationsDashboard />
        ) : (
          <NoAccessMessage resourceName="Content Schedule" />
        )}
      </TabsContent>

      {/* Settings Tab */}
      <TabsContent value="settings" className="space-y-4">
        {isTabAccessible('settings') ? (
          <MonitoringDashboard />
        ) : (
          <NoAccessMessage resourceName="Dashboard Settings" />
        )}
      </TabsContent>
    </div>
  );
};
