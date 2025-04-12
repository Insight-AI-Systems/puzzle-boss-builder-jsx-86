
import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import MainHeaderLogo from './MainHeaderLogo';
import MainHeaderLinks from './MainHeaderLinks';
import MainHeaderUserMenu from './MainHeaderUserMenu';
import MainHeaderMobile from './MainHeaderMobile';
import ThemeToggle from './ThemeToggle';

const MainHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const isMobile = useIsMobile();
  
  // Animation effect on initial load
  useEffect(() => {
    setIsVisible(true);
  }, []);
  
  // Handle header visibility based on scroll direction
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        // Scrolling down, hide the header
        setIsVisible(false);
      } else {
        // Scrolling up or at the top, show the header
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);
  
  return (
    <header 
      className={`sticky top-0 z-50 w-full border-b border-cyan-500/20 backdrop-blur-sm bg-black/80 dark:bg-black/90 transition-all duration-300 ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      }`}
    >
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
            <ThemeToggle />
            <MainHeaderUserMenu />
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button 
              className="text-white hover:text-cyan-400 transition-colors" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <MainHeaderMobile isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </header>
  );
};

export default MainHeader;
