
import React from 'react';
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
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
    <TabsList className="bg-puzzle-black/50 border border-puzzle-aqua/20 mb-6 flex flex-wrap w-full h-auto">
      {accessibleTabs.map(tab => {
        const Icon = tab.icon;
        return (
          <TabsTrigger 
            key={tab.id} 
            value={tab.id}
            onClick={() => onTabChange(tab.id)}
            data-state={activeTab === tab.id ? 'active' : 'inactive'}
            className="data-[state=active]:bg-puzzle-aqua/10 data-[state=active]:text-puzzle-aqua p-2 flex-grow md:flex-none"
          >
            <span className="mr-1">
              <Icon className="h-5 w-5" />
            </span>
            <span>{tab.name}</span>
          </TabsTrigger>
        );
      })}
    </TabsList>
  );
};
