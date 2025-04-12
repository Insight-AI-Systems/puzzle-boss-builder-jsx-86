
import React from 'react';
import { Link } from 'react-router-dom';
import { Home, FileText, InfoIcon, MessageSquare, Briefcase, Users, Newspaper } from 'lucide-react';
import MainHeaderLinks from './MainHeaderLinks';
import MainHeaderUserMenu from './MainHeaderUserMenu';
import ThemeToggle from './ThemeToggle';

const MainHeaderMobile = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleLinkClick = () => {
    // Close the mobile menu when a link is clicked
    if (onClose) onClose();
  };

  return (
    <div className="md:hidden fixed inset-0 z-50 bg-black/95 backdrop-blur-md border-b border-cyan-500/20 animate-in fade-in slide-in-from-top duration-300">
      <div className="container mx-auto px-4 py-6 h-full overflow-y-auto">
        <div className="flex flex-col gap-6 h-full">
          <div className="flex justify-end">
            <ThemeToggle />
          </div>
          
          <nav className="flex flex-col gap-2">
            <MainHeaderLinks isMobile={true} onItemClick={onClose} />
          </nav>
          
          <div className="border-t border-cyan-500/20 pt-4">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">Content</h3>
            <nav className="flex flex-col gap-4">
              <Link to="/" className="flex items-center gap-2 text-white hover:text-cyan-400 transition-colors" onClick={handleLinkClick}>
                <Home size={18} />
                <span>Home</span>
              </Link>
              
              <Link to="/terms" className="flex items-center gap-2 text-white hover:text-cyan-400 transition-colors" onClick={handleLinkClick}>
                <FileText size={18} />
                <span>Terms</span>
              </Link>
              
              <Link to="/privacy" className="flex items-center gap-2 text-white hover:text-cyan-400 transition-colors" onClick={handleLinkClick}>
                <InfoIcon size={18} />
                <span>Privacy</span>
              </Link>
              
              <Link to="/cookie-policy" className="flex items-center gap-2 text-white hover:text-cyan-400 transition-colors" onClick={handleLinkClick}>
                <FileText size={18} />
                <span>Cookie Policy</span>
              </Link>
              
              <Link to="/contest-rules" className="flex items-center gap-2 text-white hover:text-cyan-400 transition-colors" onClick={handleLinkClick}>
                <FileText size={18} />
                <span>Contest Rules</span>
              </Link>
              
              <Link to="/support" className="flex items-center gap-2 text-white hover:text-cyan-400 transition-colors" onClick={handleLinkClick}>
                <MessageSquare size={18} />
                <span>Support</span>
              </Link>
              
              <Link to="/partnerships" className="flex items-center gap-2 text-white hover:text-cyan-400 transition-colors" onClick={handleLinkClick}>
                <Users size={18} />
                <span>Partnerships</span>
              </Link>
              
              <Link to="/careers" className="flex items-center gap-2 text-white hover:text-cyan-400 transition-colors" onClick={handleLinkClick}>
                <Briefcase size={18} />
                <span>Careers</span>
              </Link>
              
              <Link to="/press" className="flex items-center gap-2 text-white hover:text-cyan-400 transition-colors" onClick={handleLinkClick}>
                <Newspaper size={18} />
                <span>Press</span>
              </Link>
            </nav>
          </div>
          
          <div className="mt-auto border-t border-cyan-500/20 pt-4">
            <MainHeaderUserMenu isMobile={true} onItemClick={onClose} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainHeaderMobile;
