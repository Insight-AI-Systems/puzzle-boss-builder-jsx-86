
import { useState, useCallback, useRef, useEffect } from 'react';
import { MemoryCard, MemoryGameState, MemoryLayout, MemoryTheme } from '../types/memoryTypes';
import { useMemoryScoring, LeaderboardEntry } from './useMemoryScoring';
import { useAuth } from '@/contexts/AuthContext';
import { useMemberProfile } from '@/hooks/useMemberProfile';

const CARD_THEMES = {
  animals: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮'],
  fruits: ['🍎', '🍊', '🍋', '🍌', '🍇', '🍓', '🍈', '🍉', '🍑', '🍒', '🥝', '🍍'],
  shapes: ['⭐', '🔴', '🔵', '🟡', '🟢', '🟣', '🟠', '⬛', '⬜', '🔶', '🔷', '🔸'],
};

export function useMemoryGame(
  layout: MemoryLayout,
  theme: MemoryTheme
) {
  const { user } = useAuth();
  const { profile } = useMemberProfile();
  const [gameState, setGameState] = useState<MemoryGameState>('waiting');
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<string[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [gameTime, setGameTime] = useState(0);
  const [score, setScore] = useState(0);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [gameInitialized, setGameInitialized] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { calculateScore } = useMemoryScoring(layout);

  const getGridSize = useCallback(() => {
    const [rows, cols] = layout.split('x').map(Number);
    return { rows, cols, totalPairs: (rows * cols) / 2 };
  }, [layout]);

  const initializeCards = useCallback(() => {
    const { totalPairs } = getGridSize();
    const symbols = CARD_THEMES[theme].slice(0, totalPairs);
    const cardPairs = [...symbols, ...symbols];
    
    // Shuffle cards
    for (let i = cardPairs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cardPairs[i], cardPairs[j]] = [cardPairs[j], cardPairs[i]];
    }

    const newCards: MemoryCard[] = cardPairs.map((symbol, index) => ({
      id: `card-${index}`,
      value: symbol,
      isFlipped: false,
      isMatched: false,
    }));

    setCards(newCards);
    setGameInitialized(true);
    return newCards;
  }, [layout, theme, getGridSize]);

  const initializeGame = useCallback((newLayout?: MemoryLayout, newTheme?: MemoryTheme) => {
    const targetLayout = newLayout || layout;
    const targetTheme = newTheme || theme;
    
    const { totalPairs } = getGridSize();
    const symbols = CARD_THEMES[targetTheme].slice(0, totalPairs);
    const cardPairs = [...symbols, ...symbols];
    
    // Shuffle cards
    for (let i = cardPairs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cardPairs[i], cardPairs[j]] = [cardPairs[j], cardPairs[i]];
    }

    const newCards: MemoryCard[] = cardPairs.map((symbol, index) => ({
      id: `card-${index}`,
      value: symbol,
      isFlipped: false,
      isMatched: false,
    }));

    setCards(newCards);
    setGameState('waiting');
    setFlippedCards([]);
    setMatchedPairs([]);
    setMoves(0);
    setScore(0);
    setStartTime(null);
    setGameTime(0);
    setGameInitialized(true);
  }, [layout, theme, getGridSize]);

  const startGame = useCallback(() => {
    if (!gameInitialized) {
      initializeCards();
    }
    setGameState('playing');
    setFlippedCards([]);
    setMatchedPairs([]);
    setMoves(0);
    setScore(0);
    setStartTime(Date.now());
    setGameTime(0);

    // Start timer
    timerRef.current = setInterval(() => {
      setGameTime(prev => prev + 1);
    }, 1000);
  }, [gameInitialized, initializeCards]);

  const handleCardClick = useCallback((cardId: string) => {
    if (gameState !== 'playing' || flippedCards.length >= 2) return;
    if (flippedCards.includes(cardId) || matchedPairs.includes(cardId)) return;

    setFlippedCards(prev => [...prev, cardId]);
    setCards(prev => prev.map(card => 
      card.id === cardId ? { ...card, isFlipped: true } : card
    ));

    if (flippedCards.length === 1) {
      setMoves(prev => prev + 1);
      
      // Check for match after a short delay
      setTimeout(() => {
        setFlippedCards(current => {
          if (current.length === 2) {
            const [firstId, secondId] = current;
            const firstCard = cards.find(c => c.id === firstId);
            const secondCard = cards.find(c => c.id === cardId);

            if (firstCard && secondCard && firstCard.value === secondCard.value) {
              // Match found
              setMatchedPairs(prev => [...prev, firstId, cardId]);
              setCards(prev => prev.map(card => 
                (card.id === firstId || card.id === cardId) 
                  ? { ...card, isMatched: true }
                  : card
              ));
              
              // Check for game completion
              const { totalPairs } = getGridSize();
              if (matchedPairs.length + 2 === totalPairs * 2) {
                endGame(true);
              }
            } else {
              // No match - flip cards back
              setTimeout(() => {
                setCards(prev => prev.map(card => 
                  (card.id === firstId || card.id === cardId) 
                    ? { ...card, isFlipped: false }
                    : card
                ));
              }, 1000);
            }
            return [];
          }
          return current;
        });
      }, 500);
    }
  }, [gameState, flippedCards, matchedPairs, cards, getGridSize]);

  const endGame = useCallback((completed: boolean) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (completed && startTime) {
      const timeElapsed = Date.now() - startTime;
      const { totalPairs } = getGridSize();
      const scoreData = calculateScore(matchedPairs.length / 2, moves, timeElapsed, totalPairs);
      setScore(scoreData.finalScore);

      // Get the display name for leaderboard
      const playerName = profile?.username || profile?.display_name || profile?.full_name || 'Anonymous Player';

      // Add to leaderboard
      const newEntry: LeaderboardEntry = {
        id: Date.now().toString(),
        playerName,
        score: scoreData.finalScore,
        timeElapsed,
        moves,
        accuracy: scoreData.accuracy,
        isPerfectGame: scoreData.isPerfectGame,
      };

      setLeaderboard(prev => [...prev, newEntry].sort((a, b) => b.score - a.score).slice(0, 10));
      setGameState('completed');
    } else {
      setGameState('failed');
    }
  }, [startTime, matchedPairs.length, moves, calculateScore, getGridSize, profile]);

  const resetGame = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    setGameState('waiting');
    setCards([]);
    setFlippedCards([]);
    setMatchedPairs([]);
    setMoves(0);
    setStartTime(null);
    setGameTime(0);
    setScore(0);
    setGameInitialized(false);
  }, []);

  const getGameStats = useCallback(() => {
    const { totalPairs } = getGridSize();
    const accuracy = moves > 0 ? (matchedPairs.length / 2) / moves * 100 : 0;
    const timeElapsed = startTime ? gameTime : 0;
    
    return {
      moves,
      timeElapsed,
      matchedPairs: matchedPairs.length / 2,
      totalPairs,
      accuracy: Math.round(accuracy * 100) / 100,
    };
  }, [moves, matchedPairs.length, gameTime, startTime, getGridSize]);

  const isGameActive = gameState === 'playing';
  const disabled = gameState !== 'playing' || flippedCards.length >= 2;

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Initialize game on mount
  useEffect(() => {
    if (!gameInitialized) {
      initializeGame();
    }
  }, [initializeGame, gameInitialized]);

  return {
    gameState: {
      layout,
      theme,
      cards,
      isGameComplete: gameState === 'completed',
      matchedPairs: matchedPairs.length,
      moves,
    },
    handleCardClick,
    initializeGame,
    getGameStats,
    isGameActive,
    disabled,
    gameInitialized,
    cards,
    moves,
    gameTime,
    score,
    leaderboard,
    startGame,
    flipCard: handleCardClick,
    resetGame,
    gridSize: getGridSize(),
  };
}
