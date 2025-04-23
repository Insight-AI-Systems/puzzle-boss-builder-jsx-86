import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { ArrowRight } from 'lucide-react';
import PuzzleBossEngine from './puzzles/playground/engines/PuzzleBossEngine';

const HERO_PUZZLE_IMAGE = "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7";

const Hero: React.FC = () => {
  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="w-full md:w-1/2 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-puzzle-white">Race to solve.</span>
              <br />
              <span className="text-puzzle-aqua">Win amazing</span>
              <br />
              <span className="text-puzzle-gold">prizes.</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-md mx-auto md:mx-0">
              Join thousands of puzzle enthusiasts competing to win premium brand-name prizes through skill-based challenges.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button 
                className="bg-puzzle-aqua text-puzzle-black hover:bg-puzzle-aqua/90 text-lg px-6 py-3 h-auto" 
                asChild
              >
                <Link to="/auth?signup=true">Join Now</Link>
              </Button>
              <Button 
                variant="outline" 
                className="border-puzzle-gold text-puzzle-gold hover:bg-puzzle-gold/10 text-lg px-6 py-3 h-auto"
                asChild
              >
                <Link to="/about">
                  Learn More <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="w-full md:w-1/2 flex justify-center">
            <div className="relative flex flex-col items-center">
              <div className="absolute inset-0 bg-puzzle-aqua/30 blur-[100px] rounded-full pointer-events-none"></div>
              <div className="card-highlight p-4 md:p-8 relative w-[340px] max-w-full">
                <h3 className="text-xl font-bold text-center mb-4 text-puzzle-white">Try a Mini Puzzle</h3>
                <div className="w-[300px] h-[300px] flex items-center justify-center mx-auto">
                  <PuzzleBossEngine
                    imageUrl={HERO_PUZZLE_IMAGE}
                    rows={3}
                    columns={3}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
