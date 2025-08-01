
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ClerkAuthButtons } from '@/components/auth/ClerkAuthButtons';
import UserMenu from './UserMenu';
import { useClerkAuth } from '@/hooks/useClerkAuth';
import { mainNavItems } from './NavbarData';
// PuzzleDropdown removed - CodeCanyon system will be added
import MobileMenu from './MobileMenu';
import { AdminErrorBoundary } from '@/components/admin/ErrorBoundary';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  
  const { isAuthenticated, user, profile } = useClerkAuth();

  const isActive = (path: string) => location.pathname === path;

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
              {mainNavItems.filter(item => item.name !== 'Puzzles').map((item) => (
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

            {/* Auth Buttons and Profile */}
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  {/* Profile Icon for logged-in users */}
                  <Link
                    to="/account"
                    className={`px-3 py-2 text-sm font-medium transition-colors flex items-center space-x-2 ${
                      isActive('/account')
                        ? 'text-puzzle-aqua border-b-2 border-puzzle-aqua'
                        : 'text-puzzle-white hover:text-puzzle-aqua'
                    }`}
                    title="Member Profile"
                  >
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                  <UserMenu profile={profile} />
                </>
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
            navItems={mainNavItems} 
            isLoggedIn={isAuthenticated} 
            onClose={() => setIsOpen(false)} 
          />
        </div>
      </nav>
    </AdminErrorBoundary>
  );
};

export default Navbar;
