
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { TabDefinition } from './TabDefinitions';
import { OverviewTab } from './tabs/OverviewTab';
import { UsersTab } from './tabs/UsersTab';
import { PuzzlesTab } from './tabs/PuzzlesTab';
import { SettingsTab } from './tabs/SettingsTab';
import { MarketingTab } from './tabs/MarketingTab';
import { SchedulingTab } from './tabs/SchedulingTab';
import { FinancialDashboard } from './FinancialDashboard';
import { NoAccessMessage } from '@/components/auth/NoAccessMessage';
import { Profile } from '@/types/userTypes';

interface DashboardContentProps {
  accessibleTabs: TabDefinition[];
  profile: Profile;
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
          <OverviewTab />
        ) : (
          <NoAccessMessage resourceName="Dashboard Overview" />
        )}
      </TabsContent>

      {/* Users Tab */}
      <TabsContent value="users" className="space-y-4">
        {isTabAccessible('users') ? (
          <UsersTab />
        ) : (
          <NoAccessMessage resourceName="User Management" />
        )}
      </TabsContent>

      {/* Puzzles Tab */}
      <TabsContent value="puzzles" className="space-y-4">
        {isTabAccessible('puzzles') ? (
          <PuzzlesTab />
        ) : (
          <NoAccessMessage resourceName="Puzzle Management" />
        )}
      </TabsContent>

      {/* Finances Tab */}
      <TabsContent value="finances" className="space-y-4">
        {isTabAccessible('finances') ? (
          <FinancialDashboard />
        ) : (
          <NoAccessMessage resourceName="Financial Overview" />
        )}
      </TabsContent>

      {/* Marketing Tab */}
      <TabsContent value="marketing" className="space-y-4">
        {isTabAccessible('marketing') ? (
          <MarketingTab />
        ) : (
          <NoAccessMessage resourceName="Marketing & Social" />
        )}
      </TabsContent>

      {/* Scheduling Tab */}
      <TabsContent value="scheduling" className="space-y-4">
        {isTabAccessible('scheduling') ? (
          <SchedulingTab />
        ) : (
          <NoAccessMessage resourceName="Content Schedule" />
        )}
      </TabsContent>

      {/* Settings Tab */}
      <TabsContent value="settings" className="space-y-4">
        {isTabAccessible('settings') ? (
          <SettingsTab />
        ) : (
          <NoAccessMessage resourceName="Dashboard Settings" />
        )}
      </TabsContent>
    </div>
  );
};
