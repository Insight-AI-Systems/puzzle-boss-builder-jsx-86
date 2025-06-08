
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Target, Zap } from 'lucide-react';

interface GameScoreDisplayProps {
  score?: number;
  moves?: number;
  accuracy?: number;
  level?: string | number;
  showMoves?: boolean;
  showAccuracy?: boolean;
  showLevel?: boolean;
  className?: string;
}

export function GameScoreDisplay({
  score = 0,
  moves = 0,
  accuracy,
  level,
  showMoves = true,
  showAccuracy = false,
  showLevel = false,
  className = ''
}: GameScoreDisplayProps) {
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Trophy className="h-4 w-4" />
          Score
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-2xl font-bold tabular-nums">
          {score.toLocaleString()}
        </div>
        
        <div className="flex flex-wrap gap-2">
          {showMoves && (
            <Badge variant="outline" className="flex items-center gap-1">
              <Target className="h-3 w-3" />
              {moves} moves
            </Badge>
          )}
          
          {showAccuracy && accuracy !== undefined && (
            <Badge variant="outline" className="flex items-center gap-1">
              <Zap className="h-3 w-3" />
              {accuracy.toFixed(1)}%
            </Badge>
          )}
          
          {showLevel && level !== undefined && (
            <Badge variant="secondary">
              Level {level}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
