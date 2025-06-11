
import React from 'react';
import { Button } from '@/components/ui/button';
import { Puzzle, Star, Trophy } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative bg-gradient-to-br from-puzzle-black to-puzzle-gray min-h-screen flex items-center">
      <div className="container mx-auto px-6 py-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <Puzzle className="h-16 w-16 text-puzzle-aqua mr-4" />
            <h1 className="text-5xl md:text-7xl font-game text-puzzle-white">
              PuzzleBoss
            </h1>
          </div>
          
          <p className="text-xl md:text-2xl text-puzzle-white/80 mb-8 max-w-2xl mx-auto">
            Challenge yourself with premium jigsaw puzzles. Compete with friends, 
            win prizes, and master the art of puzzle solving.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="bg-puzzle-aqua hover:bg-puzzle-aqua/80 text-puzzle-black font-semibold">
              <Star className="h-5 w-5 mr-2" />
              Start Playing
            </Button>
            <Button size="lg" variant="outline" className="border-puzzle-gold text-puzzle-gold hover:bg-puzzle-gold/10">
              <Trophy className="h-5 w-5 mr-2" />
              View Leaderboard
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="text-center">
              <div className="text-3xl font-bold text-puzzle-aqua">500+</div>
              <p className="text-puzzle-white/70">Premium Puzzles</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-puzzle-gold">10K+</div>
              <p className="text-puzzle-white/70">Active Players</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-puzzle-aqua">$50K+</div>
              <p className="text-puzzle-white/70">Prizes Awarded</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
