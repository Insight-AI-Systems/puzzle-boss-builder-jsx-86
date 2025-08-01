import React from 'react';
import { TabsContent } from "@/components/ui/tabs";
import { TabDefinition } from './TabDefinitions';

interface DashboardContentProps {
  accessibleTabs: TabDefinition[];
  profile: any;
  activeTab: string;
}

export const DashboardContent: React.FC<DashboardContentProps> = ({ 
  accessibleTabs, 
  profile, 
  activeTab 
}) => {
  console.log('📋 DashboardContent rendering for active tab:', activeTab);
  console.log('📋 Available tabs:', accessibleTabs.map(t => t.id));
  
  return (
    <>
      {accessibleTabs.map(tab => (
        <TabsContent key={tab.id} value={tab.id} className="mt-6">
          {(() => {
            if (activeTab === tab.id) {
              console.log('📋 Rendering component for tab:', tab.id);
              return <tab.component profile={profile} />;
            }
            return null;
          })()}
        </TabsContent>
      ))}
    </>
  );
};