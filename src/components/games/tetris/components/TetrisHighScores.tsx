
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HighScore } from '../types/tetrisTypes';
import { Trophy, Clock, Target } from 'lucide-react';

interface TetrisHighScoresProps {
  highScores: HighScore[];
}

export function TetrisHighScores({ highScores }: TetrisHighScoresProps) {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-400" />
          High Scores
        </CardTitle>
      </CardHeader>
      <CardContent>
        {highScores.length === 0 ? (
          <div className="text-gray-400 text-center py-4">
            No high scores yet. Be the first!
          </div>
        ) : (
          <div className="space-y-3">
            {highScores.map((score, index) => (
              <div
                key={score.id}
                className={`
                  p-3 rounded-lg border transition-colors
                  ${index === 0 
                    ? 'bg-yellow-500/10 border-yellow-500/30' 
                    : index === 1
                    ? 'bg-gray-400/10 border-gray-400/30'
                    : index === 2
                    ? 'bg-orange-500/10 border-orange-500/30'
                    : 'bg-gray-700/30 border-gray-600/30'
                  }
                `}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`
                      text-sm font-bold
                      ${index === 0 ? 'text-yellow-400' : 
                        index === 1 ? 'text-gray-400' :
                        index === 2 ? 'text-orange-400' : 'text-gray-500'}
                    `}>
                      #{index + 1}
                    </span>
                    <span className="text-white font-semibold text-sm">
                      {score.username}
                    </span>
                  </div>
                  <span className="text-puzzle-aqua font-bold">
                    {score.score.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <div className="flex items-center gap-1">
                    <Target className="w-3 h-3" />
                    {score.lines} lines
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDuration(score.duration)}
                  </div>
                  <div>
                    Lv.{score.level}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
