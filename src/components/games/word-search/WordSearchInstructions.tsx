
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Target, AlertTriangle, Trophy, Zap, Shield } from 'lucide-react';

interface WordSearchInstructionsProps {
  difficulty: 'rookie' | 'pro' | 'master';
  category: string;
  totalWords: number;
  competitive?: boolean;
}

export const WordSearchInstructions: React.FC<WordSearchInstructionsProps> = ({
  difficulty,
  category,
  totalWords,
  competitive = false
}) => {
  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'rookie':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'pro':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'master':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getTimeLimit = () => {
    switch (difficulty) {
      case 'rookie': return '6:00';
      case 'pro': return '8:00';
      case 'master': return '10:00';
      default: return '6:00';
    }
  };

  return (
    <Card className="bg-gray-900 border-gray-700">
      <CardHeader>
        <CardTitle className="text-puzzle-white flex items-center gap-2">
          <Target className="h-5 w-5" />
          {competitive ? 'Competitive Rules' : 'How to Play'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Game Info */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge className={getDifficultyColor(difficulty)}>
            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Difficulty
          </Badge>
          <Badge className="bg-puzzle-aqua/20 text-puzzle-aqua border-puzzle-aqua/50">
            {category}
          </Badge>
          <Badge className="bg-puzzle-gold/20 text-puzzle-gold border-puzzle-gold/50">
            {totalWords} Words
          </Badge>
          <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/50">
            <Clock className="h-3 w-3 mr-1" />
            {getTimeLimit()} Time Limit
          </Badge>
        </div>

        {/* Basic Instructions */}
        <div className="space-y-3">
          <h4 className="font-semibold text-puzzle-white">Basic Gameplay:</h4>
          <ul className="text-sm text-gray-300 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-puzzle-aqua">1.</span>
              Find all hidden words in the letter grid
            </li>
            <li className="flex items-start gap-2">
              <span className="text-puzzle-aqua">2.</span>
              Click and drag to select words (horizontal, vertical, or diagonal)
            </li>
            <li className="flex items-start gap-2">
              <span className="text-puzzle-aqua">3.</span>
              Words can be spelled forwards or backwards
            </li>
            <li className="flex items-start gap-2">
              <span className="text-puzzle-aqua">4.</span>
              {competitive ? 'Find ALL words as fast as possible!' : 'Find as many words as you can before time runs out'}
            </li>
          </ul>
        </div>

        {/* Competitive Features */}
        {competitive && (
          <div className="space-y-3 p-4 bg-puzzle-gold/10 border border-puzzle-gold/30 rounded-lg">
            <h4 className="font-semibold text-puzzle-gold flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Competitive Features:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-gray-300">
                <Clock className="h-4 w-4 text-puzzle-aqua" />
                <span>Precision timing to milliseconds</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Target className="h-4 w-4 text-puzzle-gold" />
                <span>ALL words required to complete</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <AlertTriangle className="h-4 w-4 text-red-400" />
                <span>Penalty system (-50 pts per mistake)</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Zap className="h-4 w-4 text-puzzle-aqua" />
                <span>Auto-submit when complete</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Shield className="h-4 w-4 text-green-400" />
                <span>Auto-save protection</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Trophy className="h-4 w-4 text-puzzle-gold" />
                <span>Real-time leaderboard</span>
              </div>
            </div>
          </div>
        )}

        {/* Scoring System */}
        {competitive && (
          <div className="space-y-3 p-4 bg-puzzle-aqua/10 border border-puzzle-aqua/30 rounded-lg">
            <h4 className="font-semibold text-puzzle-aqua">Scoring System:</h4>
            <div className="text-sm text-gray-300 space-y-1">
              <div className="flex justify-between">
                <span>Base Score:</span>
                <span className="text-puzzle-white">1,000 points</span>
              </div>
              <div className="flex justify-between">
                <span>Time Bonus:</span>
                <span className="text-green-400">+10 pts per second remaining</span>
              </div>
              <div className="flex justify-between">
                <span>Perfect Completion:</span>
                <span className="text-puzzle-gold">+500 bonus points</span>
              </div>
              <div className="flex justify-between">
                <span>Incorrect Selection:</span>
                <span className="text-red-400">-50 points each</span>
              </div>
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="space-y-2">
          <h4 className="font-semibold text-puzzle-white">Tips:</h4>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• Look for common word patterns and endings</li>
            <li>• Scan systematically (horizontal, then vertical, then diagonal)</li>
            <li>• {competitive ? 'Avoid random clicking to prevent penalties' : 'Take your time to avoid mistakes'}</li>
            <li>• {competitive ? 'Focus on accuracy over speed for better scores' : 'Longer words are usually worth more points'}</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
