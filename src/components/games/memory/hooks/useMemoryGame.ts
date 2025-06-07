
import { useState, useCallback, useEffect, useRef } from 'react';
import { MemoryCard, MemoryGameState, MemoryLayout, MemoryTheme, LAYOUT_CONFIGS } from '../types/memoryTypes';
import { generateCards, processCardMatch, calculateGameStats } from './useMemoryGameHelpers';

export function useMemoryGame(initialLayout: MemoryLayout = '3x4', initialTheme: MemoryTheme = 'animals') {
  const [gameState, setGameState] = useState<MemoryGameState>(() => {
    console.log('Initial game state creation:', { initialLayout, initialTheme });
    return {
      cards: [],
      selectedCards: [],
      matchedPairs: 0,
      moves: 0,
      startTime: 0,
      isGameComplete: false,
      layout: initialLayout,
      theme: initialTheme
    };
  });

  const [gameInitialized, setGameInitialized] = useState(false);
  const initializationRef = useRef(false);

  // Initialize or restart game
  const initializeGame = useCallback((layout?: MemoryLayout, theme?: MemoryTheme) => {
    const newLayout = layout || initialLayout;
    const newTheme = theme || initialTheme;
    
    console.log('=== INITIALIZING MEMORY GAME ===');
    console.log('Layout:', newLayout, 'Theme:', newTheme);
    
    const cards = generateCards(newLayout, newTheme);
    console.log('Generated cards:', cards.length, cards);
    
    const newGameState = {
      cards,
      selectedCards: [],
      matchedPairs: 0,
      moves: 0,
      startTime: Date.now(),
      isGameComplete: false,
      layout: newLayout,
      theme: newTheme
    };
    
    console.log('New game state:', newGameState);
    setGameState(newGameState);
    setGameInitialized(true);
    
    console.log('=== GAME INITIALIZATION COMPLETE ===');
  }, [initialLayout, initialTheme]);

  // Handle card click with extensive debugging
  const handleCardClick = useCallback((cardId: string) => {
    console.log('=== CARD CLICK HANDLER ===');
    console.log('Clicked card ID:', cardId);
    console.log('Game initialized:', gameInitialized);
    
    if (!gameInitialized) {
      console.log('❌ Game not initialized, cannot click cards');
      return;
    }

    setGameState(prevState => {
      console.log('Previous state:', prevState);
      
      const { cards, selectedCards, moves } = prevState;
      
      // Can't select more than 2 cards at once
      if (selectedCards.length >= 2) {
        console.log('❌ Already 2 cards selected, ignoring click');
        return prevState;
      }
      
      // Can't select already flipped or matched cards
      const clickedCard = cards.find(card => card.id === cardId);
      if (!clickedCard) {
        console.log('❌ Card not found:', cardId);
        return prevState;
      }
      
      if (clickedCard.isFlipped || clickedCard.isMatched) {
        console.log('❌ Card already flipped or matched, ignoring click');
        return prevState;
      }
      
      console.log('✅ Valid click, processing...');
      
      const newSelectedCards = [...selectedCards, cardId];
      const newCards = cards.map(card => 
        card.id === cardId ? { ...card, isFlipped: true } : card
      );
      
      console.log('Updated cards after flip:', newCards.find(c => c.id === cardId));
      
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
          console.log('🎉 Match found!', { newMatchedPairs, totalPairs: LAYOUT_CONFIGS[prevState.layout].totalCards / 2 });
        } else {
          console.log('❌ No match found');
        }
      }
      
      const newState = {
        ...prevState,
        cards: newCards,
        selectedCards: newSelectedCards,
        moves: newMoves,
        matchedPairs: newMatchedPairs
      };
      
      console.log('New state after click:', newState);
      console.log('=== END CARD CLICK HANDLER ===');
      
      return newState;
    });
  }, [gameInitialized]);

  // Auto-flip unmatched cards after delay
  useEffect(() => {
    if (gameState.selectedCards.length === 2) {
      console.log('Setting timer to flip back unmatched cards');
      const timer = setTimeout(() => {
        console.log('=== AUTO-FLIPPING UNMATCHED CARDS ===');
        setGameState(prevState => {
          const { cards, selectedCards } = prevState;
          const [firstCardId, secondCardId] = selectedCards;
          
          const newCards = cards.map(card => {
            if ((card.id === firstCardId || card.id === secondCardId) && !card.isMatched) {
              console.log('Flipping back card:', card.id);
              return { ...card, isFlipped: false };
            }
            return card;
          });
          
          const newState = {
            ...prevState,
            cards: newCards,
            selectedCards: []
          };
          
          console.log('Cards flipped back, new state:', newState);
          return newState;
        });
      }, 1000);
      
      return () => {
        console.log('Clearing flip timer');
        clearTimeout(timer);
      };
    }
  }, [gameState.selectedCards]);

  // Check for game completion
  useEffect(() => {
    if (!gameInitialized) return;
    
    const totalPairs = LAYOUT_CONFIGS[gameState.layout].totalCards / 2;
    if (gameState.matchedPairs === totalPairs && totalPairs > 0) {
      console.log('🎉 Game completed!', { matchedPairs: gameState.matchedPairs, totalPairs });
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

  // Initialize game on mount (only once)
  useEffect(() => {
    if (!initializationRef.current) {
      console.log('🚀 Initializing memory game on mount');
      initializationRef.current = true;
      initializeGame();
    }
  }, [initializeGame]);

  // Debug current state
  useEffect(() => {
    console.log('Game state updated:', {
      cardsCount: gameState.cards.length,
      selectedCards: gameState.selectedCards,
      moves: gameState.moves,
      matchedPairs: gameState.matchedPairs,
      initialized: gameInitialized
    });
  }, [gameState, gameInitialized]);

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
