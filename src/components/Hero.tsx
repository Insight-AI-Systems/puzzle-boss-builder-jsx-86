
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { ArrowRight } from 'lucide-react';
import PuzzleEnginePlayground from './puzzles/playground/PuzzleEnginePlayground';

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
              <Button className="bg-puzzle-aqua text-puzzle-black hover:bg-puzzle-aqua/90 text-lg px-6 py-3 h-auto" asChild>
                <Link to="/auth?signup=true">Join Now</Link>
              </Button>
              <Button variant="outline" className="border-puzzle-gold text-puzzle-gold hover:bg-puzzle-gold/10 text-lg px-6 py-3 h-auto" asChild>
                <Link to="/about">
                  Learn More <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="w-full md:w-1/2">
            <PuzzleEnginePlayground 
              heroMode={true} 
              isCondensed={true}
              selectedImage="mountain"
              difficulty="easy"
              miniRows={3}
              miniColumns={3}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
