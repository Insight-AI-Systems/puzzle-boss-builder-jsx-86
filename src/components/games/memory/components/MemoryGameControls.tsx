
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Clock, Trophy, RotateCcw, Star } from 'lucide-react';
import { MemoryLayout, MemoryTheme, THEME_CONFIGS } from '../types/memoryTypes';

interface MemoryGameControlsProps {
  moves: number;
  timeElapsed: number;
  matchedPairs: number;
  totalPairs: number;
  accuracy: number;
  layout: MemoryLayout;
  theme: MemoryTheme;
  isGameActive: boolean;
  onLayoutChange: (layout: MemoryLayout) => void;
  onThemeChange: (theme: MemoryTheme) => void;
  onRestart: () => void;
}

export function MemoryGameControls({
  moves,
  timeElapsed,
  matchedPairs,
  totalPairs,
  accuracy,
  layout,
  theme,
  isGameActive,
  onLayoutChange,
  onThemeChange,
  onRestart
}: MemoryGameControlsProps) {
  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="bg-gray-900 border-gray-700 mb-4">
      <CardHeader>
        <CardTitle className="text-puzzle-white flex items-center gap-2">
          <Trophy className="w-5 h-5 text-puzzle-gold" />
          Memory Match Game
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Game Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-gray-800 rounded-lg">
            <Clock className="w-6 h-6 text-puzzle-aqua mx-auto mb-1" />
            <div className="text-sm text-puzzle-white font-medium">
              {formatTime(timeElapsed)}
            </div>
            <div className="text-xs text-gray-400">Time</div>
          </div>
          
          <div className="text-center p-3 bg-gray-800 rounded-lg">
            <Star className="w-6 h-6 text-puzzle-gold mx-auto mb-1" />
            <div className="text-sm text-puzzle-white font-medium">{moves}</div>
            <div className="text-xs text-gray-400">Moves</div>
          </div>
          
          <div className="text-center p-3 bg-gray-800 rounded-lg">
            <Trophy className="w-6 h-6 text-green-500 mx-auto mb-1" />
            <div className="text-sm text-puzzle-white font-medium">
              {matchedPairs}/{totalPairs}
            </div>
            <div className="text-xs text-gray-400">Pairs</div>
          </div>
          
          <div className="text-center p-3 bg-gray-800 rounded-lg">
            <div className="text-sm text-puzzle-white font-medium">
              {accuracy.toFixed(1)}%
            </div>
            <div className="text-xs text-gray-400">Accuracy</div>
          </div>
        </div>

        {/* Game Controls */}
        <div className="flex flex-wrap gap-3 items-center">
          <Select value={layout} onValueChange={onLayoutChange} disabled={isGameActive}>
            <SelectTrigger className="w-32 bg-gray-800 border-gray-600 text-puzzle-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600">
              <SelectItem value="3x4">3×4 (Easy)</SelectItem>
              <SelectItem value="4x5">4×5 (Medium)</SelectItem>
              <SelectItem value="5x6">5×6 (Hard)</SelectItem>
            </SelectContent>
          </Select>

          <Select value={theme} onValueChange={onThemeChange} disabled={isGameActive}>
            <SelectTrigger className="w-32 bg-gray-800 border-gray-600 text-puzzle-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600">
              {Object.entries(THEME_CONFIGS).map(([key, config]) => (
                <SelectItem key={key} value={key}>
                  {config.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            onClick={onRestart}
            variant="outline"
            className="bg-gray-800 border-gray-600 text-puzzle-white hover:bg-gray-700"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            New Game
          </Button>
        </div>

        {/* Progress Badge */}
        {isGameActive && (
          <div className="flex justify-center">
            <Badge className="bg-puzzle-aqua text-puzzle-black">
              Game in Progress
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
