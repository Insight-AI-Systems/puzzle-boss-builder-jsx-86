
// Central export for all business models
export * from './User';
export * from './Game';
// Export GameState but rename GameConfig to avoid conflicts
export { 
  BaseGameState, 
  PlayerStats, 
  MoveValidationResult, 
  WinConditionResult, 
  GameEvent 
} from './GameState';
export type { GameConfig } from './GameState';
