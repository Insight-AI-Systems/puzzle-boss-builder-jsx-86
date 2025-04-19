
import React from 'react';
import { Link } from 'react-router-dom';
import NavLinks from './NavLinks';
import { MainNavItem } from './NavbarData';

interface MobileMenuProps {
  isOpen: boolean;
  navItems: MainNavItem[];
  isLoggedIn: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, navItems, isLoggedIn, onClose }) => {
  if (!isOpen) return null;
  
  return (
    <div className="md:hidden">
      <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-puzzle-aqua/20">
        <NavLinks
          items={navItems}
          className="block px-3 py-2 rounded-md text-base font-medium"
          onClick={onClose}
        />
        
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
