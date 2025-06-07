
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUserProfile } from '@/hooks/useUserProfile';
import { MainNavItem } from './NavbarData';
import { useAuth } from '@/contexts/AuthContext';
import { ChevronDown } from 'lucide-react';

interface NavLinksProps {
  items: MainNavItem[];
  className?: string;
  onClick?: () => void;
}

const NavLinks: React.FC<NavLinksProps> = ({ items, className = '', onClick }) => {
  const location = useLocation();
  const { profile } = useUserProfile();
  const { hasRole, isAdmin } = useAuth();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  
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

  // Enhanced handling for home link when in admin pages
  const getHomeLinkProps = (path: string) => {
    if (path === '/' && location.pathname.startsWith('/admin')) {
      console.log('NavLinks: Setting skipAdminRedirect for home navigation from admin page');
      // Clear any temporary session storage when explicitly navigating home
      sessionStorage.removeItem('temp_disable_admin_redirect');
      
      return { 
        to: '/', 
        state: { 
          skipAdminRedirect: true, 
          from: location.pathname,
          timestamp: Date.now() // Add timestamp to ensure state is fresh
        }
      };
    }
    return { to: path };
  };

  // Define dropdown items for Puzzles
  const getPuzzleDropdownItems = () => [
    { name: 'All Puzzles', path: '/puzzles' },
    { name: 'Categories', path: '/categories' },
    { name: 'Featured', path: '/puzzles?featured=true' },
    { name: 'New Arrivals', path: '/puzzles?sort=newest' }
  ];

  const handleItemMouseEnter = (itemName: string) => {
    if (itemName === 'Puzzles') {
      setHoveredItem(itemName);
    }
  };

  const handleItemMouseLeave = () => {
    setHoveredItem(null);
  };

  const handleDropdownMouseEnter = () => {
    setHoveredItem('Puzzles');
  };

  const handleDropdownMouseLeave = () => {
    setHoveredItem(null);
  };
  
  return (
    <>
      {items.map((item) => shouldShowLink(item) && (
        <div 
          key={item.path}
          className="relative"
          onMouseEnter={() => handleItemMouseEnter(item.name)}
          onMouseLeave={handleItemMouseLeave}
        >
          {item.name === 'Puzzles' ? (
            <>
              <div className={`${className} ${
                isLinkActive(item.path)
                  ? 'text-puzzle-aqua bg-puzzle-aqua/10'
                  : 'text-muted-foreground hover:text-puzzle-white hover:bg-white/10'
              } flex items-center cursor-pointer`}>
                <span>Puzzles</span>
                <ChevronDown 
                  className={`ml-1 h-4 w-4 transition-transform duration-300 ${
                    hoveredItem === 'Puzzles' ? 'rotate-180' : ''
                  }`} 
                />
              </div>
              
              {/* Dropdown Menu */}
              <div
                className={`absolute top-full left-0 w-[250px] bg-puzzle-black border border-puzzle-aqua/20 rounded-md shadow-lg z-50 transition-all duration-300 ${
                  hoveredItem === 'Puzzles' 
                    ? 'opacity-100 translate-y-0 visible' 
                    : 'opacity-0 -translate-y-2 invisible'
                }`}
                onMouseEnter={handleDropdownMouseEnter}
                onMouseLeave={handleDropdownMouseLeave}
              >
                <div className="py-2">
                  {getPuzzleDropdownItems().map((dropdownItem) => (
                    <Link
                      key={dropdownItem.path}
                      to={dropdownItem.path}
                      className="block px-4 py-2 text-sm text-muted-foreground hover:text-puzzle-white hover:bg-white/10 transition-colors"
                      onClick={onClick}
                      data-testid={`dropdown-link-${dropdownItem.name.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {dropdownItem.name}
                    </Link>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <Link
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
          )}
        </div>
      ))}
    </>
  );
};

export default NavLinks;
