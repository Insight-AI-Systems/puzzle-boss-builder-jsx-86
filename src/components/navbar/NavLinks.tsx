
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface NavItem {
  name: string;
  href: string;
  icon?: React.ComponentType<any>;
}

interface NavLinksProps {
  items: NavItem[];
  className?: string;
  isMobile?: boolean;
  onItemClick?: () => void;
}

const NavLinks: React.FC<NavLinksProps> = ({ items, className, isMobile = false, onItemClick }) => {
  const location = useLocation();
  
  // Check if we're currently on an admin page
  const isOnAdminPage = location.pathname.startsWith('/admin');

  return (
    <>
      {items.map((item) => {
        const isActive = location.pathname === item.href;
        const isHomeLink = item.href === '/';
        
        return (
          <Link
            key={item.name}
            to={item.href}
            state={isOnAdminPage && isHomeLink ? { skipAdminRedirect: true } : undefined}
            className={cn(
              'text-puzzle-white hover:text-puzzle-aqua hover:bg-white/10',
              isActive && 'text-puzzle-aqua bg-white/10',
              className
            )}
            onClick={onItemClick}
          >
            {item.icon && <item.icon className="h-5 w-5" />}
            {item.name}
          </Link>
        );
      })}
    </>
  );
};

export default NavLinks;
