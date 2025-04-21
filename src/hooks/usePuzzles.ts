import { usePuzzleQueries } from './puzzles/usePuzzleQueries';
import { usePuzzleMutations } from './puzzles/usePuzzleMutations';
import { checkPuzzleTableExists } from './puzzles/puzzleTableHelpers';
export type { Puzzle } from './puzzles/puzzleTypes';

// Compose and re-export all puzzle logic as before
export function usePuzzles() {
  const puzzlesQuery = usePuzzleQueries();
  const puzzleMutations = usePuzzleMutations();

  return {
    puzzles: puzzlesQuery.data || [],
    isLoading: puzzlesQuery.isLoading,
    isError: puzzlesQuery.isError,
    error: puzzlesQuery.error,
    createPuzzle: puzzleMutations.createPuzzle,
    updatePuzzle: puzzleMutations.updatePuzzle,
    deletePuzzle: puzzleMutations.deletePuzzle,
    checkPuzzleTableExists,
  };
}
