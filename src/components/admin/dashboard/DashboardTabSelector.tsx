
import React from 'react';
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserRole } from '@/types/userTypes';
import { TabDefinition } from './TabDefinitions';

interface DashboardTabSelectorProps {
  accessibleTabs: TabDefinition[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const DashboardTabSelector: React.FC<DashboardTabSelectorProps> = ({ 
  accessibleTabs,
  activeTab,
  onTabChange
}) => {
  return (
    <TabsList className="bg-puzzle-black/50 border border-puzzle-aqua/20 mb-6 flex flex-wrap">
      {accessibleTabs.map(tab => (
        <TabsTrigger 
          key={tab.id} 
          value={tab.id}
          onClick={() => onTabChange(tab.id)}
          data-state={activeTab === tab.id ? 'active' : 'inactive'}
          className="data-[state=active]:bg-puzzle-aqua/10"
        >
          {tab.icon}
          {tab.label}
        </TabsTrigger>
      ))}
    </TabsList>
  );
};
