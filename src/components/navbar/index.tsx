
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ClerkAuthButtons } from '@/components/auth/ClerkAuthButtons';
import { useUser } from '@clerk/clerk-react';
import { useClerkAuth } from '@/hooks/useClerkAuth';
import { mainNavItems, adminNavItems } from './NavbarData';
import PuzzleDropdown from './PuzzleDropdown';
import MobileMenu from './MobileMenu';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { isSignedIn, user } = useUser();
  const { hasRole, isAdmin } = useClerkAuth();

  const isActive = (path: string) => location.pathname === path;

  // Enhanced admin detection for navbar
  const userEmail = user?.primaryEmailAddress?.emailAddress;
  const isAdminEmail = userEmail === 'alan@insight-ai-systems.com' || 
                     userEmail === 'alantbooth@xtra.co.nz' ||
                     userEmail === 'rob.small.1234@gmail.com';
  
  const showAdminItems = isAdmin || isAdminEmail;

  // Debug logging for navbar admin detection
  React.useEffect(() => {
    if (isSignedIn) {
      console.log('🧭 Navbar Admin Check:', {
        userEmail,
        isAdminEmail,
        isAdmin,
        showAdminItems,
        timestamp: new Date().toISOString()
      });
    }
  }, [userEmail, isAdminEmail, isAdmin, showAdminItems, isSignedIn]);

  // Filter admin nav items based on user role - show all admin items if user is admin
  const accessibleAdminItems = showAdminItems ? adminNavItems : adminNavItems.filter(item => 
    !item.roles || item.roles.some(role => hasRole(role))
  );

  return (
    <nav className="bg-puzzle-black/95 backdrop-blur-sm border-b border-puzzle-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-puzzle-aqua rounded-lg flex items-center justify-center">
                <span className="text-puzzle-black font-bold text-lg">P</span>
              </div>
              <span className="text-puzzle-white font-bold text-xl">PuzzleBoss</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {mainNavItems.map((item) => (
              item.name === 'Puzzles' ? (
                <PuzzleDropdown key={item.name} />
              ) : (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`px-3 py-2 text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'text-puzzle-aqua border-b-2 border-puzzle-aqua'
                      : 'text-puzzle-white hover:text-puzzle-aqua'
                  }`}
                >
                  {item.name}
                </Link>
              )
            ))}
            
            {/* Admin links if user has admin role */}
            {accessibleAdminItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'text-puzzle-aqua border-b-2 border-puzzle-aqua'
                    : 'text-puzzle-white hover:text-puzzle-aqua'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <ClerkAuthButtons />
            {/* Show account link if authenticated */}
            {isSignedIn && (
              <Link
                to="/account"
                className="text-puzzle-white hover:text-puzzle-aqua transition-colors"
              >
                <User className="h-5 w-5" />
              </Link>
            )}
            {/* Show admin link if user has admin role */}
            {showAdminItems && (
              <Link
                to="/admin-dashboard"
                className="text-puzzle-white hover:text-puzzle-aqua transition-colors"
                title="Admin Dashboard"
              >
                <Shield className="h-5 w-5" />
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="text-puzzle-white hover:text-puzzle-aqua"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <MobileMenu 
          isOpen={isOpen} 
          navItems={[...mainNavItems, ...accessibleAdminItems]} 
          isLoggedIn={isSignedIn} 
          onClose={() => setIsOpen(false)} 
        />
      </div>
    </nav>
  );
};

export default Navbar;
