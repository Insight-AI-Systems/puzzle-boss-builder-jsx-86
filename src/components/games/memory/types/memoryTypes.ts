
// Layout configurations
export const LAYOUT_CONFIGS = {
  '2x2': { rows: 2, cols: 2, pieces: 4 },
  '3x4': { rows: 3, cols: 4, pieces: 12 },
  '4x4': { rows: 4, cols: 4, pieces: 16 },
  '4x5': { rows: 4, cols: 5, pieces: 20 },
  '5x6': { rows: 5, cols: 6, pieces: 30 },
  '6x6': { rows: 6, cols: 6, pieces: 36 },
} as const;

export type MemoryLayout = keyof typeof LAYOUT_CONFIGS;

// Theme configurations
export const THEME_CONFIGS = {
  animals: {
    name: 'Animals',
    background: 'bg-green-50',
    items: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐸', '🐵', '🐔', '🐧', '🦆', '🦋', '🐝', '🐞', '🦗', '🕷️', '🐢', '🐍']
  },
  fruits: {
    name: 'Fruits',
    background: 'bg-orange-50',
    items: ['🍎', '🍊', '🍋', '🍌', '🍇', '🍓', '🍈', '🍉', '🍑', '🍒', '🥝', '🍍', '🥭', '🍐', '🍅', '🥑', '🌶️', '🌽', '🥕', '🥒', '🥬', '🥦', '🧄', '🧅']
  },
  shapes: {
    name: 'Shapes',
    background: 'bg-blue-50',
    items: ['⭐', '🔴', '🔵', '🟡', '🟢', '🟣', '🟠', '⬛', '⬜', '🔶', '🔷', '🔸', '🔹', '💎', '💠', '🔺', '🔻', '🔳', '🔲', '▪️', '▫️', '◾', '◽', '◼️']
  },
  numbers: {
    name: 'Numbers',
    background: 'bg-purple-50',
    items: ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟', '🔢', '💯', '🆔', '🆕', '🆓', '🆒', '🆗', '🆙', '🔠', '🔡', '🔤', '🅰️', '🅱️', '🅾️']
  }
} as const;

export type MemoryTheme = keyof typeof THEME_CONFIGS;

// Game difficulty levels
export type GameDifficulty = 'easy' | 'medium' | 'hard';

// Game states
export type MemoryGameState = 'waiting' | 'playing' | 'completed' | 'failed';

// Card interface
export interface MemoryCard {
  id: string;
  value: string;
  isFlipped: boolean;
  isMatched: boolean;
}

// Game configuration
export interface MemoryGameConfig {
  layout: MemoryLayout;
  theme: MemoryTheme;
  difficulty?: GameDifficulty;
  timeLimit?: number;
}

// Score tracking
export interface MemoryScore {
  moves: number;
  timeElapsed: number;
  accuracy: number;
  baseScore: number;
  timeBonus: number;
  accuracyBonus: number;
  finalScore: number;
  isPerfectGame: boolean;
}

// Game statistics
export interface MemoryGameStats {
  totalGames: number;
  completedGames: number;
  averageTime: number;
  averageMoves: number;
  bestScore: number;
  perfectGames: number;
}
