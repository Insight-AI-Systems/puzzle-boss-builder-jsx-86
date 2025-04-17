
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

export function AppSidebar() {
  const { profile, isAdmin } = useUserProfile();
  const location = useLocation();
  
  // Filter admin items based on user role
  const filteredAdminItems = profile && isAdmin 
    ? adminNavItems.filter(item => {
        if (!item.roles) return true;
        return profile && item.roles.includes(profile.role);
      })
    : [];

  const isLinkActive = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  const renderNavItems = (items: NavItem[], groupLabel: string) => {
    if (items.length === 0) return null;
    
    return (
      <SidebarGroup>
        <SidebarGroupLabel>{groupLabel}</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton 
                  asChild 
                  isActive={isLinkActive(item.href)}
                  tooltip={item.title}
                >
                  <Link to={item.href}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
                
                {/* Support for subitems if available */}
                {item.subItems && item.subItems.length > 0 && (
                  <SidebarMenuSub>
                    {item.subItems.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.href}>
                        <SidebarMenuSubButton
                          asChild
                          isActive={isLinkActive(subItem.href)}
                        >
                          <Link to={subItem.href}>
                            <span>{subItem.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                )}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  };

  return (
    <Sidebar>
      <SidebarContent>
        {renderNavItems(mainNavItems, "Main")}
        {profile && isAdmin && renderNavItems(filteredAdminItems, "Admin")}
        {profile && renderNavItems(userNavItems, "User")}
        {renderNavItems(supportNavItems, "Support")}
      </SidebarContent>
    </Sidebar>
  );
}
