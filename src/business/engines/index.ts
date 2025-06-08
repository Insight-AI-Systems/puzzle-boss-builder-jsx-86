
// Central export for all game engines
export { GameEngine } from './GameEngine';
export type { BaseGameState, PlayerStats, GameConfig, MoveValidationResult, WinConditionResult, GameEvent } from '../models/GameState';

// Specific game engines
export { WordSearchEngine } from './word-search';
export type { WordSearchState, PlacedWord, WordSearchMove } from './word-search';

export { CrosswordEngine } from './crossword';
export type { CrosswordState, CrosswordPuzzle, CrosswordProgress, CrosswordCell, CrosswordWord, CrosswordClue, CrosswordMove } from './crossword';
