
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUserProfile } from '@/hooks/useUserProfile';
import { MainNavItem } from './NavbarData';
import { useAuth } from '@/contexts/AuthContext';

interface NavLinksProps {
  items: MainNavItem[];
  className?: string;
  onClick?: () => void;
}

const NavLinks: React.FC<NavLinksProps> = ({ items, className = '', onClick }) => {
  const location = useLocation();
  const { profile } = useUserProfile();
  const { hasRole, isAdmin } = useAuth();
  
  const isLinkActive = (path: string) => {
    // Special case for home path
    if (path === '/') return location.pathname === '/';
    
    // For other paths, check if the current path starts with the link path
    // This handles nested routes while still highlighting the parent nav item
    return location.pathname.startsWith(path);
  };

  const shouldShowLink = (item: MainNavItem) => {
    if (!item.roles) return true;
    if (!profile) return false;
    
    // For debugging
    console.log('NavLink check:', {
      linkTitle: item.name,
      linkPath: item.path,
      requiredRoles: item.roles,
      userRole: profile.role,
      currentPath: location.pathname,
      isMatch: isLinkActive(item.path),
      isAdmin,
      hasAdminRole: hasRole('admin'),
      hasSuperAdminRole: hasRole('super_admin')
    });
    
    // Show the link if the user has any of the required roles or is admin
    return isAdmin || item.roles.some(role => hasRole(role));
  };
  
  return (
    <>
      {items.map((item) => shouldShowLink(item) && (
        <Link
          key={item.path}
          to={item.path}
          className={`${className} ${
            isLinkActive(item.path)
              ? 'text-puzzle-aqua bg-puzzle-aqua/10'
              : 'text-muted-foreground hover:text-puzzle-white hover:bg-white/10'
          }`}
          onClick={onClick}
        >
          {item.name}
        </Link>
      ))}
    </>
  );
};

export default NavLinks;
