
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { TabDefinition } from './TabDefinitions';
import { NoAccessMessage } from '@/components/auth/NoAccessMessage';
import { UserProfile } from '@/types/userTypes';

// Import the components needed for each tab
import { UserManagement } from "@/components/admin/UserManagement";
import { PuzzleManagement } from "@/components/admin/PuzzleManagement";
import { MarketingDashboard } from "./MarketingDashboard";
import { NotificationsDashboard } from "./NotificationsDashboard";
import { MonitoringDashboard } from "./MonitoringDashboard";
import { FinancialDashboard } from "./financial-dashboard/FinancialDashboard";
import { CategoryManagement } from "./CategoryManagement";
import { PartnersDashboard } from "./partners/PartnersDashboard";
import { SecurityDashboard } from "@/components/admin/SecurityDashboard";
import { ContentManagement } from "@/components/admin/ContentManagement";
import { EmailManagement } from "@/components/admin/EmailManagement";
import { AnalyticsDashboard } from "@/components/admin/analytics/AnalyticsDashboard";
import TicketManagement from "./TicketManagement";

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
      {/* Analytics Tab */}
      <TabsContent value="analytics" className="space-y-4">
        {isTabAccessible('analytics') ? (
          <AnalyticsDashboard />
        ) : (
          <NoAccessMessage resourceName="Analytics Dashboard" />
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

      {/* Content Tab */}
      <TabsContent value="content" className="space-y-4">
        {isTabAccessible('content') ? (
          <ContentManagement />
        ) : (
          <NoAccessMessage resourceName="Content Management" />
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

      {/* Partners Tab */}
      <TabsContent value="partners" className="space-y-4">
        {isTabAccessible('partners') ? (
          <PartnersDashboard />
        ) : (
          <NoAccessMessage resourceName="Partner Management" />
        )}
      </TabsContent>

      {/* Security Tab */}
      <TabsContent value="security" className="space-y-4">
        {isTabAccessible('security') ? (
          <SecurityDashboard />
        ) : (
          <NoAccessMessage resourceName="Security Dashboard" />
        )}
      </TabsContent>

      {/* Email Tab */}
      <TabsContent value="email" className="space-y-4">
        {isTabAccessible('email') ? (
          <EmailManagement />
        ) : (
          <NoAccessMessage resourceName="Email Management" />
        )}
      </TabsContent>

      {/* Notifications Tab */}
      <TabsContent value="notifications" className="space-y-4">
        {isTabAccessible('notifications') ? (
          <NotificationsDashboard />
        ) : (
          <NoAccessMessage resourceName="Notifications Dashboard" />
        )}
      </TabsContent>

      {/* Tickets Tab */}
      <TabsContent value="tickets" className="space-y-4">
        {isTabAccessible('tickets') ? (
          <TicketManagement />
        ) : (
          <NoAccessMessage resourceName="Support Tickets" />
        )}
      </TabsContent>

      {/* Monitoring Tab */}
      <TabsContent value="monitoring" className="space-y-4">
        {isTabAccessible('monitoring') ? (
          <MonitoringDashboard />
        ) : (
          <NoAccessMessage resourceName="Monitoring Dashboard" />
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
    </div>
  );
};
