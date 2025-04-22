
// Re-export all puzzle state management utilities
export { ensureGridIntegrity, getStagingPieces } from './gridStateHelpers';
export { movePieceFromStagingToGrid } from './pieceMovementHelpers';
export { validatePuzzleState } from './puzzleStateValidation';
export { debugGridState } from './debugUtils';
