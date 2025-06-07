
import { useState, useCallback } from 'react';
import { MemoryCard, MemoryGameState, MemoryLayout, MemoryTheme, LAYOUT_CONFIGS, THEME_CONFIGS } from '../types/memoryTypes';

export function useMemoryGameLogic(initialLayout: MemoryLayout, initialTheme: MemoryTheme) {
  // Initialize all state hooks first - no conditional hooks
  const [layout, setLayout] = useState<MemoryLayout>(initialLayout);
  const [theme, setTheme] = useState<MemoryTheme>(initialTheme);
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<string[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [gameState, setGameState] = useState<MemoryGameState>('waiting');
  const [gameInitialized, setGameInitialized] = useState(false);
  
  const getGridSize = useCallback(() => {
    const config = LAYOUT_CONFIGS[layout];
    return { 
      rows: config.rows, 
      cols: config.cols, 
      totalPairs: config.totalCards / 2 
    };
  }, [layout]);

  const generateCards = useCallback((targetLayout: MemoryLayout, targetTheme: MemoryTheme): MemoryCard[] => {
    const config = LAYOUT_CONFIGS[targetLayout];
    const themeItems = [...THEME_CONFIGS[targetTheme].items]; // Convert readonly to mutable
    const pairsNeeded = config.totalCards / 2;
    
    // Select items for pairs
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
  }, []);

  const initializeGame = useCallback((newLayout?: MemoryLayout, newTheme?: MemoryTheme) => {
    const targetLayout = newLayout || layout;
    const targetTheme = newTheme || theme;
    
    setLayout(targetLayout);
    setTheme(targetTheme);
    setCards(generateCards(targetLayout, targetTheme));
    setGameState('waiting');
    setFlippedCards([]);
    setMatchedPairs([]);
    setMoves(0);
    setGameInitialized(true);
  }, [layout, theme, generateCards]);

  const handleCardFlip = useCallback((cardId: string) => {
    if (gameState !== 'playing' || flippedCards.length >= 2) return;
    if (flippedCards.includes(cardId) || matchedPairs.includes(cardId)) return;

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);
    setCards(prev => prev.map(card => 
      card.id === cardId ? { ...card, isFlipped: true } : card
    ));

    if (newFlippedCards.length === 2) {
      setMoves(prev => prev + 1);
      
      // Check for match after delay
      setTimeout(() => {
        const [firstId, secondId] = newFlippedCards;
        const firstCard = cards.find(c => c.id === firstId);
        const secondCard = cards.find(c => c.id === secondId);

        if (firstCard && secondCard && firstCard.value === secondCard.value) {
          // Match found
          const newMatchedPairs = [...matchedPairs, firstId, secondId];
          setMatchedPairs(newMatchedPairs);
          setCards(prev => prev.map(card => 
            (card.id === firstId || card.id === secondId) 
              ? { ...card, isMatched: true }
              : card
          ));
          
          // Check for game completion
          const config = LAYOUT_CONFIGS[layout];
          if (newMatchedPairs.length === config.totalCards) {
            setGameState('completed');
          }
        } else {
          // No match - flip cards back
          setTimeout(() => {
            setCards(prev => prev.map(card => 
              (card.id === firstId || card.id === secondId) 
                ? { ...card, isFlipped: false }
                : card
            ));
          }, 1000);
        }
        setFlippedCards([]);
      }, 500);
    }
  }, [gameState, flippedCards, matchedPairs, cards, layout]);

  const startGame = useCallback(() => {
    setGameState('playing');
  }, []);

  const resetGame = useCallback(() => {
    setGameState('waiting');
    setFlippedCards([]);
    setMatchedPairs([]);
    setMoves(0);
  }, []);

  return {
    // State
    layout,
    theme,
    cards,
    gameState,
    moves,
    matchedPairs: matchedPairs.length,
    gameInitialized,
    
    // Actions
    initializeGame,
    handleCardFlip,
    startGame,
    resetGame,
    getGridSize,
    
    // Computed
    isGameComplete: gameState === 'completed',
    isGameActive: gameState === 'playing',
    disabled: gameState !== 'playing' || flippedCards.length >= 2,
  };
}
