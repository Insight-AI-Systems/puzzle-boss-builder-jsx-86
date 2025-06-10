
import React, { useState } from 'react';
import { MahjongGameWrapper } from '@/components/games/mahjong';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function MahjongGamePage() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<'rookie' | 'pro' | 'master' | null>(null);

  if (selectedDifficulty) {
    return <MahjongGameWrapper difficulty={selectedDifficulty} />;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-puzzle-white mb-4">Mahjong Solitaire</h1>
        <p className="text-puzzle-white/80 text-lg">
          Match identical tiles to clear the board. Only free tiles can be selected!
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <Card className="border-puzzle-aqua/30 bg-puzzle-black/50 hover:bg-puzzle-black/70 transition-colors cursor-pointer"
              onClick={() => setSelectedDifficulty('rookie')}>
          <CardHeader>
            <CardTitle className="text-puzzle-aqua">🟢 Rookie</CardTitle>
            <CardDescription>Perfect for beginners</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-puzzle-white/80">
              <li>• Simple layout</li>
              <li>• Fewer tiles</li>
              <li>• 3 hints available</li>
              <li>• Free to play</li>
            </ul>
            <Button className="w-full mt-4 bg-green-600 hover:bg-green-700">
              Play Free
            </Button>
          </CardContent>
        </Card>

        <Card className="border-puzzle-aqua/30 bg-puzzle-black/50 hover:bg-puzzle-black/70 transition-colors cursor-pointer"
              onClick={() => setSelectedDifficulty('pro')}>
          <CardHeader>
            <CardTitle className="text-puzzle-aqua">🟡 Pro</CardTitle>
            <CardDescription>Classic Mahjong challenge</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-puzzle-white/80">
              <li>• Traditional turtle layout</li>
              <li>• Multiple layers</li>
              <li>• 3 hints available</li>
              <li>• Requires payment</li>
            </ul>
            <Button className="w-full mt-4 bg-yellow-600 hover:bg-yellow-700">
              Play - $0.50
            </Button>
          </CardContent>
        </Card>

        <Card className="border-puzzle-aqua/30 bg-puzzle-black/50 hover:bg-puzzle-black/70 transition-colors cursor-pointer"
              onClick={() => setSelectedDifficulty('master')}>
          <CardHeader>
            <CardTitle className="text-puzzle-aqua">🔴 Master</CardTitle>
            <CardDescription>Ultimate challenge</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-puzzle-white/80">
              <li>• Complex multi-layer layout</li>
              <li>• Maximum tiles</li>
              <li>• 3 hints available</li>
              <li>• Premium challenge</li>
            </ul>
            <Button className="w-full mt-4 bg-red-600 hover:bg-red-700">
              Play - $1.00
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12 max-w-2xl mx-auto">
        <Card className="border-puzzle-aqua/30 bg-puzzle-black/50">
          <CardHeader>
            <CardTitle className="text-puzzle-aqua">How to Play</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-puzzle-white/80">
            <div>
              <h3 className="font-semibold text-puzzle-white mb-2">🎯 Objective</h3>
              <p>Remove all tiles from the board by matching identical pairs.</p>
            </div>
            <div>
              <h3 className="font-semibold text-puzzle-white mb-2">🔓 Free Tiles</h3>
              <p>Only tiles that are not blocked by other tiles can be selected. A tile is free if it has no tiles above it and at least one side (left or right) is open.</p>
            </div>
            <div>
              <h3 className="font-semibold text-puzzle-white mb-2">🧩 Matching</h3>
              <p>Most tiles must match exactly (same type and number). Flowers and seasons can match with any tile in their respective categories.</p>
            </div>
            <div>
              <h3 className="font-semibold text-puzzle-white mb-2">💡 Hints & Shuffle</h3>
              <p>Use hints to find available matches or shuffle tiles if you're stuck. But use them wisely - they affect your final score!</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
