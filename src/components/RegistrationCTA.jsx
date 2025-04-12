
import React from 'react';
import RegistrationForm from './RegistrationForm';

const RegistrationCTA = () => {
  return (
    <section className="py-20 relative">
      <div className="absolute inset-0 bg-puzzle-aqua/5 z-0"></div>
      <div className="absolute inset-0 z-0 opacity-30 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-puzzle-aqua/20 via-transparent to-transparent"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-puzzle-white">
                Join <span className="text-puzzle-gold">The Puzzle Boss</span> <br/>
                Community Today
              </h2>
              
              <p className="text-muted-foreground mb-8">
                Create your free account and start competing for amazing prizes. No entry fees required. We reward skill, not luck.
              </p>
              
              <ul className="space-y-4">
                {[
                  "Access to all puzzle competitions",
                  "Track your progress and ranking",
                  "Qualify for exclusive prize draws",
                  "Connect with fellow puzzle enthusiasts"
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-puzzle-gold mr-2">✓</span>
                    <span className="text-puzzle-white">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="card-highlight p-6 md:p-8">
              <h3 className="text-xl font-bold mb-6 text-center text-puzzle-white">
                Create Your Free Account
              </h3>
              <RegistrationForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegistrationCTA;
