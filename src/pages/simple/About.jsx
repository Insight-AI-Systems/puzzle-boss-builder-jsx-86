
import React from 'react';
import { Link } from 'react-router-dom';
import ReactErrorBoundary from '@/components/ReactErrorBoundary';

const SimpleAbout = () => {
  return (
    <ReactErrorBoundary>
      <div className="min-h-screen bg-puzzle-black text-white p-8">
        <div className="max-w-4xl mx-auto">
          <nav className="mb-8 space-x-4">
            <Link to="/" className="text-puzzle-aqua hover:text-puzzle-gold">Home</Link>
            <Link to="/about" className="text-puzzle-aqua hover:text-puzzle-gold">About</Link>
          </nav>

          <div className="bg-black/30 p-6 rounded-lg border border-puzzle-aqua">
            <h2 className="text-2xl font-bold mb-4">About The Puzzle Boss</h2>
            <p className="mb-4">
              The Puzzle Boss is a global, skill-based jigsaw puzzle platform where players compete
              to win premium brand-name prizes.
            </p>
            <p>
              This is a simplified version of the about page while we restore full functionality.
            </p>
          </div>
        </div>
      </div>
    </ReactErrorBoundary>
  );
};

export default SimpleAbout;
