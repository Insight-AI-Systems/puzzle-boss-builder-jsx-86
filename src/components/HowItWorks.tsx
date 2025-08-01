
import React from 'react';
import { 
  UserPlus, 
  Search, 
  Puzzle, 
  Trophy
} from 'lucide-react';

interface StepProps {
  number: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const Step: React.FC<StepProps> = ({ number, title, description, icon }) => {
  return (
    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
      <div className="flex-shrink-0">
        <div className="w-16 h-16 rounded-full bg-puzzle-aqua/20 border border-puzzle-aqua flex items-center justify-center text-puzzle-aqua">
          {icon}
        </div>
      </div>
      <div>
        <h3 className="text-xl md:text-2xl font-bold mb-2 text-center md:text-left">
          <span className="text-puzzle-gold mr-2">#{number}</span> {title}
        </h3>
        <p className="text-muted-foreground text-center md:text-left">{description}</p>
      </div>
    </div>
  );
};

const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: 1,
      title: "Create an Account",
      description: "Sign up for free and create your CodeCanyon Jigsaw Deluxe profile to start your puzzle-solving journey.",
      icon: <UserPlus size={24} />
    },
    {
      number: 2,
      title: "Browse Competitions",
      description: "Explore active competitions with different difficulty levels and prize pools.",
      icon: <Search size={24} />
    },
    {
      number: 3,
      title: "Solve Puzzles",
      description: "Complete puzzles against the clock to earn points and climb the leaderboard.",
      icon: <Puzzle size={24} />
    },
    {
      number: 4,
      title: "Win Prizes",
      description: "Top performers win premium brand-name prizes shipped directly to their doorstep.",
      icon: <Trophy size={24} />
    }
  ];

  return (
    <section className="py-16" id="how-it-works">
      <div className="container mx-auto px-4">
        <h2 className="section-title text-puzzle-white">
          How It <span className="text-puzzle-burgundy">Works</span>
        </h2>
        <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
          The CodeCanyon Jigsaw Deluxe platform makes it easy to compete and win. Here's how to get started.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {steps.map((step) => (
            <Step 
              key={step.number}
              number={step.number}
              title={step.title}
              description={step.description}
              icon={step.icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
