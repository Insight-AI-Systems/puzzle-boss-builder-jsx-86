
import { useEffect } from 'react';
import { allPiecesCorrectlyRotated } from './utils/pieceRotationUtils';
import { PuzzlePiece, DifficultyLevel, GameMode } from './types/puzzle-types';

export function usePuzzleCompletion({
  pieces,
  puzzleState,
  gridSize,
  playSound,
  gameMode,
  rotationEnabled,
  isSolved
}: {
  pieces: PuzzlePiece[],
  puzzleState: any,
  gridSize: number,
  playSound: (sound: string) => void,
  gameMode: GameMode,
  rotationEnabled: boolean,
  isSolved: boolean
}) {
  useEffect(() => {
    // Check puzzle completion
    const isPuzzleSolved = () => {
      // Check if pieces are in correct positions
      const positionsCorrect = pieces.every((piece) => {
        const pieceNumber = parseInt(piece.id.split('-')[1]);
        return piece.position === pieceNumber;
      });

      // For challenge mode, also check rotations
      if (gameMode === 'challenge' || rotationEnabled) {
        return positionsCorrect && allPiecesCorrectlyRotated(pieces);
      }
      return positionsCorrect;
    };

    if (isPuzzleSolved() && !puzzleState.isComplete) {
      puzzleState.checkCompletion(gridSize * gridSize, gridSize * gridSize);
      playSound('complete');
    }
  }, [pieces, puzzleState, gridSize, playSound, gameMode, rotationEnabled]);
}
