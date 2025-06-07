
import { MemoryCard, MemoryLayout, MemoryTheme, MemoryGameState } from '../types/memoryTypes';

// Stable interface for useMemoryGame hook - DO NOT MODIFY WITHOUT VERSIONING
export interface MemoryGameHookInterface {
  // Game state
  gameState: {
    layout: MemoryLayout;
    theme: MemoryTheme;
    cards: MemoryCard[];
    isGameComplete: boolean;
    matchedPairs: number;
    moves: number;
  };
  
  // Game actions
  handleCardClick: (cardId: string) => void;
  initializeGame: (newLayout?: MemoryLayout, newTheme?: MemoryTheme) => void;
  startGame: () => void;
  resetGame: () => void;
  
  // Game stats and utilities
  getGameStats: () => {
    moves: number;
    timeElapsed: number;
    matchedPairs: number;
    totalPairs: number;
    accuracy: number;
  };
  
  // Game status
  isGameActive: boolean;
  disabled: boolean;
  gameInitialized: boolean;
  
  // Additional properties (for backward compatibility)
  cards: MemoryCard[];
  moves: number;
  gameTime: number;
  score: number;
  leaderboard: any[];
  flipCard: (cardId: string) => void;
  gridSize: {
    rows: number;
    cols: number;
    totalPairs: number;
  };
}

// Stable interface for memory game scoring
export interface MemoryGameScoringInterface {
  scoreData: {
    moves: number;
    timeElapsed: number;
    accuracy: number;
    baseScore: number;
    timeBonus: number;
    accuracyBonus: number;
    finalScore: number;
    isPerfectGame: boolean;
  };
  leaderboard: any[];
  personalBests: any[];
  updateScore: (matchedPairs: number, moves: number, timeElapsed: number) => any;
  submitToLeaderboard: (scoreData: any, playerName: string) => any;
  resetScore: () => void;
}

// Version tracking for interface changes
export const MEMORY_GAME_INTERFACE_VERSION = '1.0.0';
export const INTERFACE_LAST_UPDATED = '2025-01-07';
