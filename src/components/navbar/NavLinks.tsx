
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export interface NavItem {
  name: string;
  path: string;
}

interface NavLinksProps {
  items: NavItem[];
  className?: string;
  onClick?: () => void;
}

const NavLinks: React.FC<NavLinksProps> = ({ items, className = '', onClick }) => {
  const location = useLocation();
  
  const isLinkActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };
  
  return (
    <>
      {items.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`${className} ${
            isLinkActive(item.path)
              ? 'text-puzzle-aqua bg-puzzle-aqua/10'
              : 'text-muted-foreground hover:text-puzzle-white hover:bg-white/10'
          }`}
          onClick={(e) => {
            // Log navigation attempt
            console.log(`Navigating to: ${item.path}`);
            if (onClick) onClick();
          }}
        >
          {item.name}
        </Link>
      ))}
    </>
  );
};

export default NavLinks;
