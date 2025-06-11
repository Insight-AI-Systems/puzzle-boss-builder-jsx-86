
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ClerkAuthButtons } from '@/components/auth/ClerkAuthButtons';
import UserMenu from './UserMenu';
import { useUser } from '@clerk/clerk-react';
import { useClerkAuth } from '@/hooks/useClerkAuth';
import { useUserProfile } from '@/hooks/useUserProfile';
import { mainNavItems, adminNavItems } from './NavbarData';
import PuzzleDropdown from './PuzzleDropdown';
import MobileMenu from './MobileMenu';
import { AdminErrorBoundary } from '@/components/admin/ErrorBoundary';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { isSignedIn, user } = useUser();
  const { hasRole, isAdmin, isLoading } = useClerkAuth();
  const { profile } = useUserProfile();

  const isActive = (path: string) => location.pathname === path;

  // Show admin items if user is admin (with loading check)
  const showAdminItems = !isLoading && isAdmin;

  // Enhanced debug admin detection
  React.useEffect(() => {
    if (isSignedIn && !isLoading) {
      console.log('🧭 Navbar Admin Detection (Enhanced):', {
        userEmail: user?.primaryEmailAddress?.emailAddress,
        isAdmin,
        showAdminItems,
        isLoading,
        hasRoleSuperAdmin: hasRole('super_admin'),
        hasRoleAdmin: hasRole('admin'),
        adminNavItemsLength: showAdminItems ? adminNavItems.length : 0
      });
    }
  }, [isSignedIn, isAdmin, showAdminItems, isLoading, user, hasRole]);

  // Force re-render when admin status changes
  const [, forceUpdate] = React.useReducer(x => x + 1, 0);
  React.useEffect(() => {
    if (!isLoading) {
      forceUpdate();
    }
  }, [isAdmin, isLoading]);

  // Filter admin nav items
  const accessibleAdminItems = showAdminItems ? adminNavItems : [];

  console.log('🧭 Navbar Render:', {
    showAdminItems,
    accessibleAdminItemsCount: accessibleAdminItems.length,
    isAdmin,
    isLoading
  });

  return (
    <AdminErrorBoundary>
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
              
              {/* Admin links - single consolidated dashboard */}
              {showAdminItems && accessibleAdminItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`px-3 py-2 text-sm font-medium transition-colors bg-puzzle-aqua/10 rounded ${
                    isActive(item.href)
                      ? 'text-puzzle-aqua border-b-2 border-puzzle-aqua'
                      : 'text-puzzle-aqua hover:text-puzzle-aqua/80'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              {isSignedIn ? (
                <UserMenu profile={profile} />
              ) : (
                <ClerkAuthButtons />
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
    </AdminErrorBoundary>
  );
};

export default Navbar;
