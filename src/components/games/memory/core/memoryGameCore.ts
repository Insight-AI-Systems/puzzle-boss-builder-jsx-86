
import { MemoryCard, MemoryLayout, MemoryTheme, LAYOUT_CONFIGS, THEME_CONFIGS } from '../types/memoryTypes';

export type GameState = 'idle' | 'ready' | 'playing' | 'completed';

export interface GameCoreState {
  cards: MemoryCard[];
  flippedCards: string[];
  matchedPairs: string[];
  moves: number;
  state: GameState;
}

// Pure game logic functions
export const createInitialState = (): GameCoreState => ({
  cards: [],
  flippedCards: [],
  matchedPairs: [],
  moves: 0,
  state: 'idle'
});

export const generateCards = (layout: MemoryLayout, theme: MemoryTheme): MemoryCard[] => {
  const config = LAYOUT_CONFIGS[layout];
  const themeItems = [...THEME_CONFIGS[theme].items];
  const pairsNeeded = config.totalCards / 2;
  
  const selectedItems = themeItems.slice(0, pairsNeeded);
  const cardValues = [...selectedItems, ...selectedItems];
  
  // Shuffle cards
  for (let i = cardValues.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cardValues[i], cardValues[j]] = [cardValues[j], cardValues[i]];
  }

  return cardValues.map((value, index) => ({
    id: `card-${index}`,
    value: value as string,
    isFlipped: false,
    isMatched: false,
  }));
};

export const canFlipCard = (cardId: string, state: GameCoreState): boolean => {
  if (state.state !== 'playing') return false;
  if (state.flippedCards.length >= 2) return false;
  if (state.flippedCards.includes(cardId)) return false;
  
  const card = state.cards.find(c => c.id === cardId);
  return card ? !card.isMatched : false;
};

export const flipCard = (cardId: string, state: GameCoreState): GameCoreState => {
  if (!canFlipCard(cardId, state)) return state;
  
  const newFlippedCards = [...state.flippedCards, cardId];
  const updatedCards = state.cards.map(card => 
    card.id === cardId ? { ...card, isFlipped: true } : card
  );
  
  return {
    ...state,
    cards: updatedCards,
    flippedCards: newFlippedCards
  };
};

export const processMatch = (state: GameCoreState): GameCoreState => {
  if (state.flippedCards.length !== 2) return state;
  
  const [firstId, secondId] = state.flippedCards;
  const firstCard = state.cards.find(c => c.id === firstId);
  const secondCard = state.cards.find(c => c.id === secondId);
  
  if (!firstCard || !secondCard) return state;
  
  const isMatch = firstCard.value === secondCard.value;
  const newMoves = state.moves + 1;
  
  if (isMatch) {
    const newMatchedPairs = [...state.matchedPairs, firstId, secondId];
    const updatedCards = state.cards.map(card => 
      (card.id === firstId || card.id === secondId) 
        ? { ...card, isMatched: true }
        : card
    );
    
    const totalCards = state.cards.length;
    const isGameComplete = newMatchedPairs.length === totalCards;
    
    return {
      ...state,
      cards: updatedCards,
      matchedPairs: newMatchedPairs,
      flippedCards: [],
      moves: newMoves,
      state: isGameComplete ? 'completed' : 'playing'
    };
  } else {
    // No match - cards will be flipped back by UI after delay
    return {
      ...state,
      flippedCards: [],
      moves: newMoves
    };
  }
};

export const flipCardsBack = (cardIds: string[], state: GameCoreState): GameCoreState => ({
  ...state,
  cards: state.cards.map(card => 
    cardIds.includes(card.id) ? { ...card, isFlipped: false } : card
  )
});

export const initializeGame = (layout: MemoryLayout, theme: MemoryTheme): GameCoreState => ({
  cards: generateCards(layout, theme),
  flippedCards: [],
  matchedPairs: [],
  moves: 0,
  state: 'ready'
});

export const startGame = (state: GameCoreState): GameCoreState => ({
  ...state,
  state: 'playing'
});

export const resetGame = (state: GameCoreState): GameCoreState => ({
  ...state,
  cards: state.cards.map(card => ({ ...card, isFlipped: false, isMatched: false })),
  flippedCards: [],
  matchedPairs: [],
  moves: 0,
  state: 'ready'
});
