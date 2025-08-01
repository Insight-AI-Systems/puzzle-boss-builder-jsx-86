
import { GameEngine } from '../engines/GameEngine';
import { BaseGameState, GameConfig, PlayerStats } from '../models/GameState';

// Service interface for managing game instances
export interface GameService<TGameState extends BaseGameState> {
  createGame(config: GameConfig): Promise<GameEngine<TGameState>>;
  saveGameState(gameId: string, state: TGameState): Promise<void>;
  loadGameState(gameId: string): Promise<TGameState | null>;
  getLeaderboard(gameType: string, limit?: number): Promise<PlayerStats[]>;
  submitScore(gameId: string, stats: PlayerStats): Promise<void>;
}

// Base implementation for common game service functionality
export abstract class BaseGameService<TGameState extends BaseGameState> implements GameService<TGameState> {
  abstract createGame(config: GameConfig): Promise<GameEngine<TGameState>>;

  async saveGameState(gameId: string, state: TGameState): Promise<void> {
    // Default implementation - can be overridden
    const savedGames = this.getSavedGames();
    savedGames[gameId] = state;
    localStorage.setItem('codecanyon_savedGames', JSON.stringify(savedGames));
  }

  async loadGameState(gameId: string): Promise<TGameState | null> {
    // Default implementation - can be overridden
    const savedGames = this.getSavedGames();
    return savedGames[gameId] || null;
  }

  async getLeaderboard(gameType: string, limit: number = 10): Promise<PlayerStats[]> {
    // This will be implemented with actual data access layer
    // For now, return empty array
    return [];
  }

  async submitScore(gameId: string, stats: PlayerStats): Promise<void> {
    // This will be implemented with actual data access layer
    console.log('Score submitted:', { gameId, stats });
  }

  private getSavedGames(): Record<string, TGameState> {
    const saved = localStorage.getItem('codecanyon_savedGames');
    return saved ? JSON.parse(saved) : {};
  }
}
