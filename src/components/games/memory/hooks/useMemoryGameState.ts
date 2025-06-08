
import { useState, useCallback } from 'react';
import { MemoryLayout, MemoryTheme } from '../types/memoryTypes';
import { 
  GameCoreState, 
  GameState,
  createInitialState, 
  initializeGame, 
  startGame, 
  resetGame,
  flipCard,
  processMatch,
  flipCardsBack,
  canFlipCard
} from '../core/memoryGameCore';

export function useMemoryGameState(initialLayout: MemoryLayout, initialTheme: MemoryTheme) {
  const [layout, setLayout] = useState<MemoryLayout>(initialLayout);
  const [theme, setTheme] = useState<MemoryTheme>(initialTheme);
  const [gameState, setGameState] = useState<GameCoreState>(createInitialState);
  const [isProcessingMatch, setIsProcessingMatch] = useState(false);

  const initialize = useCallback((newLayout?: MemoryLayout, newTheme?: MemoryTheme) => {
    const targetLayout = newLayout || layout;
    const targetTheme = newTheme || theme;
    
    setLayout(targetLayout);
    setTheme(targetTheme);
    setGameState(initializeGame(targetLayout, targetTheme));
    setIsProcessingMatch(false);
  }, [layout, theme]);

  const start = useCallback(() => {
    setGameState(current => startGame(current));
  }, []);

  const reset = useCallback(() => {
    setGameState(current => resetGame(current));
    setIsProcessingMatch(false);
  }, []);

  const handleCardClick = useCallback((cardId: string) => {
    if (isProcessingMatch || !canFlipCard(cardId, gameState)) {
      return;
    }

    setGameState(current => {
      const afterFlip = flipCard(cardId, current);
      
      if (afterFlip.flippedCards.length === 2) {
        setIsProcessingMatch(true);
        
        // Process match after a short delay
        setTimeout(() => {
          setGameState(matchState => {
            const afterMatch = processMatch(matchState);
            
            // If no match, flip cards back after delay
            if (afterMatch.flippedCards.length === 0 && afterMatch.moves > matchState.moves) {
              const [firstId, secondId] = afterFlip.flippedCards;
              const firstCard = afterMatch.cards.find(c => c.id === firstId);
              const secondCard = afterMatch.cards.find(c => c.id === secondId);
              
              if (firstCard && secondCard && !firstCard.isMatched && !secondCard.isMatched) {
                setTimeout(() => {
                  setGameState(flipState => flipCardsBack([firstId, secondId], flipState));
                }, 1000);
              }
            }
            
            setIsProcessingMatch(false);
            return afterMatch;
          });
        }, 100);
      }
      
      return afterFlip;
    });
  }, [gameState, isProcessingMatch]);

  return {
    layout,
    theme,
    gameState,
    isProcessingMatch,
    actions: {
      initialize,
      start,
      reset,
      handleCardClick
    }
  };
}
