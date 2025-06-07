
import { useState, useCallback, useEffect } from 'react';
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
    
    console.log('Initializing memory game:', { targetLayout, targetTheme });
    
    setLayout(targetLayout);
    setTheme(targetTheme);
    
    const newCards = generateCards(targetLayout, targetTheme);
    console.log('Generated cards:', newCards.length);
    
    setCards(newCards);
    setGameState('waiting');
    setFlippedCards([]);
    setMatchedPairs([]);
    setMoves(0);
    setGameInitialized(true);
  }, [layout, theme, generateCards]);

  // Auto-initialize on mount
  useEffect(() => {
    if (!gameInitialized) {
      console.log('Auto-initializing memory game on mount');
      initializeGame();
    }
  }, [initializeGame, gameInitialized]);

  const handleCardFlip = useCallback((cardId: string) => {
    console.log('Card flip attempt:', cardId, 'gameState:', gameState, 'flippedCards:', flippedCards.length);
    
    if (gameState !== 'playing') {
      console.log('Game not in playing state');
      return;
    }
    
    if (flippedCards.length >= 2) {
      console.log('Already have 2 flipped cards');
      return;
    }
    
    if (flippedCards.includes(cardId)) {
      console.log('Card already flipped');
      return;
    }

    setFlippedCards(prev => {
      const newFlippedCards = [...prev, cardId];
      console.log('New flipped cards:', newFlippedCards);
      return newFlippedCards;
    });
    
    setCards(prev => prev.map(card => 
      card.id === cardId ? { ...card, isFlipped: true } : card
    ));

    // Use setTimeout to handle match checking after state updates
    setTimeout(() => {
      setFlippedCards(currentFlipped => {
        if (currentFlipped.length === 2) {
          setMoves(prev => prev + 1);
          
          const [firstId, secondId] = currentFlipped;
          
          // Get current card values
          setCards(currentCards => {
            const firstCard = currentCards.find(c => c.id === firstId);
            const secondCard = currentCards.find(c => c.id === secondId);

            if (firstCard && secondCard && firstCard.value === secondCard.value) {
              console.log('Match found!', firstCard.value);
              
              // Match found - mark as matched
              const updatedCards = currentCards.map(card => 
                (card.id === firstId || card.id === secondId) 
                  ? { ...card, isMatched: true }
                  : card
              );
              
              // Update matched pairs and check for completion
              setMatchedPairs(prevMatched => {
                const newMatchedPairs = [...prevMatched, firstId, secondId];
                console.log('Matched pairs count:', newMatchedPairs.length);
                
                // Check for game completion
                const config = LAYOUT_CONFIGS[layout];
                if (newMatchedPairs.length === config.totalCards) {
                  console.log('Game completed!');
                  setGameState('completed');
                }
                
                return newMatchedPairs;
              });
              
              return updatedCards;
            } else {
              console.log('No match, flipping cards back');
              
              // No match - flip cards back after delay
              setTimeout(() => {
                setCards(prev => prev.map(card => 
                  (card.id === firstId || card.id === secondId) 
                    ? { ...card, isFlipped: false }
                    : card
                ));
              }, 1000);
              
              return currentCards;
            }
          });
          
          return []; // Clear flipped cards
        }
        
        return currentFlipped;
      });
    }, 100); // Small delay to ensure state is updated
  }, [gameState, layout]);

  const startGame = useCallback(() => {
    console.log('Starting game');
    setGameState('playing');
  }, []);

  const resetGame = useCallback(() => {
    console.log('Resetting game');
    setGameState('waiting');
    setFlippedCards([]);
    setMatchedPairs([]);
    setMoves(0);
    setCards(prev => prev.map(card => ({ 
      ...card, 
      isFlipped: false, 
      isMatched: false 
    })));
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
