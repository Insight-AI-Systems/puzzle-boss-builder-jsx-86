
import React, { useState } from 'react';
import PageLayout from '@/components/layouts/PageLayout';
import { WordSearchLeaderboard } from '@/components/games/word-search/WordSearchLeaderboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Target, Zap, Brain } from 'lucide-react';

type GameType = 'word-search' | 'jigsaw' | 'tetris' | 'memory';

export default function LeaderboardPage() {
  const [selectedGame, setSelectedGame] = useState<GameType>('word-search');

  const gameTypes = [
    { id: 'word-search' as GameType, name: 'Word Search', icon: Target, available: true },
    { id: 'jigsaw' as GameType, name: 'Jigsaw Puzzles', icon: Trophy, available: false },
    { id: 'tetris' as GameType, name: 'Block Puzzle', icon: Zap, available: false },
    { id: 'memory' as GameType, name: 'Memory Game', icon: Brain, available: false },
  ];

  const renderLeaderboard = () => {
    switch (selectedGame) {
      case 'word-search':
        return <WordSearchLeaderboard limit={20} showTitle={false} />;
      default:
        return (
          <Card>
            <CardContent className="text-center py-12">
              <Trophy className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-medium mb-2">Coming Soon!</h3>
              <p className="text-gray-400">
                Leaderboards for {gameTypes.find(g => g.id === selectedGame)?.name} will be available soon.
              </p>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <PageLayout 
      title="Global Leaderboards" 
      subtitle="See how you rank against other players"
    >
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Game Type Selector */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Select Game Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {gameTypes.map((gameType) => {
                const Icon = gameType.icon;
                return (
                  <Button
                    key={gameType.id}
                    variant={selectedGame === gameType.id ? "default" : "outline"}
                    onClick={() => setSelectedGame(gameType.id)}
                    disabled={!gameType.available}
                    className={`flex flex-col items-center gap-2 h-20 ${
                      selectedGame === gameType.id 
                        ? 'bg-puzzle-aqua text-puzzle-black hover:bg-puzzle-aqua/80' 
                        : ''
                    }`}
                  >
                    <Icon className="h-6 w-6" />
                    <span className="text-sm">{gameType.name}</span>
                    {!gameType.available && (
                      <span className="text-xs opacity-50">Soon</span>
                    )}
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Selected Leaderboard */}
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-puzzle-white mb-2">
              {gameTypes.find(g => g.id === selectedGame)?.name} Leaderboard
            </h2>
            <p className="text-puzzle-aqua">
              Top players ranked by score and completion time
            </p>
          </div>
          
          {renderLeaderboard()}
        </div>
      </div>
    </PageLayout>
  );
}
