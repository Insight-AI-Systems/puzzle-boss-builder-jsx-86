import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Trophy, Clock, MousePointer, Star, Target, 
  Share2, RotateCcw, Home, Award 
} from 'lucide-react';

interface CompletionStats {
  timeElapsed: number;
  moves: number;
  difficulty: string;
  hintsUsed: number;
  score: number;
  rank?: number;
  isPersonalBest?: boolean;
  achievements?: string[];
}

interface PuzzleCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: CompletionStats;
  puzzleName: string;
  onPlayAgain?: () => void;
  onViewLeaderboard?: () => void;
  onReturnHome?: () => void;
  onShare?: () => void;
}

export const PuzzleCompletionModal: React.FC<PuzzleCompletionModalProps> = ({
  isOpen,
  onClose,
  stats,
  puzzleName,
  onPlayAgain,
  onViewLeaderboard,
  onReturnHome,
  onShare
}) => {
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Initial confetti burst
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      // Delayed second burst
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 }
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 }
        });
      }, 500);

      // Show details after animation
      setTimeout(() => setShowDetails(true), 1000);
    } else {
      setShowDetails(false);
    }
  }, [isOpen]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-400/20 text-green-400 border-green-400/30';
      case 'medium': return 'bg-yellow-400/20 text-yellow-400 border-yellow-400/30';
      case 'hard': return 'bg-red-400/20 text-red-400 border-red-400/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-puzzle-black border-puzzle-aqua/50">
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full bg-puzzle-gold/20">
              <Trophy className="h-12 w-12 text-puzzle-gold" />
            </div>
          </div>
          <DialogTitle className="text-2xl text-puzzle-white">
            🎉 Puzzle Complete!
          </DialogTitle>
          <DialogDescription className="text-puzzle-white/70">
            Congratulations on completing <span className="text-puzzle-aqua font-medium">{puzzleName}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Main Stats */}
          <Card className="bg-puzzle-black/50 border-puzzle-aqua/30">
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-puzzle-aqua mb-1">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">Time</span>
                  </div>
                  <div className="text-xl font-bold text-puzzle-white">
                    {formatTime(stats.timeElapsed)}
                  </div>
                  {stats.isPersonalBest && (
                    <Badge variant="outline" className="text-xs text-puzzle-gold border-puzzle-gold/50 mt-1">
                      Personal Best!
                    </Badge>
                  )}
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-puzzle-aqua mb-1">
                    <MousePointer className="h-4 w-4" />
                    <span className="text-sm">Moves</span>
                  </div>
                  <div className="text-xl font-bold text-puzzle-white">
                    {stats.moves}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Details */}
          {showDetails && (
            <div className="space-y-3 animate-in fade-in-50 duration-500">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Difficulty</span>
                <Badge className={getDifficultyColor(stats.difficulty)}>
                  {stats.difficulty}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Score</span>
                <span className="text-lg font-bold text-puzzle-gold">
                  {stats.score.toLocaleString()}
                </span>
              </div>

              {stats.rank && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Leaderboard Rank</span>
                  <div className="flex items-center gap-1 text-puzzle-aqua">
                    <Target className="h-4 w-4" />
                    <span className="font-bold">#{stats.rank}</span>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Hints Used</span>
                <span className="text-puzzle-white">{stats.hintsUsed}</span>
              </div>

              {/* Achievements */}
              {stats.achievements && stats.achievements.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">New Achievements</p>
                  <div className="flex flex-wrap gap-1">
                    {stats.achievements.map((achievement, index) => (
                      <Badge 
                        key={index}
                        variant="outline" 
                        className="text-xs text-puzzle-gold border-puzzle-gold/50"
                      >
                        <Award className="h-3 w-3 mr-1" />
                        {achievement}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2 pt-4">
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                className="text-puzzle-aqua border-puzzle-aqua/50 hover:bg-puzzle-aqua/10"
                onClick={onPlayAgain}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Play Again
              </Button>
              
              <Button
                variant="outline"
                className="text-puzzle-gold border-puzzle-gold/50 hover:bg-puzzle-gold/10"
                onClick={onViewLeaderboard}
              >
                <Trophy className="h-4 w-4 mr-2" />
                Leaderboard
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                className="text-puzzle-white border-muted hover:bg-muted/10"
                onClick={onShare}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              
              <Button
                variant="outline"
                className="text-muted-foreground border-muted hover:bg-muted/10"
                onClick={onReturnHome}
              >
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};