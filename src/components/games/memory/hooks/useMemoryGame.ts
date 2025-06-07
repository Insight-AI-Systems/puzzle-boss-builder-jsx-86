
import { useState, useCallback, useEffect } from 'react';
import { MemoryCard, MemoryGameState, MemoryLayout, MemoryTheme, LAYOUT_CONFIGS, THEME_CONFIGS } from '../types/memoryTypes';

export function useMemoryGame(initialLayout: MemoryLayout = '3x4', initialTheme: MemoryTheme = 'animals') {
  const [gameState, setGameState] = useState<MemoryGameState>(() => ({
    cards: [],
    selectedCards: [],
    matchedPairs: 0,
    moves: 0,
    startTime: 0,
    isGameComplete: false,
    layout: initialLayout,
    theme: initialTheme
  }));

  const [gameInitialized, setGameInitialized] = useState(false);

  // Shuffle algorithm for random card placement
  const shuffleArray = <T>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Generate cards for the current layout and theme
  const generateCards = useCallback((layout: MemoryLayout, theme: MemoryTheme): MemoryCard[] => {
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
  }, []);

  // Initialize or restart game
  const initializeGame = useCallback((layout?: MemoryLayout, theme?: MemoryTheme) => {
    const newLayout = layout || gameState.layout;
    const newTheme = theme || gameState.theme;
    const cards = generateCards(newLayout, newTheme);
    
    setGameState({
      cards,
      selectedCards: [],
      matchedPairs: 0,
      moves: 0,
      startTime: Date.now(),
      isGameComplete: false,
      layout: newLayout,
      theme: newTheme
    });
    
    setGameInitialized(true);
    console.log(`Memory game initialized: ${newLayout} ${newTheme}`, { cardsCount: cards.length });
  }, [generateCards]);

  // Handle card click
  const handleCardClick = useCallback((cardId: string) => {
    if (!gameInitialized) {
      console.log('Game not initialized, cannot click cards');
      return;
    }

    setGameState(prevState => {
      const { cards, selectedCards, moves } = prevState;
      
      // Can't select more than 2 cards at once
      if (selectedCards.length >= 2) {
        return prevState;
      }
      
      // Can't select already flipped or matched cards
      const clickedCard = cards.find(card => card.id === cardId);
      if (!clickedCard || clickedCard.isFlipped || clickedCard.isMatched) {
        return prevState;
      }
      
      const newSelectedCards = [...selectedCards, cardId];
      const newCards = cards.map(card => 
        card.id === cardId ? { ...card, isFlipped: true } : card
      );
      
      let newMoves = moves;
      let newMatchedPairs = prevState.matchedPairs;
      
      // Check for match when 2 cards are selected
      if (newSelectedCards.length === 2) {
        newMoves += 1;
        const [firstCardId, secondCardId] = newSelectedCards;
        const firstCard = newCards.find(card => card.id === firstCardId);
        const secondCard = newCards.find(card => card.id === secondCardId);
        
        if (firstCard && secondCard && firstCard.value === secondCard.value) {
          // Match found
          newMatchedPairs += 1;
          newCards.forEach(card => {
            if (card.id === firstCardId || card.id === secondCardId) {
              card.isMatched = true;
            }
          });
          console.log('Match found!', { newMatchedPairs, totalPairs: LAYOUT_CONFIGS[prevState.layout].totalCards / 2 });
        }
      }
      
      return {
        ...prevState,
        cards: newCards,
        selectedCards: newSelectedCards,
        moves: newMoves,
        matchedPairs: newMatchedPairs
      };
    });
  }, [gameInitialized]);

  // Auto-flip unmatched cards after delay
  useEffect(() => {
    if (gameState.selectedCards.length === 2) {
      const timer = setTimeout(() => {
        setGameState(prevState => {
          const { cards, selectedCards } = prevState;
          const [firstCardId, secondCardId] = selectedCards;
          
          const newCards = cards.map(card => {
            if ((card.id === firstCardId || card.id === secondCardId) && !card.isMatched) {
              return { ...card, isFlipped: false };
            }
            return card;
          });
          
          return {
            ...prevState,
            cards: newCards,
            selectedCards: []
          };
        });
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [gameState.selectedCards]);

  // Check for game completion
  useEffect(() => {
    if (!gameInitialized) return;
    
    const totalPairs = LAYOUT_CONFIGS[gameState.layout].totalCards / 2;
    if (gameState.matchedPairs === totalPairs && totalPairs > 0) {
      console.log('Game completed!', { matchedPairs: gameState.matchedPairs, totalPairs });
      setGameState(prevState => ({
        ...prevState,
        isGameComplete: true
      }));
    }
  }, [gameState.matchedPairs, gameState.layout, gameInitialized]);

  // Calculate game stats
  const getGameStats = useCallback(() => {
    const totalPairs = LAYOUT_CONFIGS[gameState.layout].totalCards / 2;
    const timeElapsed = gameState.startTime ? Date.now() - gameState.startTime : 0;
    const accuracy = gameState.moves > 0 ? (gameState.matchedPairs / gameState.moves) * 100 : 0;
    
    return {
      moves: gameState.moves,
      timeElapsed,
      matchedPairs: gameState.matchedPairs,
      totalPairs,
      accuracy
    };
  }, [gameState]);

  // Initialize game immediately on mount
  useEffect(() => {
    console.log('Initializing memory game on mount');
    initializeGame();
  }, []);

  return {
    gameState,
    handleCardClick,
    initializeGame,
    getGameStats,
    isGameActive: gameInitialized && gameState.moves > 0 && !gameState.isGameComplete,
    disabled: gameState.selectedCards.length >= 2,
    gameInitialized
  };
}
