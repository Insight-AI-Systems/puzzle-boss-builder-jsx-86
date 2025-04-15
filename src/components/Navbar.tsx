
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from './ui/button';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="sticky top-0 z-50 bg-puzzle-black/90 backdrop-blur-md border-b border-puzzle-aqua/20 py-4">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <a href="#" className="text-2xl font-game text-puzzle-white">
              <span className="text-puzzle-aqua">The</span> Puzzle <span className="text-puzzle-gold">Boss</span>
            </a>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <a href="#" className="nav-link">Home</a>
            <a href="#categories" className="nav-link">Categories</a>
            <a href="#how-it-works" className="nav-link">How It Works</a>
            <a href="#prizes" className="nav-link">Prizes</a>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="outline" className="border-puzzle-aqua text-puzzle-aqua hover:bg-puzzle-aqua/10">
              Login
            </Button>
            <Button className="bg-puzzle-aqua text-puzzle-black hover:bg-puzzle-aqua/90">
              Register
            </Button>
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
            <a href="#" className="nav-link py-2">Home</a>
            <a href="#categories" className="nav-link py-2">Categories</a>
            <a href="#how-it-works" className="nav-link py-2">How It Works</a>
            <a href="#prizes" className="nav-link py-2">Prizes</a>
            <div className="flex flex-col space-y-3 w-full pt-4">
              <Button variant="outline" className="w-full border-puzzle-aqua text-puzzle-aqua hover:bg-puzzle-aqua/10">
                Login
              </Button>
              <Button className="w-full bg-puzzle-aqua text-puzzle-black hover:bg-puzzle-aqua/90">
                Register
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
