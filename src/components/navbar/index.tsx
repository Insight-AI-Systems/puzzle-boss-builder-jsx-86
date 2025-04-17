
import React from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useIsMobile } from '@/hooks/use-mobile';
import { useMobileMenu } from '@/hooks/use-mobile-menu';
import Logo from './Logo';
import NavLinks from './NavLinks';
import UserMenu from './UserMenu';
import AuthButtons from './AuthButtons';
import MobileMenu from './MobileMenu';
import { mainNavItems } from './NavbarData';

const Navbar: React.FC = () => {
  const { profile, isLoading } = useUserProfile();
  const isMobile = useIsMobile();
  const { isMenuOpen, toggleMenu, closeMenu } = useMobileMenu();
  
  return (
    <nav className="bg-puzzle-black border-b border-puzzle-aqua/20">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Logo />
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-1">
            <NavLinks 
              items={mainNavItems} 
              className="px-3 py-2 rounded-md text-sm font-medium transition-colors"
            />
          </div>
          
          {/* User Menu / Auth Buttons */}
          <div className="hidden md:flex items-center space-x-2">
            {!isLoading && profile ? (
              <UserMenu profile={profile} />
            ) : (
              <AuthButtons />
            )}
          </div>
          
          {/* Mobile Navigation Toggle */}
          <div className="md:hidden flex">
            {!isLoading && profile ? (
              <UserMenu profile={profile} isMobile={true} />
            ) : (
              <AuthButtons isMobile={true} />
            )}
            <Button
              variant="ghost"
              className="border border-puzzle-aqua/20"
              onClick={toggleMenu}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={isMenuOpen} 
        navItems={mainNavItems} 
        isLoggedIn={!!profile} 
        onClose={closeMenu} 
      />
    </nav>
  );
};

export default Navbar;
