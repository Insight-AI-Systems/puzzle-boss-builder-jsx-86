
export type MemoryDifficulty = 'easy' | 'medium' | 'hard';
export type MemoryLayout = '3x4' | '4x5' | '5x6';
export type MemoryTheme = 'animals' | 'shapes' | 'numbers' | 'colors';

export interface MemoryCard {
  id: string;
  value: string;
  isFlipped: boolean;
  isMatched: boolean;
  icon?: string;
  color?: string;
}

export interface MemoryGameState {
  cards: MemoryCard[];
  selectedCards: string[];
  matchedPairs: number;
  moves: number;
  startTime: number;
  isGameComplete: boolean;
  layout: MemoryLayout;
  theme: MemoryTheme;
}

export interface MemoryGameStats {
  moves: number;
  timeElapsed: number;
  matchedPairs: number;
  totalPairs: number;
  accuracy: number;
}

export const LAYOUT_CONFIGS = {
  '3x4': { rows: 3, cols: 4, totalCards: 12 },
  '4x5': { rows: 4, cols: 5, totalCards: 20 },
  '5x6': { rows: 5, cols: 6, totalCards: 30 }
};

export const THEME_CONFIGS = {
  animals: {
    name: 'Animals',
    items: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐸', '🐵', '🐔', '🐧'],
    background: 'bg-green-50'
  },
  shapes: {
    name: 'Shapes',
    items: ['⭐', '🔴', '🔵', '🟡', '🟢', '🟣', '🟠', '⚫', '⚪', '🔷', '🔶', '🔺', '🔻', '◆', '◇'],
    background: 'bg-blue-50'
  },
  numbers: {
    name: 'Numbers',
    items: ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟', '0️⃣', '💯', '🔢', '➕', '➖'],
    background: 'bg-purple-50'
  },
  colors: {
    name: 'Colors',
    items: ['🔴', '🟠', '🟡', '🟢', '🔵', '🟣', '🟤', '⚫', '⚪', '🔘', '🔳', '🔲', '🟥', '🟧', '🟨'],
    background: 'bg-pink-50'
  }
};
