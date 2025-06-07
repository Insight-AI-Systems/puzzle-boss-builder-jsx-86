
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Logo: React.FC = () => {
  const location = useLocation();
  
  // Check if we're currently on an admin page
  const isOnAdminPage = location.pathname.startsWith('/admin');
  
  return (
    <Link 
      to="/" 
      className="flex items-center space-x-2"
      state={isOnAdminPage ? { skipAdminRedirect: true } : undefined}
    >
      <div className="w-8 h-8 bg-puzzle-aqua rounded-md flex items-center justify-center">
        <span className="text-puzzle-black font-bold text-sm">PB</span>
      </div>
      <span className="text-puzzle-white font-game text-xl">
        Puzzle<span className="text-puzzle-aqua">Boss</span>
      </span>
    </Link>
  );
};

export default Logo;
