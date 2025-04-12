
import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from './ui/button';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  
  return (
    <header className="sticky top-0 z-50 w-full border-b border-puzzle-aqua/20 backdrop-blur-sm bg-puzzle-black/80">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="font-game text-2xl">
                <span className="text-puzzle-aqua">The</span> Puzzle <span className="text-puzzle-gold">Boss</span>
              </span>
            </Link>
          </div>
          
          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="nav-link">Home</Link>
            <a href="#prizes" className="nav-link">Competitions</a>
            <a href="#how-it-works" className="nav-link">How It Works</a>
            <a href="#categories" className="nav-link">Categories</a>
          </nav>
          
          <div className="hidden md:flex items-center gap-4">
            <Link to="/auth">
              <Button variant="outline" className="border-puzzle-aqua text-puzzle-aqua hover:bg-puzzle-aqua/10">
                Log In
              </Button>
            </Link>
            <Link to="/auth?tab=register">
              <Button className="bg-puzzle-gold text-puzzle-black hover:bg-puzzle-gold/90">
                Sign Up
              </Button>
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden text-puzzle-white" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-puzzle-black border-b border-puzzle-aqua/20">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col gap-4">
              <Link to="/" className="nav-link py-2" onClick={() => setIsMenuOpen(false)}>Home</Link>
              <a href="#prizes" className="nav-link py-2" onClick={() => setIsMenuOpen(false)}>Competitions</a>
              <a href="#how-it-works" className="nav-link py-2" onClick={() => setIsMenuOpen(false)}>How It Works</a>
              <a href="#categories" className="nav-link py-2" onClick={() => setIsMenuOpen(false)}>Categories</a>
              
              <div className="flex flex-col gap-2 mt-4">
                <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full border-puzzle-aqua text-puzzle-aqua hover:bg-puzzle-aqua/10">
                    Log In
                  </Button>
                </Link>
                <Link to="/auth?tab=register" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full bg-puzzle-gold text-puzzle-black hover:bg-puzzle-gold/90">
                    Sign Up
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
