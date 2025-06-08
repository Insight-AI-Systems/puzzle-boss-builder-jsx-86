
import { BaseGameState, PlayerStats, GameConfig, MoveValidationResult, WinConditionResult, GameEvent } from '../models/GameState';

// Base abstract class that all game engines must implement
export abstract class GameEngine<TGameState extends BaseGameState, TMove = any> {
  protected gameState: TGameState;
  protected config: GameConfig;
  protected events: GameEvent[] = [];
  protected eventListeners: ((event: GameEvent) => void)[] = [];

  constructor(initialState: TGameState, config: GameConfig) {
    this.gameState = initialState;
    this.config = config;
  }

  // Core game engine methods that all games must implement
  abstract initialize(): Promise<void>;
  abstract start(): void;
  abstract validateMove(move: TMove): MoveValidationResult;
  abstract makeMove(move: TMove): void;
  abstract calculateScore(): number;
  abstract checkWinCondition(): WinConditionResult;
  abstract pause(): void;
  abstract resume(): void;
  abstract reset(): void;

  // Common game engine functionality
  getState(): TGameState {
    return { ...this.gameState };
  }

  getPlayerStats(): PlayerStats {
    return {
      startTime: this.gameState.startTime,
      solveTime: this.gameState.endTime && this.gameState.startTime 
        ? this.gameState.endTime - this.gameState.startTime 
        : null,
      moves: this.gameState.moves,
      hintsUsed: 0, // Override in specific implementations
    };
  }

  getConfig(): GameConfig {
    return { ...this.config };
  }

  updateConfig(newConfig: Partial<GameConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  // Event system for game state changes
  addEventListener(listener: (event: GameEvent) => void): void {
    this.eventListeners.push(listener);
  }

  removeEventListener(listener: (event: GameEvent) => void): void {
    const index = this.eventListeners.indexOf(listener);
    if (index > -1) {
      this.eventListeners.splice(index, 1);
    }
  }

  protected emitEvent(event: GameEvent): void {
    this.events.push(event);
    this.eventListeners.forEach(listener => listener(event));
  }

  getEvents(): GameEvent[] {
    return [...this.events];
  }

  // Common validation helpers
  protected isGameActive(): boolean {
    return this.gameState.status === 'playing';
  }

  protected isGameComplete(): boolean {
    return this.gameState.status === 'completed';
  }

  protected updateGameState(updates: Partial<TGameState>): void {
    this.gameState = { ...this.gameState, ...updates };
  }
}
