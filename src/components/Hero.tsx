
import React from 'react';
import { SparklesIcon, TrophyIcon, ClockIcon, UsersIcon } from '@heroicons/react/20/solid';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const Hero = () => {
  const {
    hasRole,
    isAuthenticated
  } = useAuth();
  const showCFOLink = isAuthenticated && (hasRole('super_admin') || hasRole('admin') || hasRole('cfo'));
  
  return <div className="relative bg-black overflow-hidden">
      <div className="mx-auto max-w-7xl">
        <div className="relative z-10 bg-black pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <svg className="absolute inset-y-0 right-0 hidden h-full w-48 translate-x-1/2 transform text-black lg:block" fill="currentColor" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <polygon points="50,0 100,0 50,100 0,100" />
          </svg>

          <div className="relative pt-6 px-4 sm:px-6 lg:px-8">
            {/* Leave Navbar Here - Important for Layout */}
          </div>

          <main className="mx-auto mt-10 max-w-screen-xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
                <span className="block xl:inline font-game">Unleash Your Inner</span>
                <span className="block text-puzzle-gold xl:inline font-game">Puzzle Master</span>
              </h1>
              <p className="mt-3 text-base text-gray-300 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                Dive into a world of brain-teasing challenges and unlock amazing prizes.
                Solve puzzles, earn rewards, and join a community of puzzle enthusiasts.
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow">
                  <Link to="/puzzles" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-black bg-puzzle-gold hover:bg-puzzle-gold/80 md:py-4 md:text-lg md:px-10">
                    Explore Puzzles
                  </Link>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <Link to="/how-it-works" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-puzzle-aqua hover:bg-puzzle-aqua/80 md:py-4 md:text-lg md:px-10">
                    How It Works
                  </Link>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      
      {/* Word Search Arena Promotion */}
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <div className="h-56 w-full sm:h-72 md:h-96 lg:w-full lg:h-full bg-gradient-to-br from-puzzle-aqua/20 via-puzzle-black to-puzzle-gold/20 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="grid grid-cols-8 gap-1 p-4 h-full">
              {Array.from({ length: 64 }).map((_, i) => (
                <div key={i} className="bg-puzzle-aqua rounded-sm flex items-center justify-center text-xs font-bold text-puzzle-black">
                  {String.fromCharCode(65 + (i % 26))}
                </div>
              ))}
            </div>
          </div>
          
          {/* Promotional Content */}
          <div className="relative z-10 h-full flex flex-col justify-center items-center p-6 text-center">
            {/* NEW Badge */}
            <div className="mb-4">
              <Badge className="bg-puzzle-gold text-puzzle-black font-bold text-lg px-4 py-2 animate-pulse">
                🆕 NEW ARENA
              </Badge>
            </div>
            
            {/* Main Title */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-puzzle-white mb-2">
              Word Search
            </h2>
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-puzzle-aqua mb-4">
              Arena
            </h3>
            
            {/* Features */}
            <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
              <div className="flex items-center text-puzzle-white">
                <TrophyIcon className="h-5 w-5 text-puzzle-gold mr-2" />
                <span>Live Competitions</span>
              </div>
              <div className="flex items-center text-puzzle-white">
                <ClockIcon className="h-5 w-5 text-puzzle-aqua mr-2" />
                <span>Real-time Scoring</span>
              </div>
              <div className="flex items-center text-puzzle-white">
                <UsersIcon className="h-5 w-5 text-puzzle-gold mr-2" />
                <span>247+ Active Players</span>
              </div>
              <div className="flex items-center text-puzzle-white">
                <SparklesIcon className="h-5 w-5 text-puzzle-aqua mr-2" />
                <span>Instant Rewards</span>
              </div>
            </div>
            
            {/* Free Credits Offer */}
            <div className="bg-puzzle-gold/20 border-2 border-puzzle-gold rounded-lg p-4 mb-6 backdrop-blur-sm">
              <div className="text-puzzle-gold font-bold text-lg mb-1">
                🎁 FREE CREDITS OFFER
              </div>
              <div className="text-puzzle-white text-sm">
                Get 10 FREE practice credits
              </div>
              <div className="text-puzzle-aqua text-xs">
                No entry fee • Practice unlimited
              </div>
            </div>
            
            {/* Call to Action */}
            <div className="space-y-3">
              <Link to="/puzzles/word-search">
                <Button className="bg-puzzle-aqua hover:bg-puzzle-aqua/80 text-puzzle-black font-bold text-lg px-8 py-3 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200">
                  🚀 Enter Arena NOW
                </Button>
              </Link>
              
              <div className="text-xs text-gray-400">
                Join the competition • Win real prizes
              </div>
            </div>
            
            {/* Live Stats */}
            <div className="absolute bottom-4 right-4 bg-puzzle-black/80 rounded-lg p-3 text-xs">
              <div className="text-puzzle-aqua font-bold">🔴 LIVE</div>
              <div className="text-puzzle-white">Next tournament: 15:30</div>
              <div className="text-puzzle-gold">Prize pool: $500+</div>
            </div>
          </div>
          
          {/* Floating Elements */}
          <div className="absolute top-4 left-4 text-2xl animate-bounce">🔍</div>
          <div className="absolute top-20 right-8 text-xl animate-pulse">💎</div>
          <div className="absolute bottom-20 left-8 text-lg animate-bounce" style={{ animationDelay: '1s' }}>⚡</div>
        </div>
      </div>
      
      {showCFOLink && <div className="absolute top-4 right-4 z-10">
          
        </div>}
    </div>;
};
