
// Export all game engines
export { GameEngine } from './GameEngine';
export { CrosswordEngine } from './crossword/CrosswordEngine';
export { WordSearchEngine } from './word-search/WordSearchEngine';

// Export all engine types
export type { 
  CrosswordState, 
  CrosswordPuzzle, 
  CrosswordProgress,
  CrosswordCell,
  CrosswordWord,
  CrosswordClue,
  CrosswordMove
} from './crossword/CrosswordEngine';

export type { 
  WordSearchState, 
  WordSearchMove 
} from './word-search/WordSearchEngine';

export type { 
  PlacedWord, 
  Cell 
} from './word-search/types';

export type { 
  BaseGameState, 
  PlayerStats, 
  GameConfig, 
  MoveValidationResult, 
  WinConditionResult, 
  GameEvent 
} from '../models/GameState';
