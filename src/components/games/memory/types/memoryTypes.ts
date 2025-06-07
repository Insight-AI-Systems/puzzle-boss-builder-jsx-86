
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
    items: [
      'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1452378174528-3090a4bba7b2?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1534361960057-19889db9621e?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=200&h=200&fit=crop'
    ],
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
