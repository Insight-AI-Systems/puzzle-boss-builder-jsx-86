
import React from 'react';
import { TabsContent } from "@/components/ui/tabs";
import { UserProfile } from '@/types/userTypes';
import { OverviewDashboard } from './OverviewDashboard';
import { CategoryManagement } from './CategoryManagement';
import { MarketingDashboard } from './MarketingDashboard';
import { PartnersDashboard } from './PartnersDashboard';
import { FinancialDashboard } from './FinancialDashboard';
import { MonitoringDashboard } from './MonitoringDashboard';
import { NotificationsDashboard } from './NotificationsDashboard';
import { AnalyticsDashboard } from '../analytics/AnalyticsDashboard';
import { UserManagement } from '../UserManagement';
import { GameManagement } from '../GameManagement';
import { ContentManagement } from '../ContentManagement';
import { SecurityDashboard } from '../SecurityDashboard';
import { EmailManagement } from '../EmailManagement';
import { PuzzleCreateContent } from './PuzzleCreateContent';
import { TabDefinition } from './TabDefinitions';

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
  // Map tab IDs to their corresponding components
  const getComponentForTab = (tabId: string) => {
    switch (tabId) {
      case 'overview':
        return <OverviewDashboard profile={profile} />;
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'users':
        return <UserManagement />;
      case 'puzzles':
        return <GameManagement />;
      case 'puzzle-create':
        return <PuzzleCreateContent />;
      case 'categories':
        return <CategoryManagement />;
      case 'content':
        return <ContentManagement />;
      case 'marketing':
        return <MarketingDashboard />;
      case 'partners':
        return <PartnersDashboard />;
      case 'finance':
        return <FinancialDashboard />;
      case 'security':
        return <SecurityDashboard />;
      case 'email':
        return <EmailManagement />;
      case 'monitoring':
        return <MonitoringDashboard />;
      case 'notifications':
        return <NotificationsDashboard />;
      default:
        return <div>Tab content not found</div>;
    }
  };

  return (
    <>
      {accessibleTabs.map(tab => (
        <TabsContent 
          key={tab.id} 
          value={tab.id} 
          className="pt-4"
          // Only apply forceMount={true} if this is the active tab
          {...(tab.id === activeTab ? { forceMount: true } : {})}
        >
          {getComponentForTab(tab.id)}
        </TabsContent>
      ))}
      
      {/* Special case for puzzle creation which isn't in the tabs list */}
      {activeTab === 'puzzle-create' && (
        <TabsContent 
          value="puzzle-create" 
          className="pt-4"
          forceMount={true}
        >
          <PuzzleCreateContent />
        </TabsContent>
      )}
    </>
  );
};
