
import React from 'react';
import { CategoryManagement } from "./CategoryManagement";
import { PartnersDashboard } from "./partners/PartnersDashboard";
import { NotificationsDashboard } from "./NotificationsDashboard";
import { MonitoringDashboard } from "./MonitoringDashboard";
import { MarketingDashboard } from "./MarketingDashboard";
import TicketManagement from "./TicketManagement";
import { PuzzleManagement } from "@/components/admin/PuzzleManagement"; 
import { UserManagement } from "@/components/admin/UserManagement"; 
import { SecurityDashboard } from "@/components/admin/SecurityDashboard";
import { ContentManagement } from "@/components/admin/ContentManagement";
import { EmailManagement } from "@/components/admin/EmailManagement";
import { AnalyticsDashboard } from "@/components/admin/analytics/AnalyticsDashboard";
import { FinancialDashboard } from "./financial-dashboard/FinancialDashboard";

export interface TabDefinition {
  id: string;
  name: string;
  icon: string;
  component: React.ComponentType<any>;
  roles: string[];
}

export function getTabDefinitions(): TabDefinition[] {
  return [
    {
      id: "analytics",
      name: "Analytics",
      icon: "BarChart",
      component: AnalyticsDashboard,
      roles: ["super_admin", "admin", "cfo", "category_manager"]
    },
    {
      id: "users",
      name: "Users",
      icon: "Users",
      component: UserManagement,
      roles: ["super_admin", "admin"]
    },
    {
      id: "puzzles",
      name: "Puzzles",
      icon: "Puzzle",
      component: PuzzleManagement,
      roles: ["super_admin", "admin", "category_manager"]
    },
    {
      id: "categories",
      name: "Categories",
      icon: "FolderKanban",
      component: CategoryManagement,
      roles: ["super_admin", "admin", "category_manager"]
    },
    {
      id: "content",
      name: "Content",
      icon: "FileText",
      component: ContentManagement,
      roles: ["super_admin", "social_media_manager"]
    },
    {
      id: "marketing",
      name: "Marketing",
      icon: "Megaphone",
      component: MarketingDashboard,
      roles: ["super_admin", "admin", "social_media_manager"]
    },
    {
      id: "partners",
      name: "Partners",
      icon: "Handshake",
      component: PartnersDashboard,
      roles: ["super_admin", "admin", "partner_manager"]
    },
    {
      id: "security",
      name: "Security",
      icon: "Shield",
      component: SecurityDashboard,
      roles: ["super_admin", "admin"]
    },
    {
      id: "email",
      name: "Email",
      icon: "Mail",
      component: EmailManagement,
      roles: ["super_admin"]
    },
    {
      id: "notifications",
      name: "Notifications",
      icon: "Bell",
      component: NotificationsDashboard,
      roles: ["super_admin", "admin"]
    },
    {
      id: "tickets",
      name: "Support Tickets",
      icon: "TicketCheck",
      component: TicketManagement,
      roles: ["super_admin", "admin"]
    },
    {
      id: "monitoring",
      name: "Monitoring",
      icon: "Activity",
      component: MonitoringDashboard,
      roles: ["super_admin", "admin"]
    },
    {
      id: "finance",
      name: "Finance",
      icon: "DollarSign",
      component: FinancialDashboard,
      roles: ["super_admin", "admin", "cfo"]
    }
  ];
}
