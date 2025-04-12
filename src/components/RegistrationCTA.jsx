
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Trophy } from 'lucide-react';

const RegistrationCTA = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-puzzle-black to-puzzle-black/80 border-t border-b border-puzzle-aqua/20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-puzzle-aqua/20 p-1 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
            <Trophy size={32} className="text-puzzle-aqua" />
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-puzzle-white">
            Ready to <span className="text-puzzle-gold">Win</span> Amazing Prizes?
          </h2>
          
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of puzzle enthusiasts competing in skill-based challenges. 
            Create your free account today and start playing for premium brand-name prizes!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth?tab=register">
              <Button className="bg-puzzle-gold text-puzzle-black hover:bg-puzzle-gold/90 text-lg px-8 py-3 h-auto">
                Sign Up Now
              </Button>
            </Link>
            <Link to="/#how-it-works">
              <Button variant="outline" className="border-puzzle-aqua text-puzzle-aqua hover:bg-puzzle-aqua/10 text-lg px-8 py-3 h-auto">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegistrationCTA;
