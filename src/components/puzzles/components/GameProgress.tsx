
import React from 'react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowPathIcon } from '@heroicons/react/24/solid';
import { PuzzleTimer } from '../PuzzleTimer';

interface GameProgressProps {
  completionPercentage: number;
  moves: number;
  elapsed: number;
  onReset: () => void;
}

export const GameProgress: React.FC<GameProgressProps> = ({
  completionPercentage,
  moves,
  elapsed,
  onReset
}) => {
  return (
    <div 
      role="region" 
      aria-label="Game Progress" 
      className="w-full flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6 space-y-4 sm:space-y-0"
    >
      <div className="flex flex-col w-full sm:w-2/3">
        <div className="flex justify-between mb-2">
          <span className="text-xs sm:text-sm font-medium">Progress: {Math.round(completionPercentage)}%</span>
          <span className="text-xs sm:text-sm font-medium">Moves: {moves}</span>
        </div>
        <Progress value={completionPercentage} className="h-2" />
      </div>
      
      <div className="flex items-center space-x-2 sm:space-x-4">
        <PuzzleTimer seconds={elapsed} />
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onReset}
          className="flex items-center text-xs sm:text-sm"
        >
          <ArrowPathIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
          Reset
        </Button>
      </div>
    </div>
  );
};
