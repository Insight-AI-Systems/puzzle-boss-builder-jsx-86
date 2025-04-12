
import React from 'react';
import { Award, Calendar, Gift, Shield, Brain, Zap } from 'lucide-react';

const Benefit = ({ title, description, icon }) => {
  return (
    <div className="flex flex-col items-center text-center p-6 card-highlight">
      <div className="w-14 h-14 rounded-full bg-puzzle-aqua/10 border border-puzzle-aqua/30 flex items-center justify-center mb-4 text-puzzle-aqua">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2 text-puzzle-white">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

const Benefits = () => {
  const benefits = [
    {
      title: "Premium Prizes",
      description: "Win high-quality brand-name products from top manufacturers",
      icon: <Gift size={24} />
    },
    {
      title: "Regular Competitions",
      description: "New puzzles and prize pools are added every week",
      icon: <Calendar size={24} />
    },
    {
      title: "Brain Training",
      description: "Improve cognitive skills while having fun and competing",
      icon: <Brain size={24} />
    },
    {
      title: "Skill-Based Rewards",
      description: "Prizes are awarded based on skill, not chance or luck",
      icon: <Award size={24} />
    },
    {
      title: "Secure Platform",
      description: "Your data and transactions are always protected",
      icon: <Shield size={24} />
    },
    {
      title: "Quick Payouts",
      description: "Prizes are shipped quickly after competitions end",
      icon: <Zap size={24} />
    }
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="section-title text-puzzle-white">
          Membership <span className="text-puzzle-gold">Benefits</span>
        </h2>
        <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
          Join The Puzzle Boss community and enjoy these exclusive benefits.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <Benefit 
              key={index}
              title={benefit.title}
              description={benefit.description}
              icon={benefit.icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
