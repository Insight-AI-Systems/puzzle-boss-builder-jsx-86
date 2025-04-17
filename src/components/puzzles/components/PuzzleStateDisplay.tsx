
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Clock, Play, Pause, RefreshCw } from 'lucide-react';
import { DifficultyLevel, PuzzleState } from '../types/puzzle-types';

interface PuzzleStateDisplayProps {
  state: Omit<PuzzleState, 'difficulty'> & { 
    formattedTime: string;
    difficulty: DifficultyLevel;
  };
  totalPieces: number;
  onNewGame: () => void;
  onDifficultyChange: (difficulty: DifficultyLevel) => void;
  onTogglePause: () => void;
}

const PuzzleStateDisplay: React.FC<PuzzleStateDisplayProps> = ({
  state,
  totalPieces,
  onNewGame,
  onDifficultyChange,
  onTogglePause
}) => {
  const { 
    isComplete, 
    correctPieces, 
    formattedTime, 
    moveCount, 
    difficulty, 
    isActive 
  } = state;
  
  return (
    <div className="w-full max-w-[360px] bg-card rounded-lg p-3 mb-4 shadow-md">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <Clock className="w-4 h-4 mr-2 text-puzzle-aqua" />
          <span className="text-sm font-mono">{formattedTime}</span>
        </div>
        
        <div className="flex items-center space-x-1">
          <Button 
            size="sm" 
            variant="ghost"
            onClick={onTogglePause}
            disabled={isComplete}
            className="px-2"
          >
            {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          
          <Button 
            size="sm" 
            variant="ghost"
            onClick={onNewGame}
            className="px-2"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-2">
        <div className="text-sm">
          Moves: <span className="font-semibold">{moveCount}</span>
        </div>
        <div className="text-sm">
          Progress: <span className="font-semibold">{correctPieces}/{totalPieces}</span>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <span className="text-sm mr-2">Difficulty:</span>
        <Select 
          value={difficulty} 
          onValueChange={(value) => onDifficultyChange(value as DifficultyLevel)}
          disabled={isActive && !isComplete}
        >
          <SelectTrigger className="w-[140px] h-8 text-xs">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3x3">Easy (3×3)</SelectItem>
            <SelectItem value="4x4">Medium (4×4)</SelectItem>
            <SelectItem value="5x5">Hard (5×5)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {isComplete && (
        <div className="mt-2 text-center text-puzzle-gold font-bold animate-pulse">
          🏆 Puzzle Completed! 🏆
        </div>
      )}
    </div>
  );
};

export default PuzzleStateDisplay;
