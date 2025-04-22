
import React from 'react';
import { Menu, X, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useIsMobile } from '@/hooks/use-mobile';
import { useMobileMenu } from '@/hooks/use-mobile-menu';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Logo from './Logo';
import NavLinks from './NavLinks';
import UserMenu from './UserMenu';
import AuthButtons from './AuthButtons';
import MobileMenu from './MobileMenu';
import { mainNavItems } from './NavbarData';

// Special admin email that should always have access
const PROTECTED_ADMIN_EMAIL = 'alan@insight-ai-systems.com';

const Navbar: React.FC = () => {
  const { profile, isLoading } = useUserProfile();
  const { user, hasRole } = useAuth();
  const isMobile = useIsMobile();
  const { isMenuOpen, toggleMenu, closeMenu } = useMobileMenu();
  
  // Simplified admin check
  const isProtectedAdmin = user?.email === PROTECTED_ADMIN_EMAIL;
  const isAdminUser = isProtectedAdmin || hasRole('admin') || hasRole('super_admin');
  
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
            {!isLoading && profile && isAdminUser && (
              <Link 
                to="/admin-dashboard"
                className="flex items-center px-3 py-2 text-sm font-medium text-puzzle-aqua hover:bg-white/10 rounded-md transition-colors"
              >
                <LayoutDashboard className="h-5 w-5 mr-2" />
                Admin
              </Link>
            )}
            {!isLoading && profile ? (
              <UserMenu profile={profile} />
            ) : (
              <AuthButtons />
            )}
          </div>
          
          {/* Mobile Navigation Toggle */}
          <div className="md:hidden flex items-center">
            {!isLoading && profile ? (
              <>
                {isAdminUser && (
                  <Link 
                    to="/admin-dashboard"
                    className="flex items-center px-3 py-2 mr-2 text-sm font-medium text-puzzle-aqua hover:bg-white/10 rounded-md transition-colors"
                  >
                    <LayoutDashboard className="h-5 w-5" />
                  </Link>
                )}
                <UserMenu profile={profile} isMobile={true} />
              </>
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
