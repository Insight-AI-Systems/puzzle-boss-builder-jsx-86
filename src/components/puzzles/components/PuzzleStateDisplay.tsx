
import React from 'react';
import { Button } from '@/components/ui/button';
import { DifficultyLevel } from '../types/puzzle-types';
import { Pause, Play, RefreshCw } from 'lucide-react';

interface PuzzleStateDisplayProps {
  state: {
    isActive: boolean;
    isComplete: boolean;
    timeSpent: number;
    moveCount: number;
    correctPieces: number;
    difficulty: DifficultyLevel;
  };
  totalPieces: number;
  onNewGame: () => void;
  onDifficultyChange: (difficulty: DifficultyLevel) => void;
  onTogglePause: () => void;
  isMobile?: boolean;
}

const PuzzleStateDisplay: React.FC<PuzzleStateDisplayProps> = ({
  state,
  totalPieces,
  onNewGame,
  onDifficultyChange,
  onTogglePause,
  isMobile = false
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // For mobile use a more compact layout
  if (isMobile) {
    return (
      <div className="w-full bg-puzzle-black/40 p-2 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <div className="flex space-x-1">
            <Button 
              size="icon" 
              variant="outline" 
              onClick={onTogglePause}
              className="h-8 w-8"
            >
              {state.isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button 
              size="icon" 
              variant="outline" 
              onClick={onNewGame}
              className="h-8 w-8"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex flex-col items-end">
            <span className="text-xs text-puzzle-aqua">Time: {formatTime(state.timeSpent)}</span>
            <span className="text-xs text-puzzle-aqua">Moves: {state.moveCount}</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="text-xs text-puzzle-aqua">
            Progress: {state.correctPieces}/{totalPieces} pieces
          </div>
          
          <div className="flex space-x-1">
            {(['3x3', '4x4', '5x5'] as DifficultyLevel[]).map((diff) => (
              <Button 
                key={diff}
                size="sm"
                variant={state.difficulty === diff ? "default" : "outline"}
                onClick={() => onDifficultyChange(diff)}
                className="h-6 px-1.5 text-xs"
              >
                {diff}
              </Button>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  // Desktop layout
  return (
    <div className="w-full bg-puzzle-black/40 p-4 rounded-lg">
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={onTogglePause}
            className="space-x-1"
          >
            {state.isActive ? 
              <><Pause className="h-4 w-4" /><span>Pause</span></> : 
              <><Play className="h-4 w-4" /><span>Resume</span></>
            }
          </Button>
          
          <Button 
            variant="outline" 
            onClick={onNewGame}
            className="space-x-1"
          >
            <RefreshCw className="h-4 w-4" />
            <span>New Game</span>
          </Button>
        </div>
        
        <div className="flex space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-puzzle-aqua">Difficulty:</span>
            <div className="flex space-x-1">
              {(['3x3', '4x4', '5x5'] as DifficultyLevel[]).map((diff) => (
                <Button 
                  key={diff}
                  size="sm"
                  variant={state.difficulty === diff ? "default" : "outline"}
                  onClick={() => onDifficultyChange(diff)}
                >
                  {diff}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between mt-2">
        <div className="flex space-x-4">
          <div className="text-sm text-puzzle-aqua">
            Time: <span className="font-bold">{formatTime(state.timeSpent)}</span>
          </div>
          <div className="text-sm text-puzzle-aqua">
            Moves: <span className="font-bold">{state.moveCount}</span>
          </div>
        </div>
        
        <div className="text-sm text-puzzle-aqua">
          Progress: <span className="font-bold">{state.correctPieces}/{totalPieces}</span> pieces
        </div>
      </div>
    </div>
  );
};

export default PuzzleStateDisplay;
