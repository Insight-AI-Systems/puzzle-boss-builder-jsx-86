
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import MainHeaderLogo from './MainHeaderLogo';
import MainHeaderLinks from './MainHeaderLinks';
import MainHeaderUserMenu from './MainHeaderUserMenu';
import MainHeaderMobile from './MainHeaderMobile';

const MainHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <header className="sticky top-0 z-50 w-full border-b border-cyan-500/20 backdrop-blur-sm bg-black/80">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <MainHeaderLogo />
          </div>
          
          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <MainHeaderLinks />
          </nav>
          
          <div className="hidden md:flex items-center gap-4">
            <MainHeaderUserMenu />
          </div>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden text-white" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      <MainHeaderMobile isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </header>
  );
};

export default MainHeader;
