
import React, { useEffect } from 'react';
import { GameMode } from '../types/puzzle-types';

interface PuzzleCompletionHandlerProps {
  pieces: any[];
  puzzleState: any;
  gridSize: number;
  playSound: (sound: string) => void;
  gameMode: GameMode;
  rotationEnabled: boolean;
  isSolved: boolean;
  onComplete?: (stats: any) => void;
}

const PuzzleCompletionHandler: React.FC<PuzzleCompletionHandlerProps> = ({
  pieces,
  puzzleState,
  gridSize,
  playSound,
  gameMode,
  rotationEnabled,
  isSolved,
  onComplete
}) => {
  useEffect(() => {
    if (!isSolved && pieces.length > 0) {
      const correctCount = pieces.filter((piece) => {
        const pieceNumber = parseInt(piece.id.split('-')[1]);
        const positionCorrect = piece.position === pieceNumber;
        
        if (gameMode === 'challenge' || rotationEnabled) {
          const rotationCorrect = (piece.rotation || 0) === 0;
          return positionCorrect && rotationCorrect;
        }
        
        return positionCorrect;
      }).length;
      
      puzzleState.updateCorrectPieces(correctCount);
    }
  }, [pieces, isSolved, puzzleState, gameMode, rotationEnabled]);

  useEffect(() => {
    if (!isSolved && pieces.length > 0 && puzzleState.isActive) {
      const isPuzzleSolved = () => {
        const correctCount = pieces.filter((piece) => {
          const pieceNumber = parseInt(piece.id.split('-')[1]);
          const positionCorrect = piece.position === pieceNumber;
          
          if (gameMode === 'challenge' || rotationEnabled) {
            const rotationCorrect = (piece.rotation || 0) === 0;
            return positionCorrect && rotationCorrect;
          }
          
          return positionCorrect;
        }).length;

        return correctCount === pieces.length;
      };

      if (isPuzzleSolved()) {
        puzzleState.checkCompletion(gridSize * gridSize, gridSize * gridSize);
        playSound('complete');
        
        // Call completion handler with stats if provided
        if (onComplete) {
          onComplete({
            moves: puzzleState.moves || 0,
            timeElapsed: puzzleState.timeSpent || 0,
            score: puzzleState.score || 0,
            difficulty: gameMode,
            totalPieces: gridSize * gridSize,
            completed: true
          });
        }
      }
    }
  }, [pieces, isSolved, puzzleState, gridSize, playSound, gameMode, rotationEnabled, onComplete]);

  return null;
};

export default PuzzleCompletionHandler;
