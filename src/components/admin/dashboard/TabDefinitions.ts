
import React from 'react';
import { 
  LayoutDashboard, 
  FolderKanban, 
  Handshake, 
  DollarSign,
  Megaphone, 
  Bell,
  Activity,
  TicketCheck,
  Users,
  PuzzlePiece,
  Shield,
  BarChart,
  Layout
} from 'lucide-react';
import { OverviewDashboard } from "./OverviewDashboard";
import { CategoryManagement } from "../CategoryManagement";
import { FinancialDashboard } from "./FinancialDashboard";
import { PartnersDashboard } from "./partners/PartnersDashboard";
import { NotificationsDashboard } from "./NotificationsDashboard";
import { MonitoringDashboard } from "./MonitoringDashboard";
import { MarketingDashboard } from "./MarketingDashboard";
import TicketManagement from "./TicketManagement";

// Comment out imports that don't exist yet
// These will need to be implemented separately
// import { UserManagement } from "@/components/admin/user-management/UserManagement";
// import { PuzzleManagement } from "@/components/admin/puzzle-management/PuzzleManagement";
// import { SecurityDashboard } from "@/components/admin/SecurityDashboard";
// import HeroPuzzleManager from "@/components/admin/hero-puzzle/HeroPuzzleManager";
// import { AnalyticsDashboard } from "@/components/admin/analytics/AnalyticsDashboard";

export interface TabDefinition {
  id: string;
  name: string;
  icon: React.ReactNode; // Changed from string to ReactNode
  component: React.ComponentType<any>;
  roles: string[];
}

export function getTabDefinitions(): TabDefinition[] {
  return [
    {
      id: "overview",
      name: "Overview",
      icon: <LayoutDashboard className="h-5 w-5" />,
      component: OverviewDashboard,
      roles: ["super_admin", "admin", "category_manager", "partner_manager", "cfo", "social_media_manager"]
    },
    /* 
    {
      id: "puzzles",
      name: "Puzzles",
      icon: <PuzzlePiece className="h-5 w-5" />,
      component: PuzzleManagement,
      roles: ["super_admin", "admin", "category_manager"]
    },
    */
    {
      id: "categories",
      name: "Categories",
      icon: <FolderKanban className="h-5 w-5" />,
      component: CategoryManagement,
      roles: ["super_admin", "admin", "category_manager"]
    },
    {
      id: "partners",
      name: "Partners",
      icon: <Handshake className="h-5 w-5" />,
      component: PartnersDashboard,
      roles: ["super_admin", "admin", "partner_manager"]
    },
    /* 
    {
      id: "users",
      name: "Users",
      icon: <Users className="h-5 w-5" />,
      component: UserManagement,
      roles: ["super_admin", "admin"]
    },
    {
      id: "hero",
      name: "Hero Puzzle",
      icon: <Layout className="h-5 w-5" />,
      component: HeroPuzzleManager,
      roles: ["super_admin", "admin"]
    },
    */
    {
      id: "financials",
      name: "Financials",
      icon: <DollarSign className="h-5 w-5" />,
      component: FinancialDashboard,
      roles: ["super_admin", "admin", "cfo"]
    },
    {
      id: "marketing",
      name: "Marketing",
      icon: <Megaphone className="h-5 w-5" />,
      component: MarketingDashboard,
      roles: ["super_admin", "admin", "social_media_manager"]
    },
    /* 
    {
      id: "analytics",
      name: "Analytics",
      icon: <BarChart className="h-5 w-5" />,
      component: AnalyticsDashboard,
      roles: ["super_admin", "admin", "cfo", "category_manager"]
    },
    */
    {
      id: "notifications",
      name: "Notifications",
      icon: <Bell className="h-5 w-5" />,
      component: NotificationsDashboard,
      roles: ["super_admin", "admin"]
    },
    {
      id: "tickets",
      name: "Support Tickets",
      icon: <TicketCheck className="h-5 w-5" />,
      component: TicketManagement,
      roles: ["super_admin", "admin"]
    },
    {
      id: "monitoring",
      name: "Monitoring",
      icon: <Activity className="h-5 w-5" />,
      component: MonitoringDashboard,
      roles: ["super_admin", "admin"]
    }
    /*
    {
      id: "security",
      name: "Security",
      icon: <Shield className="h-5 w-5" />,
      component: SecurityDashboard,
      roles: ["super_admin", "admin"]
    }
    */
  ];
}
