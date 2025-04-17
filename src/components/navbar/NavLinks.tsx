
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
  
  const isLinkActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };
  
  const handleClick = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    
    // Log navigation attempt
    console.log(`Navigating to: ${path}`);
    
    // Close mobile menu if applicable
    if (onClick) onClick();
    
    // Use navigate for programmatic navigation
    navigate(path);
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
          onClick={(e) => handleClick(e, item.path)}
        >
          {item.name}
        </Link>
      ))}
    </>
  );
};

export default NavLinks;
