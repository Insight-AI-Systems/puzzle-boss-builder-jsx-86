
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center max-w-md mx-auto">
        <h1 className="text-6xl font-bold mb-4 text-puzzle-aqua">404</h1>
        <h2 className="text-2xl font-semibold mb-4 text-puzzle-white">Page Not Found</h2>
        <p className="text-puzzle-white/70 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link 
          to="/"
          className="px-6 py-3 bg-puzzle-aqua text-puzzle-black rounded-lg hover:bg-puzzle-aqua/80 transition-colors font-semibold"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
