
import React from 'react';
import { Trophy, Clock, Users } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

interface PuzzleCardProps {
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
  prizePool: string;
  timeLeft: string;
  players: number;
  imageUrl: string;
}

const difficultyColors = {
  Easy: 'bg-green-500',
  Medium: 'bg-yellow-500',
  Hard: 'bg-red-500',
  Expert: 'bg-purple-500'
};

const PuzzleCard: React.FC<PuzzleCardProps> = ({ 
  title, difficulty, prizePool, timeLeft, players, imageUrl 
}) => {
  return (
    <Card className="card-highlight overflow-hidden group">
      <div className="relative h-48 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-puzzle-black to-transparent z-10" />
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <Badge className={`absolute top-2 right-2 z-20 ${difficultyColors[difficulty]}`}>
          {difficulty}
        </Badge>
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl text-puzzle-white">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="text-xl font-game text-puzzle-gold">{prizePool}</div>
      </CardContent>
      <CardFooter className="flex justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <Clock size={14} className="text-puzzle-aqua" />
          <span>{timeLeft}</span>
        </div>
        <div className="flex items-center gap-1">
          <Users size={14} className="text-puzzle-aqua" />
          <span>{players} players</span>
        </div>
      </CardFooter>
    </Card>
  );
};

const FeaturedPuzzles: React.FC = () => {
  const puzzles = [
    {
      title: "Space Explorer",
      difficulty: "Medium" as const,
      prizePool: "$5,000",
      timeLeft: "2 days left",
      players: 1247,
      imageUrl: "https://images.unsplash.com/photo-1454789476662-53eb23ba5907?q=80&w=689&auto=format&fit=crop"
    },
    {
      title: "Ancient Ruins",
      difficulty: "Hard" as const,
      prizePool: "$10,000",
      timeLeft: "5 days left",
      players: 823,
      imageUrl: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1470&auto=format&fit=crop"
    },
    {
      title: "Ocean Depths",
      difficulty: "Easy" as const,
      prizePool: "$2,500",
      timeLeft: "1 day left",
      players: 2156,
      imageUrl: "https://images.unsplash.com/photo-1518796745738-41048802f99a?q=80&w=1469&auto=format&fit=crop"
    },
    {
      title: "Cosmic Challenge",
      difficulty: "Expert" as const,
      prizePool: "$25,000",
      timeLeft: "7 days left",
      players: 541,
      imageUrl: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=1422&auto=format&fit=crop"
    }
  ];

  return (
    <section className="py-16" id="prizes">
      <div className="container mx-auto px-4">
        <h2 className="section-title text-puzzle-white">
          Featured <span className="text-puzzle-aqua">Competitions</span>
        </h2>
        <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
          Join these active competitions and race to solve puzzles for a chance to win premium prizes from top brands.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {puzzles.map((puzzle, index) => (
            <PuzzleCard key={index} {...puzzle} />
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <button className="btn-primary">
            View All Competitions
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedPuzzles;
