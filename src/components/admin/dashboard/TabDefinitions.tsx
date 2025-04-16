
import React from 'react';
import { UserRole } from '@/types/userTypes';
import { 
  LayoutDashboard, Users, Puzzle, ImageIcon, FileText, Star, 
  ShoppingCart, Settings, BarChart, Lock, Mail, Eye, Bell
} from "lucide-react";

export interface TabDefinition {
  id: string;
  label: string;
  icon: React.ReactNode;
  roles: UserRole[];
}

export const getTabDefinitions = (): TabDefinition[] => [
  {
    id: "overview",
    label: "Overview",
    icon: <LayoutDashboard className="h-4 w-4 mr-2" />,
    roles: ['super_admin', 'admin', 'category_manager', 'social_media_manager', 'partner_manager', 'cfo']
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: <BarChart className="h-4 w-4 mr-2" />,
    roles: ['super_admin', 'admin', 'category_manager', 'social_media_manager', 'partner_manager', 'cfo']
  },
  {
    id: "users",
    label: "User Management",
    icon: <Users className="h-4 w-4 mr-2" />,
    roles: ['super_admin', 'admin']
  },
  {
    id: "puzzles",
    label: "Puzzles",
    icon: <Puzzle className="h-4 w-4 mr-2" />,
    roles: ['super_admin', 'admin', 'category_manager']
  },
  {
    id: "categories",
    label: "Categories",
    icon: <ImageIcon className="h-4 w-4 mr-2" />,
    roles: ['super_admin', 'admin', 'category_manager']
  },
  {
    id: "content",
    label: "Content",
    icon: <FileText className="h-4 w-4 mr-2" />,
    roles: ['super_admin', 'admin', 'social_media_manager']
  },
  {
    id: "marketing",
    label: "Marketing",
    icon: <Star className="h-4 w-4 mr-2" />,
    roles: ['super_admin', 'admin', 'social_media_manager']
  },
  {
    id: "partners",
    label: "Partners",
    icon: <ShoppingCart className="h-4 w-4 mr-2" />,
    roles: ['super_admin', 'admin', 'partner_manager']
  },
  {
    id: "finance",
    label: "Finance",
    icon: <Settings className="h-4 w-4 mr-2" />,
    roles: ['super_admin', 'admin', 'cfo']
  },
  {
    id: "security",
    label: "Security",
    icon: <Lock className="h-4 w-4 mr-2" />,
    roles: ['super_admin']
  },
  {
    id: "email",
    label: "Email",
    icon: <Mail className="h-4 w-4 mr-2" />,
    roles: ['super_admin', 'admin']
  },
  {
    id: "monitoring",
    label: "Monitoring",
    icon: <Eye className="h-4 w-4 mr-2" />,
    roles: ['super_admin']
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: <Bell className="h-4 w-4 mr-2" />,
    roles: ['super_admin', 'admin']
  }
];
