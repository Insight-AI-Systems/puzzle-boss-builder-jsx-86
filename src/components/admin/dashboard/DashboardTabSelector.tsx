
import React from 'react';
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserRole } from '@/types/userTypes';
import { TabDefinition } from './TabDefinitions';

interface DashboardTabSelectorProps {
  accessibleTabs: TabDefinition[];
}

export const DashboardTabSelector: React.FC<DashboardTabSelectorProps> = ({ 
  accessibleTabs 
}) => {
  return (
    <TabsList className="bg-puzzle-black/50 border border-puzzle-aqua/20 mb-6 flex flex-wrap">
      {accessibleTabs.map(tab => (
        <TabsTrigger 
          key={tab.id} 
          value={tab.id} 
          className="data-[state=active]:bg-puzzle-aqua/10"
        >
          {tab.icon}
          {tab.label}
        </TabsTrigger>
      ))}
    </TabsList>
  );
};
