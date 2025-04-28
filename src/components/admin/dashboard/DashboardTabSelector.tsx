
import React from 'react';
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabDefinition } from './TabDefinitions';
import { 
  LayoutDashboard, Users, Puzzle, FolderKanban, FileText, 
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
  // Function to render the icon based on its name
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case "LayoutDashboard": return <LayoutDashboard className="h-5 w-5" />;
      case "Users": return <Users className="h-5 w-5" />;
      case "Puzzle": return <Puzzle className="h-5 w-5" />;
      case "FolderKanban": return <FolderKanban className="h-5 w-5" />;
      case "FileText": return <FileText className="h-5 w-5" />;
      case "Megaphone": return <Megaphone className="h-5 w-5" />;
      case "Handshake": return <Handshake className="h-5 w-5" />;
      case "DollarSign": return <DollarSign className="h-5 w-5" />;
      case "Shield": return <Shield className="h-5 w-5" />;
      case "Mail": return <Mail className="h-5 w-5" />;
      case "Bell": return <Bell className="h-5 w-5" />;
      case "Activity": return <Activity className="h-5 w-5" />;
      case "TicketCheck": return <TicketCheck className="h-5 w-5" />;
      case "Info": return <Info className="h-5 w-5" />;
      case "BarChart": return <BarChart className="h-5 w-5" />;
      default: return null;
    }
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
