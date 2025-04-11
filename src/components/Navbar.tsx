
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, profile, signOut } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Get initials for avatar fallback
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
          <div className="hidden md:flex space-x-8">
            <Link to="/" className="nav-link">Home</Link>
            <a href="#categories" className="nav-link">Categories</a>
            <a href="#how-it-works" className="nav-link">How It Works</a>
            <a href="#prizes" className="nav-link">Prizes</a>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="text-puzzle-aqua text-sm">
                  {profile?.credits || 0} <span className="text-muted-foreground">credits</span>
                </div>
                <Link to="/profile">
                  <Avatar className="cursor-pointer">
                    <AvatarImage src={profile?.avatar_url} alt={profile?.username || 'User'} />
                    <AvatarFallback className="bg-puzzle-aqua text-puzzle-black">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                </Link>
              </div>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="outline" className="border-puzzle-aqua text-puzzle-aqua hover:bg-puzzle-aqua/10">
                    Login
                  </Button>
                </Link>
                <Link to="/auth?tab=register">
                  <Button className="bg-puzzle-aqua text-puzzle-black hover:bg-puzzle-aqua/90">
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-puzzle-white hover:text-puzzle-aqua">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 space-y-4 flex flex-col items-center">
            <Link to="/" className="nav-link py-2" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <a href="#categories" className="nav-link py-2" onClick={() => setIsMenuOpen(false)}>Categories</a>
            <a href="#how-it-works" className="nav-link py-2" onClick={() => setIsMenuOpen(false)}>How It Works</a>
            <a href="#prizes" className="nav-link py-2" onClick={() => setIsMenuOpen(false)}>Prizes</a>
            
            {user ? (
              <div className="flex flex-col space-y-3 w-full pt-4">
                <div className="text-puzzle-aqua text-center">
                  {profile?.credits || 0} <span className="text-muted-foreground">credits</span>
                </div>
                <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full border-puzzle-aqua text-puzzle-aqua hover:bg-puzzle-aqua/10">
                    Profile
                  </Button>
                </Link>
                <Button 
                  onClick={() => {
                    signOut();
                    setIsMenuOpen(false);
                  }} 
                  className="w-full bg-puzzle-burgundy text-puzzle-white hover:bg-puzzle-burgundy/90"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex flex-col space-y-3 w-full pt-4">
                <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full border-puzzle-aqua text-puzzle-aqua hover:bg-puzzle-aqua/10">
                    Login
                  </Button>
                </Link>
                <Link to="/auth?tab=register" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full bg-puzzle-aqua text-puzzle-black hover:bg-puzzle-aqua/90">
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
