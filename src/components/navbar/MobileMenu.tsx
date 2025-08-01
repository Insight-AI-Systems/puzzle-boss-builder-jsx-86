import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Search, Grid3X3, Brain, Zap, Square, BookOpen, Puzzle, User } from 'lucide-react';
import { MainNavItem, gameItems } from './NavbarData';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useAuth } from '@/contexts/AuthContext';
import GamesDropdown from './GamesDropdown';

interface MobileMenuProps {
  isOpen: boolean;
  navItems: MainNavItem[];
  isLoggedIn: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, navItems, isLoggedIn, onClose }) => {
  const { profile } = useUserProfile();
  const { hasRole, isAdmin } = useAuth();

  if (!isOpen) return null;

  const shouldShowLink = (item: MainNavItem) => {
    if (!item.roles) return true;
    if (!profile) return false;
    
    return isAdmin || item.roles.some(role => hasRole(role));
  };
  
  return (
    <div className="md:hidden">
      <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-puzzle-aqua/20">
        {/* Profile Link for logged-in users */}
        {isLoggedIn && (
          <Link
            to="/account"
            className="flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-puzzle-white hover:bg-white/10"
            onClick={onClose}
          >
            <User className="h-4 w-4" />
            <span>Profile</span>
          </Link>
        )}

        {/* Main Navigation Items */}
        {navItems.map((item) => shouldShowLink(item) && (
          <Link
            key={item.href}
            to={item.href}
            className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-puzzle-white hover:bg-white/10"
            onClick={onClose}
          >
            {item.name}
          </Link>
        ))}

        {/* Games Dropdown */}
        <GamesDropdown isMobile={true} onItemClick={onClose} />
        
        {/* Sign up button for non-logged in users */}
        {!isLoggedIn && (
          <Link
            to="/auth?signup=true"
            className="block px-3 py-2 rounded-md text-base font-medium text-puzzle-white bg-puzzle-aqua hover:bg-puzzle-aqua/80 text-center mt-4"
            onClick={onClose}
          >
            Sign Up
          </Link>
        )}
      </div>
    </div>
  );
};

export default MobileMenu;