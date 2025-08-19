import React from 'react';
import { FixedHeadbreaker } from '@/components/games/jigsaw/FixedHeadbreaker';
import { SimpleHeadbreaker } from '@/components/games/jigsaw/SimpleHeadbreaker';
import { Card } from '@/components/ui/card';

export default function TestHeadbreaker() {
  const handleComplete = (stats: any) => {
    console.log('Puzzle completed with stats:', stats);
    alert(`
      🎉 Puzzle Complete!
      Time: ${stats.time}s
      Moves: ${stats.moves}
      Score: ${stats.score}
    `);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <Card className="p-6 bg-black/20 backdrop-blur-lg border-purple-500/20">
          <h1 className="text-3xl font-bold text-white mb-2">
            Headbreaker Puzzle Test
          </h1>
          <p className="text-gray-300">
            Testing the fixed Headbreaker implementation with base64 SVG fallback
          </p>
        </Card>

        <div className="grid grid-cols-1 gap-6">
          <Card className="p-6 bg-black/20 backdrop-blur-lg border-purple-500/20">
            <h2 className="text-xl font-semibold text-white mb-4">Simple Canvas Test</h2>
            <SimpleHeadbreaker difficulty="easy" />
          </Card>

          <Card className="p-6 bg-black/20 backdrop-blur-lg border-purple-500/20">
            <h2 className="text-xl font-semibold text-white mb-4">Easy Mode (3x3)</h2>
            <FixedHeadbreaker 
              difficulty="easy"
              onComplete={handleComplete}
            />
          </Card>

          <Card className="p-6 bg-black/20 backdrop-blur-lg border-purple-500/20">
            <h2 className="text-xl font-semibold text-white mb-4">Medium Mode (4x4)</h2>
            <FixedHeadbreaker 
              difficulty="medium"
              onComplete={handleComplete}
            />
          </Card>

          <Card className="p-6 bg-black/20 backdrop-blur-lg border-purple-500/20">
            <h2 className="text-xl font-semibold text-white mb-4">Hard Mode (5x5)</h2>
            <FixedHeadbreaker 
              difficulty="hard"
              onComplete={handleComplete}
            />
          </Card>
        </div>

        <Card className="p-4 bg-blue-600/20 backdrop-blur-lg border-blue-500/20">
          <p className="text-sm text-gray-300">
            <strong className="text-white">Note:</strong> This test page uses the fixed Headbreaker implementation 
            with a base64 SVG image as fallback to avoid CORS issues. The puzzle should load without any image errors.
          </p>
        </Card>
      </div>
    </div>
  );
}