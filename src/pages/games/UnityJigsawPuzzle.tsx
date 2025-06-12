
import React from 'react';
import { UnityJigsawPuzzleWrapper } from '@/components/games/unity/UnityJigsawPuzzleWrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Puzzle, Clock, Trophy } from 'lucide-react';

const UnityJigsawPuzzle: React.FC = () => {
  return (
    <div className="min-h-screen bg-puzzle-black p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Game Header */}
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-puzzle-white flex items-center gap-2">
              <Puzzle className="h-6 w-6 text-puzzle-aqua" />
              Unity Jigsaw Puzzle
            </CardTitle>
            <p className="text-gray-400">
              Experience our premium jigsaw puzzle game built with Unity WebGL technology.
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2 text-puzzle-white">
                <Clock className="h-4 w-4 text-puzzle-gold" />
                <span>Timed Gameplay</span>
              </div>
              <div className="flex items-center gap-2 text-puzzle-white">
                <Trophy className="h-4 w-4 text-puzzle-gold" />
                <span>Leaderboard Scoring</span>
              </div>
              <div className="flex items-center gap-2 text-puzzle-white">
                <Puzzle className="h-4 w-4 text-puzzle-gold" />
                <span>Advanced Physics</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Game Container */}
        <UnityJigsawPuzzleWrapper 
          requiresPayment={false}
          entryFee={0}
          timeLimit={undefined} // No time limit by default
        />
      </div>
    </div>
  );
};

export default UnityJigsawPuzzle;
