
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
    // Extract the base path without query parameters
    const currentPath = location.pathname;
    
    // Special case for home path
    if (path === '/') return currentPath === '/';
    
    // Split query parameters from path
    const basePath = path.split('?')[0];
    
    // Special case for paths with query params like /admin-dashboard?tab=finance
    if (path.includes('?')) {
      const searchParams = new URLSearchParams(path.split('?')[1]);
      const currentParams = new URLSearchParams(location.search);
      
      // For finance tab specifically, add a stricter check
      if (path.includes('tab=finance') && currentPath === '/admin-dashboard') {
        return currentParams.get('tab') === 'finance';
      }
      
      // Check if base path matches and required query parameters are present
      if (currentPath === basePath) {
        for (const [key, value] of searchParams.entries()) {
          if (currentParams.get(key) !== value) {
            return false;
          }
        }
        return true;
      }
      return false;
    }
    
    // For admin dashboard without params, make sure we're not on a tab
    if (path === '/admin-dashboard' && currentPath === '/admin-dashboard') {
      const currentParams = new URLSearchParams(location.search);
      return !currentParams.has('tab');
    }
    
    // For other paths, check if the current path starts with the link path
    // This handles nested routes while still highlighting the parent nav item
    return currentPath === basePath;
  };

  const shouldShowLink = (item: MainNavItem) => {
    if (!item.roles) return true;
    if (!profile) return false;
    
    // Show the link if the user has any of the required roles or is admin
    return isAdmin || item.roles.some(role => hasRole(role));
  };

  // Add special handling for home link when in admin pages
  const getHomeLinkProps = (path: string) => {
    if (path === '/' && location.pathname.startsWith('/admin')) {
      // Add a special flag to skip the admin redirect when coming from admin pages
      return { 
        to: '/', 
        state: { skipAdminRedirect: true }
      };
    }
    return { to: path };
  };
  
  return (
    <>
      {items.map((item) => shouldShowLink(item) && (
        <Link
          key={item.path}
          {...getHomeLinkProps(item.path)}
          className={`${className} ${
            isLinkActive(item.path)
              ? 'text-puzzle-aqua bg-puzzle-aqua/10'
              : 'text-muted-foreground hover:text-puzzle-white hover:bg-white/10'
          }`}
          onClick={onClick}
          data-testid={`nav-link-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
        >
          {item.name}
        </Link>
      ))}
    </>
  );
};

export default NavLinks;
