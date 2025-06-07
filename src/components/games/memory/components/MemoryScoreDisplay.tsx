
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Clock, Target, Star } from 'lucide-react';

interface MemoryScoreData {
  finalScore: number;
  moves: number;
  timeElapsed: number;
  accuracy: number;
  isPerfectGame: boolean;
}

interface MemoryScoreDisplayProps {
  scoreData: MemoryScoreData;
  isGameActive: boolean;
  showDetailed?: boolean;
}

export function MemoryScoreDisplay({ 
  scoreData, 
  isGameActive, 
  showDetailed = false 
}: MemoryScoreDisplayProps) {
  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 90) return 'text-emerald-500';
    if (accuracy >= 75) return 'text-puzzle-gold';
    if (accuracy >= 60) return 'text-puzzle-aqua';
    return 'text-red-400';
  };

  const getScoreColor = (score: number) => {
    if (score >= 2000) return 'text-emerald-500';
    if (score >= 1500) return 'text-puzzle-gold';
    if (score >= 1000) return 'text-puzzle-aqua';
    return 'text-puzzle-white';
  };

  return (
    <Card className="bg-gray-900 border-gray-700">
      <CardContent className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-gray-800 rounded-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-puzzle-gold/10 to-transparent" />
            <Trophy className={`w-6 h-6 mx-auto mb-1 ${getScoreColor(scoreData.finalScore)}`} />
            <div className={`text-lg font-bold ${getScoreColor(scoreData.finalScore)}`}>
              {scoreData.finalScore.toLocaleString()}
            </div>
            <div className="text-xs text-gray-400">Score</div>
            {scoreData.isPerfectGame && (
              <Badge className="absolute -top-1 -right-1 bg-puzzle-gold text-puzzle-black text-xs">
                Perfect!
              </Badge>
            )}
          </div>

          <div className="text-center p-3 bg-gray-800 rounded-lg">
            <Target className="w-6 h-6 text-puzzle-aqua mx-auto mb-1" />
            <div className="text-lg font-bold text-puzzle-white">
              {scoreData.moves}
            </div>
            <div className="text-xs text-gray-400">Moves</div>
          </div>

          <div className="text-center p-3 bg-gray-800 rounded-lg">
            <Clock className="w-6 h-6 text-purple-400 mx-auto mb-1" />
            <div className="text-lg font-bold text-puzzle-white">
              {formatTime(scoreData.timeElapsed)}
            </div>
            <div className="text-xs text-gray-400">Time</div>
          </div>

          <div className="text-center p-3 bg-gray-800 rounded-lg">
            <Star className={`w-6 h-6 mx-auto mb-1 ${getAccuracyColor(scoreData.accuracy)}`} />
            <div className={`text-lg font-bold ${getAccuracyColor(scoreData.accuracy)}`}>
              {scoreData.accuracy.toFixed(1)}%
            </div>
            <div className="text-xs text-gray-400">Accuracy</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
