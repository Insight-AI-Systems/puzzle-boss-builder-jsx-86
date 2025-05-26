
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/auth';

const HomePage = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-4xl mx-auto">
        <h1 className="text-6xl font-bold mb-6">
          <span className="text-puzzle-aqua">The</span>{' '}
          <span className="text-puzzle-white">Puzzle</span>{' '}
          <span className="text-puzzle-gold">Boss</span>
        </h1>
        
        <p className="text-xl mb-8 text-puzzle-white/80">
          Welcome to the ultimate jigsaw puzzle experience
        </p>
        
        {isAuthenticated ? (
          <div className="space-y-4">
            <p className="text-lg text-puzzle-aqua">
              Welcome back, {user?.email}!
            </p>
            <div className="flex gap-4 justify-center">
              <Link 
                to="/profile"
                className="px-6 py-3 bg-puzzle-aqua text-puzzle-black rounded-lg hover:bg-puzzle-aqua/80 transition-colors font-semibold"
              >
                View Profile
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <p className="text-lg text-puzzle-white/70">
              Create and solve beautiful jigsaw puzzles online
            </p>
            <div className="flex gap-4 justify-center">
              <Link 
                to="/auth"
                className="px-6 py-3 bg-puzzle-aqua text-puzzle-black rounded-lg hover:bg-puzzle-aqua/80 transition-colors font-semibold"
              >
                Sign In
              </Link>
              <Link 
                to="/auth?signup=true"
                className="px-6 py-3 border border-puzzle-aqua text-puzzle-aqua rounded-lg hover:bg-puzzle-aqua/10 transition-colors font-semibold"
              >
                Sign Up
              </Link>
            </div>
          </div>
        )}
        
        <div className="mt-12 bg-puzzle-black/50 border border-puzzle-aqua/20 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4 text-puzzle-gold">Features</h2>
          <div className="grid md:grid-cols-3 gap-6 text-left">
            <div>
              <h3 className="font-semibold text-puzzle-aqua mb-2">Multiple Difficulties</h3>
              <p className="text-puzzle-white/70">Choose from 20, 100, or 500 piece puzzles</p>
            </div>
            <div>
              <h3 className="font-semibold text-puzzle-aqua mb-2">Save & Resume</h3>
              <p className="text-puzzle-white/70">Pick up where you left off anytime</p>
            </div>
            <div>
              <h3 className="font-semibold text-puzzle-aqua mb-2">Leaderboards</h3>
              <p className="text-puzzle-white/70">Compete for the fastest times</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
