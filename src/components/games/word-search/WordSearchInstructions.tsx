
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Target, Clock, Trophy } from 'lucide-react';

interface WordSearchInstructionsProps {
  difficulty: 'rookie' | 'pro' | 'master';
  category: string;
  totalWords: number;
}

export function WordSearchInstructions({ difficulty, category, totalWords }: WordSearchInstructionsProps) {
  const getDifficultyInfo = () => {
    switch (difficulty) {
      case 'master':
        return { gridSize: '15x15', timeLimit: '10 minutes', color: 'text-purple-400' };
      case 'pro':
        return { gridSize: '12x12', timeLimit: '8 minutes', color: 'text-blue-400' };
      default:
        return { gridSize: '10x10', timeLimit: '6 minutes', color: 'text-green-400' };
    }
  };

  const diffInfo = getDifficultyInfo();

  return (
    <Card className="bg-gray-900 border-gray-700 mb-4">
      <CardHeader>
        <CardTitle className="text-puzzle-white flex items-center gap-2">
          <Search className="h-5 w-5 text-puzzle-aqua" />
          How to Play Word Search
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-puzzle-gold" />
              <span className="text-puzzle-white font-medium">Objective</span>
            </div>
            <p className="text-gray-300 text-sm">
              Find all {totalWords} hidden words in the {category} category within the grid.
            </p>
            
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-puzzle-aqua" />
              <span className="text-puzzle-white font-medium">How to Find Words</span>
            </div>
            <ul className="text-gray-300 text-sm space-y-1">
              <li>• Words can be horizontal, vertical, or diagonal</li>
              <li>• Words can be forwards or backwards</li>
              <li>• Click and drag to select a word</li>
              <li>• Found words will be highlighted</li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-puzzle-gold" />
              <span className="text-puzzle-white font-medium">Game Info</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Difficulty:</span>
                <span className={`font-medium ${diffInfo.color}`}>
                  {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Grid Size:</span>
                <span className="text-puzzle-white">{diffInfo.gridSize}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Time Limit:</span>
                <span className="text-puzzle-white">{diffInfo.timeLimit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Words to Find:</span>
                <span className="text-puzzle-white">{totalWords}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 mt-4">
              <Trophy className="h-4 w-4 text-puzzle-gold" />
              <span className="text-puzzle-white font-medium">Scoring</span>
            </div>
            <p className="text-gray-300 text-sm">
              Score points for each word found and complete faster for bonus points!
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
