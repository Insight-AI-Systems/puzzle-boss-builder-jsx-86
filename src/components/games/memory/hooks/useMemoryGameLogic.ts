
import { useState, useCallback, useEffect } from 'react';
import { MemoryCard, MemoryGameState, MemoryLayout, MemoryTheme, LAYOUT_CONFIGS, THEME_CONFIGS } from '../types/memoryTypes';

export function useMemoryGameLogic(initialLayout: MemoryLayout, initialTheme: MemoryTheme) {
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
    const themeItems = [...THEME_CONFIGS[targetTheme].items];
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
    console.log('Card flip attempt:', cardId, 'gameState:', gameState);
    
    if (gameState !== 'playing') {
      console.log('Game not in playing state');
      return;
    }
    
    setFlippedCards(currentFlipped => {
      if (currentFlipped.length >= 2 || currentFlipped.includes(cardId)) {
        return currentFlipped;
      }
      
      const newFlipped = [...currentFlipped, cardId];
      console.log('New flipped cards:', newFlipped);
      
      // Update card state
      setCards(currentCards => 
        currentCards.map(card => 
          card.id === cardId ? { ...card, isFlipped: true } : card
        )
      );
      
      // Handle match checking
      if (newFlipped.length === 2) {
        setMoves(prev => prev + 1);
        
        setTimeout(() => {
          setCards(currentCards => {
            const [firstId, secondId] = newFlipped;
            const firstCard = currentCards.find(c => c.id === firstId);
            const secondCard = currentCards.find(c => c.id === secondId);

            if (firstCard && secondCard && firstCard.value === secondCard.value) {
              console.log('Match found!', firstCard.value);
              
              setMatchedPairs(prev => {
                const newMatched = [...prev, firstId, secondId];
                const config = LAYOUT_CONFIGS[layout];
                if (newMatched.length === config.totalCards) {
                  console.log('Game completed!');
                  setGameState('completed');
                }
                return newMatched;
              });
              
              return currentCards.map(card => 
                (card.id === firstId || card.id === secondId) 
                  ? { ...card, isMatched: true }
                  : card
              );
            } else {
              console.log('No match, flipping cards back');
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
          
          setFlippedCards([]);
        }, 100);
      }
      
      return newFlipped;
    });
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
    layout,
    theme,
    cards,
    gameState,
    moves,
    matchedPairs: matchedPairs.length,
    gameInitialized,
    initializeGame,
    handleCardFlip,
    startGame,
    resetGame,
    getGridSize,
    isGameComplete: gameState === 'completed',
    isGameActive: gameState === 'playing',
    disabled: gameState !== 'playing' || flippedCards.length >= 2,
  };
}
