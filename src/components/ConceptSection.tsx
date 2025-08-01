import React from 'react';
import { MoveHorizontal, Clock, Award } from 'lucide-react';
interface ConceptItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}
const ConceptItem: React.FC<ConceptItemProps> = ({
  icon,
  title,
  description
}) => {
  return <div className="flex flex-col items-center md:items-start text-center md:text-left">
      <div className="text-puzzle-aqua mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2 text-puzzle-white">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>;
};
const ConceptSection: React.FC = () => {
  return <section className="py-16 bg-puzzle-black/50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="section-title text-puzzle-white">
            The <span className="text-puzzle-gold">Concept</span>
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">The PuzzleBoss Jigsaw Deluxe platform introduces a revolutionary way to turn your puzzle-solving skills into amazing prize opportunities.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <ConceptItem icon={<MoveHorizontal size={36} />} title="Skill-Based Competitions" description="Compete in various puzzle types that test your logical thinking, pattern recognition, and problem-solving abilities." />
            
            <ConceptItem icon={<Clock size={36} />} title="Race Against Time" description="Complete puzzles as quickly as possible to earn a higher ranking on the leaderboard." />
            
            <ConceptItem icon={<Award size={36} />} title="Premium Brand Prizes" description="Win high-quality products from top brands like Apple, Samsung, Sony, Nintendo, and more." />
          </div>
        </div>
      </div>
    </section>;
};
export default ConceptSection;