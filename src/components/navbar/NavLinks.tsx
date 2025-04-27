
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
    if (path === '/') return location.pathname === '/';
    return location.pathname === path;
  };

  const shouldShowLink = (item: MainNavItem) => {
    if (!item.roles) return true;
    if (!profile) return false;
    
    // Add debug logging to help troubleshoot role issues
    console.log('NavLink check:', {
      linkTitle: item.name,
      linkPath: item.path,
      requiredRoles: item.roles,
      userRole: profile.role,
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
