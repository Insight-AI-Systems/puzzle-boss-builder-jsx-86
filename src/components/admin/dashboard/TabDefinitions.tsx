
import { MailsIcon, BarChart, Users, ShoppingCart, Settings, Calendar, Briefcase } from 'lucide-react';

export interface TabDefinition {
  id: string;
  label: string;
  icon: React.ReactNode;
  roles: string[];
}

export function getTabDefinitions(): TabDefinition[] {
  return [
    {
      id: "overview",
      label: "Dashboard Overview",
      icon: <BarChart className="h-4 w-4" />,
      roles: ["super_admin", "admin", "category_manager", "social_media_manager", "partner_manager", "cfo"]
    },
    {
      id: "users",
      label: "User Management",
      icon: <Users className="h-4 w-4" />,
      roles: ["super_admin", "admin"]
    },
    {
      id: "puzzles",
      label: "Puzzle Management",
      icon: <ShoppingCart className="h-4 w-4" />,
      roles: ["super_admin", "admin", "category_manager"]
    },
    {
      id: "finances",
      label: "Financial Overview",
      icon: <Briefcase className="h-4 w-4" />,
      roles: ["super_admin", "admin", "cfo"]
    },
    {
      id: "marketing",
      label: "Marketing & Social",
      icon: <MailsIcon className="h-4 w-4" />,
      roles: ["super_admin", "admin", "social_media_manager"]
    },
    {
      id: "scheduling",
      label: "Content Schedule",
      icon: <Calendar className="h-4 w-4" />,
      roles: ["super_admin", "admin", "category_manager", "social_media_manager"]
    },
    {
      id: "settings",
      label: "Dashboard Settings",
      icon: <Settings className="h-4 w-4" />,
      roles: ["super_admin", "admin"]
    }
  ];
}
