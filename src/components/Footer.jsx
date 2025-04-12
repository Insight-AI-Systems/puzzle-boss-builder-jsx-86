
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-puzzle-black border-t border-puzzle-aqua/20 pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-game text-xl mb-4 text-puzzle-white">
              <span className="text-puzzle-aqua">The</span> Puzzle <span className="text-puzzle-gold">Boss</span>
            </h3>
            <p className="text-muted-foreground mb-4">
              The premier platform for puzzle competitions with premium brand-name prizes.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-puzzle-aqua transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-puzzle-aqua transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-puzzle-aqua transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-puzzle-aqua transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-puzzle-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-muted-foreground hover:text-puzzle-aqua transition-colors">Home</Link></li>
              <li><a href="#categories" className="text-muted-foreground hover:text-puzzle-aqua transition-colors">Categories</a></li>
              <li><a href="#how-it-works" className="text-muted-foreground hover:text-puzzle-aqua transition-colors">How It Works</a></li>
              <li><a href="#prizes" className="text-muted-foreground hover:text-puzzle-aqua transition-colors">Prizes</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-puzzle-white mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><Link to="/terms" className="text-muted-foreground hover:text-puzzle-aqua transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/privacy" className="text-muted-foreground hover:text-puzzle-aqua transition-colors">Privacy Policy</Link></li>
              <li><Link to="/cookie-policy" className="text-muted-foreground hover:text-puzzle-aqua transition-colors">Cookie Policy</Link></li>
              <li><Link to="/contest-rules" className="text-muted-foreground hover:text-puzzle-aqua transition-colors">Contest Rules</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-puzzle-white mb-4">Contact</h4>
            <ul className="space-y-2">
              <li><Link to="/support" className="text-muted-foreground hover:text-puzzle-aqua transition-colors">Support</Link></li>
              <li><Link to="/partnerships" className="text-muted-foreground hover:text-puzzle-aqua transition-colors">Partnerships</Link></li>
              <li><Link to="/careers" className="text-muted-foreground hover:text-puzzle-aqua transition-colors">Careers</Link></li>
              <li><Link to="/press" className="text-muted-foreground hover:text-puzzle-aqua transition-colors">Press</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-puzzle-aqua/10 pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} The Puzzle Boss. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
