import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Clock, MousePointer, Trophy, Lightbulb, RotateCcw, Pause, Play } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface GameStats {
  timeElapsed: number;
  moves: number;
  completionPercentage: number;
  hintsUsed: number;
}

interface PuzzleGameSidebarProps {
  gameStats?: GameStats;
  onAction?: (action: string) => void;
  isPaused?: boolean;
  showGuide?: boolean;
}

export const PuzzleGameSidebar: React.FC<PuzzleGameSidebarProps> = ({
  gameStats = {
    timeElapsed: 0,
    moves: 0,
    completionPercentage: 0,
    hintsUsed: 0
  },
  onAction,
  isPaused = false,
  showGuide = false
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      {/* Game Statistics */}
      <Card className="bg-puzzle-black/50 border-puzzle-aqua/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-puzzle-white text-lg flex items-center gap-2">
            <Trophy className="h-5 w-5 text-puzzle-gold" />
            Game Stats
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-puzzle-aqua mb-1">
                <Clock className="h-4 w-4" />
                <span className="text-sm">Time</span>
              </div>
              <div className="text-lg font-bold text-puzzle-white">
                {formatTime(gameStats.timeElapsed)}
              </div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-puzzle-aqua mb-1">
                <MousePointer className="h-4 w-4" />
                <span className="text-sm">Moves</span>
              </div>
              <div className="text-lg font-bold text-puzzle-white">
                {gameStats.moves}
              </div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-puzzle-aqua">Progress</span>
              <Badge variant="outline" className="text-puzzle-gold border-puzzle-gold/50">
                {Math.round(gameStats.completionPercentage)}%
              </Badge>
            </div>
            <Progress 
              value={gameStats.completionPercentage} 
              className="h-2"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Hints Used</span>
            <div className="flex items-center gap-1">
              <Lightbulb className="h-4 w-4 text-puzzle-gold" />
              <span className="text-puzzle-white font-medium">{gameStats.hintsUsed}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Game Controls */}
      <Card className="bg-puzzle-black/50 border-puzzle-aqua/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-puzzle-white text-lg">Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            variant="outline"
            className="w-full text-puzzle-aqua border-puzzle-aqua/50 hover:bg-puzzle-aqua/10"
            onClick={() => onAction?.(isPaused ? 'resume' : 'pause')}
          >
            {isPaused ? (
              <>
                <Play className="h-4 w-4 mr-2" />
                Resume
              </>
            ) : (
              <>
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </>
            )}
          </Button>
          
          <Button
            variant="outline"
            className="w-full text-puzzle-gold border-puzzle-gold/50 hover:bg-puzzle-gold/10"
            onClick={() => onAction?.('hint')}
          >
            <Lightbulb className="h-4 w-4 mr-2" />
            Use Hint
          </Button>
          
          <Button
            variant="outline"
            className="w-full text-puzzle-white border-muted hover:bg-muted/10"
            onClick={() => onAction?.('toggle-guide')}
          >
            Guide: {showGuide ? 'ON' : 'OFF'}
          </Button>
          
          <Button
            variant="outline"
            className="w-full text-red-400 border-red-400/50 hover:bg-red-400/10"
            onClick={() => onAction?.('reset')}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset Game
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};