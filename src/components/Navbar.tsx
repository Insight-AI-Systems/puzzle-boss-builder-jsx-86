
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, ChevronDown, User, LogIn } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUserProfile } from '@/hooks/useUserProfile';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { profile, isLoading } = useUserProfile();
  
  const mainNavItems = [
    { name: 'Home', path: '/' },
    { name: 'Puzzles', path: '/puzzles' },
    { name: 'Prizes', path: '/prizes' },
    { name: 'How It Works', path: '/how-it-works' },
    { name: 'About', path: '/about' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Contact', path: '/contact' },
  ];
  
  const isLinkActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  return (
    <nav className="bg-puzzle-black border-b border-puzzle-aqua/20">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="font-game text-2xl">
              <span className="text-puzzle-aqua">The</span>{' '}
              <span className="text-puzzle-white">Puzzle</span>{' '}
              <span className="text-puzzle-gold">Boss</span>
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-1">
            {mainNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isLinkActive(item.path)
                    ? 'text-puzzle-aqua bg-puzzle-aqua/10'
                    : 'text-muted-foreground hover:text-puzzle-white hover:bg-white/10'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
          
          {/* User Menu / Auth Buttons */}
          <div className="hidden md:flex items-center space-x-2">
            {!isLoading && profile ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={profile.avatar_url || ''} alt={profile.display_name || 'User'} />
                      <AvatarFallback className="bg-puzzle-aqua/20">
                        {profile.display_name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-puzzle-black border-puzzle-aqua/20">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/account">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/membership">Membership</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" className="text-muted-foreground hover:text-puzzle-white" asChild>
                  <Link to="/auth">Sign In</Link>
                </Button>
                <Button className="bg-puzzle-aqua hover:bg-puzzle-aqua/80" asChild>
                  <Link to="/auth?signup=true">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
          
          {/* Mobile Navigation Toggle */}
          <div className="md:hidden flex">
            {!isLoading && profile ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full mr-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={profile.avatar_url || ''} alt={profile.display_name || 'User'} />
                      <AvatarFallback className="bg-puzzle-aqua/20">
                        {profile.display_name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-puzzle-black border-puzzle-aqua/20">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/account">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/membership">Membership</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" className="mr-2 text-muted-foreground" asChild>
                <Link to="/auth">
                  <LogIn className="h-5 w-5" />
                </Link>
              </Button>
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
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-puzzle-aqua/20">
            {mainNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isLinkActive(item.path)
                    ? 'text-puzzle-aqua bg-puzzle-aqua/10'
                    : 'text-muted-foreground hover:text-puzzle-white hover:bg-white/5'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            {!isLoading && !profile && (
              <Link
                to="/auth?signup=true"
                className="block px-3 py-2 rounded-md text-base font-medium text-puzzle-white bg-puzzle-aqua hover:bg-puzzle-aqua/80 text-center mt-4"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign Up
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
