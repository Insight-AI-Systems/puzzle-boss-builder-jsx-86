
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-puzzle-aqua mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-puzzle-white mb-4">Page Not Found</h2>
        <p className="text-puzzle-white/70 mb-8">
          The page you're looking for doesn't exist.
        </p>
        <Link 
          to="/"
          className="px-6 py-3 bg-puzzle-aqua text-puzzle-black rounded-lg hover:bg-puzzle-aqua/80 transition-colors font-semibold"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
