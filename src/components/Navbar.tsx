
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuth } from '@/contexts/auth';
import DesktopNavigation from './navbar/DesktopNavigation';
import MobileNavigation from './navbar/MobileNavigation';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, profile, signOut } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const getInitials = () => {
    if (profile?.username) {
      return profile.username.charAt(0).toUpperCase();
    }
    return user?.email?.charAt(0).toUpperCase() || 'U';
  };

  return (
    <nav className="sticky top-0 z-50 bg-puzzle-black/90 backdrop-blur-md border-b border-puzzle-aqua/20 py-4">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-game text-puzzle-white">
              <span className="text-puzzle-aqua">The</span> Puzzle <span className="text-puzzle-gold">Boss</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <DesktopNavigation 
            user={user} 
            profile={profile} 
            signOut={signOut} 
            getInitials={getInitials} 
          />
          
          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-puzzle-white hover:text-puzzle-aqua">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        <MobileNavigation
          isOpen={isMenuOpen}
          toggleMenu={setIsMenuOpen}
          user={user}
          profile={profile}
          signOut={signOut}
        />
      </div>
    </nav>
  );
};

export default Navbar;
