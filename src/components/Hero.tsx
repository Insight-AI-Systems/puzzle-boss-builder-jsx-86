
import React from 'react';
import { SparklesIcon } from '@heroicons/react/20/solid'
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';

export const Hero = () => {
  const { hasRole, isAuthenticated } = useAuth();
  const showCFOLink = isAuthenticated && (hasRole('super_admin') || hasRole('admin') || hasRole('cfo'));
  
  return (
    <div className="relative bg-black overflow-hidden">
      <div className="mx-auto max-w-7xl">
        <div className="relative z-10 bg-black pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <svg
            className="absolute inset-y-0 right-0 hidden h-full w-48 translate-x-1/2 transform text-black lg:block"
            fill="currentColor"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
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
                  <Link
                    to="/puzzles"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-black bg-puzzle-gold hover:bg-puzzle-gold/80 md:py-4 md:text-lg md:px-10"
                  >
                    Explore Puzzles
                  </Link>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <Link
                    to="/how-it-works"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-puzzle-aqua hover:bg-puzzle-aqua/80 md:py-4 md:text-lg md:px-10"
                  >
                    How It Works
                  </Link>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <img
          className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
          src="https://images.unsplash.com/photo-1605870445919-838d190e8e1b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2850&q=80"
          alt="Partially assembled jigsaw puzzle"
        />
      </div>
      
      {showCFOLink && (
        <div className="absolute top-4 right-4 z-10">
          <Link 
            to="/cfo-dashboard"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-puzzle-gold hover:bg-puzzle-gold/80"
          >
            Access CFO Dashboard
          </Link>
        </div>
      )}
    </div>
  );
};
