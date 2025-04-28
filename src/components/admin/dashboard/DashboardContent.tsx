
import React from 'react';
import { TabsContent } from "@/components/ui/tabs";
import { UserProfile } from '@/types/userTypes';
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
          {/* Create an element of the component type with the profile prop */}
          {React.createElement(tab.component, { profile })}
        </TabsContent>
      ))}
    </>
  );
};
