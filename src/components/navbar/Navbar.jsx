
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import NavbarLogo from './NavbarLogo';
import NavbarLinks from './NavbarLinks';
import NavbarUserMenu from './NavbarUserMenu';
import NavbarMobile from './NavbarMobile';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-puzzle-black/90 backdrop-blur-md border-b border-puzzle-aqua/20 py-4">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <NavbarLogo />
          </div>
          
          <div className="hidden md:flex space-x-8">
            <NavbarLinks />
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <NavbarUserMenu />
          </div>
          
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-puzzle-white hover:text-puzzle-aqua">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        <NavbarMobile isOpen={isMenuOpen} onClose={closeMenu} />
      </div>
    </nav>
  );
};

export default Navbar;
