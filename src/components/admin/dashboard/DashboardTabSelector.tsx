
import React from 'react';
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabDefinition } from './TabDefinitions';
import { 
  Users, Puzzle, FolderKanban, FileText, 
  Megaphone, Handshake, DollarSign, Shield, Mail, Bell, 
  Activity, TicketCheck, Info, BarChart
} from 'lucide-react';

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
      {accessibleTabs.map(tab => (
        <TabsTrigger 
          key={tab.id} 
          value={tab.id}
          onClick={() => onTabChange(tab.id)}
          data-state={activeTab === tab.id ? 'active' : 'inactive'}
          className="data-[state=active]:bg-puzzle-aqua/10 data-[state=active]:text-puzzle-aqua p-2 flex-grow md:flex-none"
        >
          <span className="mr-1">{tab.icon}</span>
          <span>{tab.label}</span>
        </TabsTrigger>
      ))}
    </TabsList>
  );
};
