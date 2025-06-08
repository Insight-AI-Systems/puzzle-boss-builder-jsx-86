
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, Settings, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ClerkAuthButtons } from '@/components/auth/ClerkAuthButtons';
import { useUser } from '@clerk/clerk-react';
import { useClerkAuth } from '@/hooks/useClerkAuth';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { isSignedIn, user } = useUser();
  const { hasRole } = useClerkAuth();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/categories', label: 'Categories' },
    { href: '/puzzles/word-search', label: 'Word Search' },
    { href: '/support', label: 'Support' },
  ];

  const isActive = (path: string) => location.pathname === path;

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
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? 'text-puzzle-aqua border-b-2 border-puzzle-aqua'
                    : 'text-puzzle-white hover:text-puzzle-aqua'
                }`}
              >
                {link.label}
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
            {hasRole('admin') && (
              <Link
                to="/admin"
                className="text-puzzle-white hover:text-puzzle-aqua transition-colors"
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
        {isOpen && (
          <div className="md:hidden border-t border-puzzle-border">
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`block px-3 py-2 text-base font-medium transition-colors ${
                    isActive(link.href)
                      ? 'text-puzzle-aqua bg-puzzle-gray/20'
                      : 'text-puzzle-white hover:text-puzzle-aqua hover:bg-puzzle-gray/10'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-puzzle-border">
                <ClerkAuthButtons isMobile={true} />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
