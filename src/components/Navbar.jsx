
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from './ui/button';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <header className="sticky top-0 z-50 w-full border-b border-cyan-500/20 backdrop-blur-sm bg-black/80">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold">
                <span className="text-cyan-400">The</span> Puzzle <span className="text-yellow-400">Boss</span>
              </span>
            </Link>
          </div>
          
          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-white hover:text-cyan-400 transition-colors">Home</Link>
            <a href="#prizes" className="text-white hover:text-cyan-400 transition-colors">Competitions</a>
            <a href="#how-it-works" className="text-white hover:text-cyan-400 transition-colors">How It Works</a>
            <a href="#categories" className="text-white hover:text-cyan-400 transition-colors">Categories</a>
          </nav>
          
          <div className="hidden md:flex items-center gap-4">
            <Link to="/auth">
              <Button variant="outline" className="border-cyan-400 text-cyan-400 hover:bg-cyan-400/10">
                Log In
              </Button>
            </Link>
            <Link to="/auth?tab=register">
              <Button className="bg-yellow-400 text-black hover:bg-yellow-400/90">
                Sign Up
              </Button>
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden text-white" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-black border-b border-cyan-500/20">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col gap-4">
              <Link to="/" className="text-white hover:text-cyan-400 transition-colors py-2" onClick={() => setIsMenuOpen(false)}>Home</Link>
              <a href="#prizes" className="text-white hover:text-cyan-400 transition-colors py-2" onClick={() => setIsMenuOpen(false)}>Competitions</a>
              <a href="#how-it-works" className="text-white hover:text-cyan-400 transition-colors py-2" onClick={() => setIsMenuOpen(false)}>How It Works</a>
              <a href="#categories" className="text-white hover:text-cyan-400 transition-colors py-2" onClick={() => setIsMenuOpen(false)}>Categories</a>
              
              <div className="flex flex-col gap-2 mt-4">
                <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full border-cyan-400 text-cyan-400 hover:bg-cyan-400/10">
                    Log In
                  </Button>
                </Link>
                <Link to="/auth?tab=register" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full bg-yellow-400 text-black hover:bg-yellow-400/90">
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
