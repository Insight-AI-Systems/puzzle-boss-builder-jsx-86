
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Users, Trophy } from 'lucide-react';

const FEATURED_PUZZLES = [
  {
    id: 1,
    title: "Sunset Mountains",
    image: "/lovable-uploads/4fbf2007-dfbf-4bcf-ad58-e2f950b412cd.png",
    difficulty: "Medium",
    pieces: 500,
    timeLimit: "30 min",
    players: 1247,
    prize: "$100"
  },
  {
    id: 2,
    title: "Ocean Waves",
    image: "/lovable-uploads/882de588-d3e2-4a5a-b0d0-0692fcb71b04.png",
    difficulty: "Hard",
    pieces: 1000,
    timeLimit: "45 min",
    players: 892,
    prize: "$250"
  },
  {
    id: 3,
    title: "City Skyline",
    image: "/lovable-uploads/4fbf2007-dfbf-4bcf-ad58-e2f950b412cd.png",
    difficulty: "Easy",
    pieces: 100,
    timeLimit: "15 min",
    players: 2156,
    prize: "$50"
  }
];

export const FeaturedPuzzles: React.FC = () => {
  return (
    <section className="py-24 bg-puzzle-gray">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-game text-puzzle-white mb-4">
            Featured Puzzles
          </h2>
          <p className="text-puzzle-white/70 max-w-2xl mx-auto">
            Test your skills with our most popular puzzles. Compete for prizes and climb the leaderboard.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURED_PUZZLES.map((puzzle) => (
            <Card key={puzzle.id} className="bg-puzzle-black border-puzzle-border overflow-hidden">
              <div className="aspect-video relative overflow-hidden">
                <img 
                  src={puzzle.image} 
                  alt={puzzle.title}
                  className="w-full h-full object-cover"
                />
                <Badge 
                  className="absolute top-4 right-4 bg-puzzle-aqua text-puzzle-black"
                >
                  {puzzle.difficulty}
                </Badge>
              </div>
              
              <CardHeader>
                <CardTitle className="text-puzzle-white">{puzzle.title}</CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm text-puzzle-white/70">
                  <span>{puzzle.pieces} pieces</span>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {puzzle.timeLimit}
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm text-puzzle-white/70">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {puzzle.players} players
                  </div>
                  <div className="flex items-center text-puzzle-gold">
                    <Trophy className="h-4 w-4 mr-1" />
                    {puzzle.prize}
                  </div>
                </div>
                
                <Button className="w-full bg-puzzle-aqua hover:bg-puzzle-aqua/80 text-puzzle-black">
                  Play Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
