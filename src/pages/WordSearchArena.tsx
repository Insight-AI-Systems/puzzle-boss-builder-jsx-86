
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, Clock, Users, DollarSign, Star } from 'lucide-react';

// Mock word search component for now
const MockWordSearchGame = ({ difficulty, entryFee, onComplete }: {
  difficulty: string;
  entryFee: number;
  onComplete: (result: any) => void;
}) => {
  return (
    <div className="p-8 text-center">
      <h3 className="text-lg font-semibold mb-4">Word Search Game ({difficulty})</h3>
      <p className="text-gray-600 mb-4">Entry Fee: ${entryFee}</p>
      <Button onClick={() => onComplete({ score: 100, time: 120 })}>
        Complete Mock Game
      </Button>
    </div>
  );
};

export default function WordSearchArena() {
  const [selectedArena, setSelectedArena] = React.useState<string | null>(null);

  const arenas = [
    {
      id: 'rookie',
      name: 'Rookie Arena',
      difficulty: 'rookie' as const,
      entryFee: 1.99,
      prizePool: 50,
      players: 24,
      timeLimit: 300,
      description: 'Perfect for beginners. Find 8-12 words in easy grids.',
      icon: '🌟'
    },
    {
      id: 'pro',
      name: 'Pro Arena',
      difficulty: 'pro' as const,
      entryFee: 4.99,
      prizePool: 150,
      players: 18,
      timeLimit: 600,
      description: 'Challenging grids with 15-20 words. For experienced players.',
      icon: '⚡'
    },
    {
      id: 'master',
      name: 'Master Arena',
      difficulty: 'master' as const,
      entryFee: 9.99,
      prizePool: 500,
      players: 12,
      timeLimit: 900,
      description: 'Expert level with 25+ words. Ultimate word search challenge.',
      icon: '🏆'
    }
  ];

  const handleArenaSelect = (arena: typeof arenas[0]) => {
    setSelectedArena(arena.id);
  };

  const handleGameComplete = (result: any) => {
    console.log('Game completed:', result);
    setSelectedArena(null);
  };

  if (selectedArena) {
    const arena = arenas.find(a => a.id === selectedArena);
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button 
              variant="outline" 
              onClick={() => setSelectedArena(null)}
              className="mb-4"
            >
              ← Back to Arenas
            </Button>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">{arena?.icon}</span>
                {arena?.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MockWordSearchGame
                difficulty={arena?.difficulty || 'rookie'}
                entryFee={arena?.entryFee || 0}
                onComplete={handleGameComplete}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Word Search Arena
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Compete against players worldwide in timed word search challenges. 
            Choose your arena and win cash prizes!
          </p>
        </div>

        {/* Arena Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {arenas.map((arena) => (
            <Card key={arena.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl">{arena.icon}</span>
                    <div>
                      <CardTitle className="text-xl">{arena.name}</CardTitle>
                      <Badge variant="secondary" className="mt-1">
                        {arena.difficulty}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                      ${arena.prizePool}
                    </div>
                    <div className="text-sm text-gray-500">Prize Pool</div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-gray-600 mb-4">{arena.description}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">${arena.entryFee} entry</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{arena.players} players</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{arena.timeLimit / 60} min limit</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">Top 3 win</span>
                  </div>
                </div>

                <Button 
                  className="w-full group-hover:bg-primary/90"
                  onClick={() => handleArenaSelect(arena)}
                >
                  Enter Arena - ${arena.entryFee}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Winners */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              Recent Winners
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { name: 'Sarah M.', arena: 'Master Arena', prize: '$166.67', time: '7:23' },
                { name: 'Mike R.', arena: 'Pro Arena', prize: '$50.00', time: '4:15' },
                { name: 'Lisa K.', arena: 'Rookie Arena', prize: '$16.67', time: '3:45' }
              ].map((winner, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-semibold">{winner.name}</div>
                    <div className="text-sm text-gray-600">{winner.arena}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-600">{winner.prize}</div>
                    <div className="text-sm text-gray-600">{winner.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
