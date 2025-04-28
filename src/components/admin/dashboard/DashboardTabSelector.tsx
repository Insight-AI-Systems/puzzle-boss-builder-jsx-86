
import React from 'react';
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabDefinition } from './TabDefinitions';
import * as LucideIcons from 'lucide-react';

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
  // Function to dynamically render the icon based on its name
  const renderIcon = (iconName: string) => {
    // Type assertion to access the icon components by name
    const icons = LucideIcons as Record<string, React.ComponentType<any>>;
    const IconComponent = icons[iconName];
    
    return IconComponent ? <IconComponent className="h-5 w-5" /> : null;
  };

  return (
    <TabsList className="bg-puzzle-black/50 border border-puzzle-aqua/20 mb-6 flex flex-wrap w-full h-auto">
      {accessibleTabs.map(tab => (
        <TabsTrigger 
          key={tab.id} 
          value={tab.id}
          onClick={() => onTabChange(tab.id)}
          data-state={activeTab === tab.id ? 'active' : 'inactive'}
          className="data-[state=active]:bg-puzzle-aqua/10 data-[state=active]:text-puzzle-aqua p-2 flex-grow md:flex-none"
        >
          <span className="mr-1">{renderIcon(tab.icon)}</span>
          <span>{tab.name}</span>
        </TabsTrigger>
      ))}
    </TabsList>
  );
};
