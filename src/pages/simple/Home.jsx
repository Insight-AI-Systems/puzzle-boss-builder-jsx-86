
import React from 'react';
import { Link } from 'react-router-dom';
import { useAppMode } from '@/contexts/app-mode';
import ReactErrorBoundary from '@/components/ReactErrorBoundary';

const SimpleHome = () => {
  const { isMinimal, toggleMode } = useAppMode();

  return (
    <ReactErrorBoundary>
      <div className="min-h-screen bg-puzzle-black text-white p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-puzzle-aqua">The Puzzle Boss</h1>
            <button
              onClick={toggleMode}
              className="px-4 py-2 bg-puzzle-burgundy text-white rounded hover:bg-puzzle-burgundy/80"
            >
              Switch to {isMinimal ? 'Full' : 'Minimal'} Mode
            </button>
          </div>

          <nav className="space-x-4 mb-8">
            <Link to="/" className="text-puzzle-aqua hover:text-puzzle-gold">Home</Link>
            <Link to="/auth" className="text-puzzle-aqua hover:text-puzzle-gold">Sign In</Link>
            <Link to="/about" className="text-puzzle-aqua hover:text-puzzle-gold">About</Link>
          </nav>

          <div className="bg-black/30 p-6 rounded-lg border border-puzzle-aqua">
            <h2 className="text-2xl font-bold mb-4">Welcome to The Puzzle Boss</h2>
            <p className="mb-4">
              This is a simplified version of the home page, designed to work reliably while we restore full functionality.
            </p>
            {isMinimal && (
              <div className="bg-puzzle-burgundy/20 p-4 rounded">
                <p className="text-sm">
                  Running in minimal mode for diagnostic purposes. Use the toggle above to switch modes.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ReactErrorBoundary>
  );
};

export default SimpleHome;
