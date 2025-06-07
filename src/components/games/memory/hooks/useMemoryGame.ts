
import { useState, useCallback, useEffect } from 'react';
import { MemoryCard, MemoryGameState, MemoryLayout, MemoryTheme, LAYOUT_CONFIGS } from '../types/memoryTypes';
import { generateCards, processCardMatch, calculateGameStats } from './useMemoryGameHelpers';

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
  }, [gameState.layout, gameState.theme]);

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
        const { updatedCards, isMatch } = processCardMatch(newCards, firstCardId, secondCardId);
        
        if (isMatch) {
          newMatchedPairs += 1;
          newCards.splice(0, newCards.length, ...updatedCards);
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
    return calculateGameStats(gameState, gameState.layout);
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
