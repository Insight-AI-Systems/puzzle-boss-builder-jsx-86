
import React, { useEffect, useState } from 'react';
import { Menu, X, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

const Navbar: React.FC = () => {
  const [userProfile, setUserProfile] = useState<any>(null);
  const { user, hasRole, isAuthenticated, isLoading, userRole, isAdmin } = useAuth();
  const isMobile = useIsMobile();
  const { isMenuOpen, toggleMenu, closeMenu } = useMobileMenu();
  
  useEffect(() => {
    console.log('Navbar - Auth state changed:', { 
      isAuthenticated, 
      user: !!user, 
      userEmail: user?.email,
      userRole,
      isAdmin,
      isLoading 
    });
    
    if (isAuthenticated && user) {
      // Create a simple profile object from auth user
      setUserProfile({
        id: user.id,
        email: user.email,
        display_name: user.email?.split('@')[0] || 'User',
        avatar_url: null,
        role: userRole || 'player'
      });
    } else {
      setUserProfile(null);
    }
  }, [isAuthenticated, user, isLoading, userRole, isAdmin]);
  
  // Use the isAdmin from AuthContext which is based on database role
  const isAdminUser = isAdmin;
  
  console.log('Navbar render state:', {
    isLoading,
    isAuthenticated,
    hasUser: !!user,
    hasProfile: !!userProfile,
    isAdminUser,
    userRole
  });

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
            {!isLoading && userProfile && isAdminUser && (
              <Link 
                to="/admin-dashboard"
                className="flex items-center px-3 py-2 text-sm font-medium text-puzzle-aqua hover:bg-white/10 rounded-md transition-colors"
              >
                <LayoutDashboard className="h-5 w-5 mr-2" />
                Admin
              </Link>
            )}
            {!isLoading && userProfile ? (
              <UserMenu profile={userProfile} />
            ) : (
              <AuthButtons />
            )}
          </div>
          
          {/* Mobile Navigation Toggle */}
          <div className="md:hidden flex items-center">
            {!isLoading && userProfile ? (
              <>
                {isAdminUser && (
                  <Link 
                    to="/admin-dashboard"
                    className="flex items-center px-3 py-2 mr-2 text-sm font-medium text-puzzle-aqua hover:bg-white/10 rounded-md transition-colors"
                  >
                    <LayoutDashboard className="h-5 w-5" />
                  </Link>
                )}
                <UserMenu profile={userProfile} isMobile={true} />
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
        isLoggedIn={!!userProfile} 
        onClose={closeMenu} 
      />
    </nav>
  );
};

export default Navbar;
