
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Clock, Target, Star, Zap, Award } from 'lucide-react';
import { MemoryScoreData } from '../hooks/useMemoryScoring';

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
    <div className="space-y-4">
      {/* Main Score Display */}
      <Card className="bg-gray-900 border-gray-700">
        <CardContent className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Current Score */}
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

            {/* Moves Counter */}
            <div className="text-center p-3 bg-gray-800 rounded-lg relative">
              <Target className="w-6 h-6 text-puzzle-aqua mx-auto mb-1" />
              <div className="text-lg font-bold text-puzzle-white animate-pulse">
                {scoreData.moves}
              </div>
              <div className="text-xs text-gray-400">Moves</div>
              {scoreData.mistakes > 0 && (
                <div className="text-xs text-red-400 mt-1">
                  -{scoreData.mistakes} mistakes
                </div>
              )}
            </div>

            {/* Time */}
            <div className="text-center p-3 bg-gray-800 rounded-lg">
              <Clock className="w-6 h-6 text-purple-400 mx-auto mb-1" />
              <div className="text-lg font-bold text-puzzle-white">
                {formatTime(scoreData.timeElapsed)}
              </div>
              <div className="text-xs text-gray-400">Time</div>
            </div>

            {/* Accuracy */}
            <div className="text-center p-3 bg-gray-800 rounded-lg">
              <Star className={`w-6 h-6 mx-auto mb-1 ${getAccuracyColor(scoreData.accuracy)}`} />
              <div className={`text-lg font-bold ${getAccuracyColor(scoreData.accuracy)}`}>
                {scoreData.accuracy.toFixed(1)}%
              </div>
              <div className="text-xs text-gray-400">Accuracy</div>
            </div>
          </div>

          {/* Real-time Bonuses & Penalties */}
          {isGameActive && (scoreData.timeBonus > 0 || scoreData.mistakePenalty > 0) && (
            <div className="mt-3 flex flex-wrap gap-2 justify-center">
              {scoreData.timeBonus > 0 && (
                <Badge className="bg-emerald-600 text-white animate-pulse">
                  <Zap className="w-3 h-3 mr-1" />
                  Speed Bonus: +{scoreData.timeBonus}
                </Badge>
              )}
              {scoreData.mistakePenalty > 0 && (
                <Badge variant="destructive" className="animate-pulse">
                  Mistakes: -{scoreData.mistakePenalty}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detailed Score Breakdown */}
      {showDetailed && (
        <Card className="bg-gray-900 border-gray-700">
          <CardContent className="p-4">
            <h3 className="text-puzzle-white font-semibold mb-3 flex items-center gap-2">
              <Award className="w-4 h-4" />
              Score Breakdown
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Base Points:</span>
                <span className="text-puzzle-white">+{scoreData.basePoints}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Time Bonus:</span>
                <span className="text-emerald-400">+{scoreData.timeBonus}</span>
              </div>
              {scoreData.perfectGameBonus > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Perfect Game:</span>
                  <span className="text-puzzle-gold">+{scoreData.perfectGameBonus}</span>
                </div>
              )}
              {scoreData.mistakePenalty > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Mistake Penalty:</span>
                  <span className="text-red-400">-{scoreData.mistakePenalty}</span>
                </div>
              )}
              <div className="border-t border-gray-600 pt-2">
                <div className="flex justify-between font-semibold">
                  <span className="text-puzzle-white">Final Score:</span>
                  <span className={getScoreColor(scoreData.finalScore)}>
                    {scoreData.finalScore.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
