
import React, { useEffect, useState } from 'react';
import { Menu, X, LayoutDashboard, TicketIcon } from 'lucide-react';
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
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { user, hasRole } = useAuth();
  const isMobile = useIsMobile();
  const { isMenuOpen, toggleMenu, closeMenu } = useMobileMenu();
  
  // Handle potential errors from useUserProfile
  let profileData = { profile: null, isLoading: true };
  try {
    profileData = useUserProfile();
  } catch (error) {
    console.error('Error using useUserProfile in Navbar:', error);
  }
  
  useEffect(() => {
    if (!profileData.isLoading) {
      setUserProfile(profileData.profile);
      setLoading(false);
    }
  }, [profileData.isLoading, profileData.profile]);
  
  // Enhanced admin check
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
            {!loading && userProfile && isAdminUser && (
              <>
                <Link 
                  to="/admin-dashboard"
                  className="flex items-center px-3 py-2 text-sm font-medium text-puzzle-aqua hover:bg-white/10 rounded-md transition-colors"
                >
                  <LayoutDashboard className="h-5 w-5 mr-2" />
                  Admin
                </Link>
                <Link 
                  to="/support-admin"
                  className="flex items-center px-3 py-2 text-sm font-medium text-puzzle-aqua hover:bg-white/10 rounded-md transition-colors"
                >
                  <TicketIcon className="h-5 w-5 mr-2" />
                  Support
                </Link>
              </>
            )}
            {!loading && userProfile ? (
              <UserMenu profile={userProfile} />
            ) : (
              <AuthButtons />
            )}
          </div>
          
          {/* Mobile Navigation Toggle */}
          <div className="md:hidden flex items-center">
            {!loading && userProfile ? (
              <>
                {isAdminUser && (
                  <>
                    <Link 
                      to="/admin-dashboard"
                      className="flex items-center px-3 py-2 mr-2 text-sm font-medium text-puzzle-aqua hover:bg-white/10 rounded-md transition-colors"
                    >
                      <LayoutDashboard className="h-5 w-5" />
                    </Link>
                    <Link 
                      to="/support-admin"
                      className="flex items-center px-3 py-2 mr-2 text-sm font-medium text-puzzle-aqua hover:bg-white/10 rounded-md transition-colors"
                    >
                      <TicketIcon className="h-5 w-5" />
                    </Link>
                  </>
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
