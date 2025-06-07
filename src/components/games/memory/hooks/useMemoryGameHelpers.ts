
import { MemoryCard, MemoryLayout, MemoryTheme, LAYOUT_CONFIGS, THEME_CONFIGS } from '../types/memoryTypes';

// Shuffle algorithm for random card placement
export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Generate cards for the current layout and theme
export const generateCards = (layout: MemoryLayout, theme: MemoryTheme): MemoryCard[] => {
  const { totalCards } = LAYOUT_CONFIGS[layout];
  const themeItems = THEME_CONFIGS[theme].items;
  const pairsNeeded = totalCards / 2;
  
  // Select random items from theme
  const selectedItems = shuffleArray(themeItems).slice(0, pairsNeeded);
  
  // Create pairs
  const cardValues = [...selectedItems, ...selectedItems];
  
  // Shuffle and create card objects
  const shuffledValues = shuffleArray(cardValues);
  
  return shuffledValues.map((value, index) => ({
    id: `card-${index}`,
    value,
    isFlipped: false,
    isMatched: false
  }));
};

// Check if two cards match and update them
export const processCardMatch = (
  cards: MemoryCard[], 
  firstCardId: string, 
  secondCardId: string
): { updatedCards: MemoryCard[], isMatch: boolean } => {
  const firstCard = cards.find(card => card.id === firstCardId);
  const secondCard = cards.find(card => card.id === secondCardId);
  
  if (!firstCard || !secondCard) {
    return { updatedCards: cards, isMatch: false };
  }
  
  const isMatch = firstCard.value === secondCard.value;
  
  if (isMatch) {
    const updatedCards = cards.map(card => {
      if (card.id === firstCardId || card.id === secondCardId) {
        return { ...card, isMatched: true };
      }
      return card;
    });
    return { updatedCards, isMatch: true };
  }
  
  return { updatedCards: cards, isMatch: false };
};

// Calculate game statistics
export const calculateGameStats = (
  gameState: any,
  layout: MemoryLayout
) => {
  const totalPairs = LAYOUT_CONFIGS[layout].totalCards / 2;
  const timeElapsed = gameState.startTime ? Date.now() - gameState.startTime : 0;
  const accuracy = gameState.moves > 0 ? (gameState.matchedPairs / gameState.moves) * 100 : 0;
  
  return {
    moves: gameState.moves,
    timeElapsed,
    matchedPairs: gameState.matchedPairs,
    totalPairs,
    accuracy
  };
};
