import { useLocation } from 'react-router-dom';
import { useUserProfile } from '@/hooks/useUserProfile';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem
} from '@/components/ui/sidebar';
import { adminNavItems, mainNavItems, userNavItems, supportNavItems, NavItem } from '@/config/navigation';
import { Link } from 'react-router-dom';

// This component is no longer used as we're consolidating to a single navigation bar
export function AppSidebar() {
  // Keep the component for future reference but it's not actively used
  return null;
}
