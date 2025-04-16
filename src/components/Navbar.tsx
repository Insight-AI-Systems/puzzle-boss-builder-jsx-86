
import React, { useState } from 'react';
import { Menu, X, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { useUserProfile } from '@/hooks/useUserProfile';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './ui/use-toast';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUserId } = useUserProfile();
  const navigate = useNavigate();
  const { toast } = useToast();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: 'Signed out successfully',
        description: 'Come back soon!',
      });
      
      navigate('/');
    } catch (error) {
      toast({
        title: 'Error signing out',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-puzzle-black/90 backdrop-blur-md border-b border-puzzle-aqua/20 py-4">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-2xl font-game text-puzzle-white">
              <span className="text-puzzle-aqua">The</span> Puzzle <span className="text-puzzle-gold">Boss</span>
            </Link>
            <Link to="/progress" className="hidden md:block nav-link">
              Progress
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
            {currentUserId ? (
              <>
                <Link to="/profile">
                  <Button variant="outline" className="border-puzzle-aqua text-puzzle-aqua hover:bg-puzzle-aqua/10">
                    Profile
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  className="text-puzzle-white hover:text-puzzle-gold hover:bg-transparent"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="outline" className="border-puzzle-aqua text-puzzle-aqua hover:bg-puzzle-aqua/10">
                    Login
                  </Button>
                </Link>
                <Link to="/auth?tab=signup">
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
            <Link to="/" className="nav-link py-2">Home</Link>
            <Link to="/progress" className="nav-link py-2">Progress</Link>
            <a href="#categories" className="nav-link py-2">Categories</a>
            <a href="#how-it-works" className="nav-link py-2">How It Works</a>
            <a href="#prizes" className="nav-link py-2">Prizes</a>
            {currentUserId ? (
              <>
                <Link to="/profile" className="w-full">
                  <Button variant="outline" className="w-full border-puzzle-aqua text-puzzle-aqua hover:bg-puzzle-aqua/10">
                    Profile
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  className="w-full text-puzzle-white hover:text-puzzle-gold hover:bg-transparent"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <div className="flex flex-col space-y-3 w-full pt-4">
                <Link to="/auth" className="w-full">
                  <Button variant="outline" className="w-full border-puzzle-aqua text-puzzle-aqua hover:bg-puzzle-aqua/10">
                    Login
                  </Button>
                </Link>
                <Link to="/auth?tab=signup" className="w-full">
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
