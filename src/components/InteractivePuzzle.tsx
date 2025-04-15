
import React, { useRef, memo, useState } from 'react';
import PuzzlePiece from './puzzle/PuzzlePiece';
import SuccessOverlay from './puzzle/SuccessOverlay';
import PuzzleControls from './puzzle/PuzzleControls';
import { usePuzzle } from '../hooks/usePuzzle';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Clock, Move } from 'lucide-react';
import Loading from './ui/loading';

/**
 * Difficulty level options for the puzzle
 */
export type DifficultyLevel = 'easy' | 'medium' | 'hard';

/**
 * Mapping of difficulty levels to grid sizes
 */
const DIFFICULTY_GRID_SIZE: Record<DifficultyLevel, number> = {
  easy: 3,
  medium: 4,
  hard: 5
};

/**
 * Interactive puzzle component with game controls and piece management
 * @returns {JSX.Element} The interactive puzzle component
 */
const InteractivePuzzle = memo(() => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('medium');
  
  const {
    pieces,
    solved,
    gridSize,
    muted,
    draggedPiece,
    puzzleImage,
    elapsedTime,
    moveCount,
    isLoading,
    timerActive,
    hintsRemaining,
    showHint,
    setDraggedPiece,
    setMuted,
    shufflePuzzle,
    resetPuzzle,
    handleDrop,
    playSoundEffect,
    allowDrop,
    resetTimer,
    toggleTimer,
    activateHint,
    changeDifficulty
  } = usePuzzle({ 
    initialMuted: true, 
    initialDifficulty: difficulty
  });
  
  /**
   * Format time from seconds to MM:SS
   * @param {number} seconds - Time in seconds
   * @returns {string} Formatted time string
   */
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  /**
   * Handle difficulty change
   * @param {string} value - New difficulty level
   */
  const handleDifficultyChange = (value: string) => {
    const newDifficulty = value as DifficultyLevel;
    setDifficulty(newDifficulty);
    changeDifficulty(DIFFICULTY_GRID_SIZE[newDifficulty]);
  };
  
  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-xs mb-4">
        {/* Difficulty selector */}
        <div className="mb-4">
          <Select value={difficulty} onValueChange={handleDifficultyChange}>
            <SelectTrigger className="w-full border-puzzle-aqua focus:ring-puzzle-aqua">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="easy">Easy (3×3)</SelectItem>
              <SelectItem value="medium">Medium (4×4)</SelectItem>
              <SelectItem value="hard">Hard (5×5)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Game stats */}
        <div className="flex justify-between mb-2 text-puzzle-aqua">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{formatTime(elapsedTime)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Move className="w-4 h-4" />
            <span>{moveCount} moves</span>
          </div>
        </div>
        
        {/* Puzzle container */}
        <div 
          ref={containerRef}
          className={`relative aspect-square rounded-md overflow-hidden bg-puzzle-black/50 border-2 ${solved ? 'border-puzzle-gold' : 'border-puzzle-aqua'}`}
          onDragOver={allowDrop}
        >
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loading color="aqua" size="medium" />
            </div>
          ) : (
            <>
              {/* Puzzle pieces */}
              {pieces.map((piece) => (
                <PuzzlePiece
                  key={piece.id}
                  piece={piece}
                  puzzleImage={puzzleImage}
                  gridSize={gridSize}
                  draggedPiece={draggedPiece}
                  setDraggedPiece={setDraggedPiece}
                  playSound={playSoundEffect}
                  onDrop={(e) => handleDrop(e, piece.currentPosition.row, piece.currentPosition.col)}
                />
              ))}
              
              {/* Hint overlay - shows the completed puzzle temporarily */}
              {showHint && (
                <div 
                  className="absolute inset-0 bg-cover bg-center animate-fade-in" 
                  style={{ backgroundImage: `url(${puzzleImage})` }}
                />
              )}
              
              {/* Success overlay - only render when solved */}
              {solved && <SuccessOverlay />}
            </>
          )}
        </div>
      </div>
      
      {/* Controls */}
      <PuzzleControls 
        shufflePuzzle={shufflePuzzle}
        resetPuzzle={resetPuzzle}
        muted={muted}
        setMuted={setMuted}
        timerActive={timerActive}
        toggleTimer={toggleTimer}
        resetTimer={resetTimer}
        hintsRemaining={hintsRemaining}
        activateHint={activateHint}
      />
    </div>
  );
});

// Display name for debugging
InteractivePuzzle.displayName = 'InteractivePuzzle';

export default InteractivePuzzle;
