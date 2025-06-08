
// Export all model types and interfaces
export type { BaseGameState, PlayerStats, GameConfig, MoveValidationResult, WinConditionResult, GameEvent } from './GameState';
export type { User, UserRole, UserStats } from './User';
export type { Game, GameStatus, GameDifficulty } from './Game';

// Export services and engines
export type { GameEngine } from '../engines/GameEngine';
export type { CrosswordEngine } from '../engines/crossword/CrosswordEngine';
export type { WordSearchEngine } from '../engines/word-search/WordSearchEngine';
export type { GameService } from '../services/GameService';
export type { PaymentService } from '../services/PaymentService';
