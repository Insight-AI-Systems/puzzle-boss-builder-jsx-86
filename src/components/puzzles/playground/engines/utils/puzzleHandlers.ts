
import { Dispatch, SetStateAction } from 'react';
import { AssemblyPiece } from './puzzleStateUtils';

export type PuzzleHandlers = {
  handlePieceDrop: (pieceId: number, targetIdx: number) => void;
  handleRemoveFromAssembly: (pieceIdx: number) => void;
  handleStartIfFirstMove: () => void;
  handleReset: () => void;
  handleOnChange: () => void;
};

export function createPuzzleHandlers(
  placedPieces: (AssemblyPiece | null)[],
  setPlacedPieces: Dispatch<SetStateAction<(AssemblyPiece | null)[]>>,
  stagedPieces: number[],
  setStagedPieces: Dispatch<SetStateAction<number[]>>,
  hasStarted: boolean,
  setHasStarted: Dispatch<SetStateAction<boolean>>,
  completed: boolean,
  setCompleted: Dispatch<SetStateAction<boolean>>,
  startTimer: () => void,
  stopTimer: () => void,
  resetTimer: () => void,
  startTime: number | null,
  setStartTime: Dispatch<SetStateAction<number | null>>,
  setElapsed: Dispatch<SetStateAction<number>>,
  setSolveTime: Dispatch<SetStateAction<number | null>>,
  rows: number,
  columns: number
): PuzzleHandlers {
  
  // Puzzle start
  const handleStartIfFirstMove = () => {
    if (!hasStarted) {
      setHasStarted(true);
      startTimer();
      setStartTime(Date.now());
    }
  };
  
  // Handle piece drop in assembly area
  const handlePieceDrop = (pieceId: number, targetIdx: number) => {
    if (placedPieces[targetIdx] !== null) return;

    handleStartIfFirstMove();

    setPlacedPieces(prev => {
      let np = [...prev];

      // Remove this piece from any previous cell
      const fromAssemblyIdx = prev.findIndex(entry => entry && entry.id === pieceId && !entry.isLocked);
      if (fromAssemblyIdx !== -1) {
        np[fromAssemblyIdx] = null;
      }

      // Lock piece if placed in correct spot, otherwise allow free movement
      const shouldLock = pieceId === targetIdx;
      np[targetIdx] = { id: pieceId, isLocked: shouldLock };
      return np;
    });

    // Remove from staging if present
    setStagedPieces(prev => prev.filter(id => id !== pieceId));

    setTimeout(handleOnChange, 0);
  };

  // Remove piece from assembly back to staging
  const handleRemoveFromAssembly = (pieceIdx: number) => {
    const slot = placedPieces[pieceIdx];
    if (!slot || slot.isLocked) return;
    setPlacedPieces(prev => {
      const np = [...prev];
      np[pieceIdx] = null;
      return np;
    });
    setStagedPieces(prev => [...prev, slot.id]);
  };

  // Reset the puzzle
  const handleReset = () => {
    const total = rows * columns;
    setStagedPieces(Array.from({ length: total }, (_, i) => i));
    setPlacedPieces(Array.from({ length: total }, () => null));
    setCompleted(false);
    setHasStarted(false);
    setElapsed(0);
    setStartTime(null);
    setSolveTime(null);
    resetTimer();
  };

  // Check if puzzle is solved
  const handleOnChange = () => {
    const allLocked = placedPieces.every((entry, idx) => entry && entry.isLocked && entry.id === idx);
    if (allLocked && !completed) {
      setCompleted(true);
      const endTime = Date.now();
      if (startTime) {
        setSolveTime((endTime - startTime) / 1000);
        setElapsed(Math.floor((endTime - startTime) / 1000));
      }
      stopTimer();
    }
  };

  return {
    handlePieceDrop,
    handleRemoveFromAssembly,
    handleStartIfFirstMove,
    handleReset,
    handleOnChange
  };
}
