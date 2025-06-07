import { useState, useCallback, useRef, useEffect } from 'react';
import { MemoryCard, MemoryGameState, GameDifficulty } from '../types/memoryTypes';
import { useMemoryScoring, LeaderboardEntry } from './useMemoryScoring';
import { useAuth } from '@/contexts/AuthContext';
import { useMemberProfile } from '@/hooks/useMemberProfile';

const CARD_THEMES = {
  animals: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮'],
  fruits: ['🍎', '🍊', '🍋', '🍌', '🍇', '🍓', '🍈', '🍉', '🍑', '🍒', '🥝', '🍍'],
  shapes: ['⭐', '🔴', '🔵', '🟡', '🟢', '🟣', '🟠', '⬛', '⬜', '🔶', '🔷', '🔸'],
};

export function useMemoryGame(
  layout: string,
  theme: keyof typeof CARD_THEMES,
  difficulty: GameDifficulty = 'medium'
) {
  const { user } = useAuth();
  const { profile } = useMemberProfile();
  const [gameState, setGameState] = useState<MemoryGameState>('waiting');
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [gameTime, setGameTime] = useState(0);
  const [score, setScore] = useState(0);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { calculateScore } = useMemoryScoring(layout);

  const getDifficultySettings = (diff: GameDifficulty) => {
    switch (diff) {
      case 'easy': return { timeLimit: 120, showTime: 3000 };
      case 'medium': return { timeLimit: 90, showTime: 2000 };
      case 'hard': return { timeLimit: 60, showTime: 1000 };
      default: return { timeLimit: 90, showTime: 2000 };
    }
  };

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
      id: index,
      symbol,
      isFlipped: false,
      isMatched: false,
    }));

    setCards(newCards);
    return newCards;
  }, [layout, theme, getGridSize]);

  const startGame = useCallback(() => {
    const newCards = initializeCards();
    setGameState('playing');
    setFlippedCards([]);
    setMatchedPairs([]);
    setMoves(0);
    setScore(0);
    setStartTime(Date.now());
    setGameTime(0);

    // Show all cards briefly based on difficulty
    const { showTime } = getDifficultySettings(difficulty);
    setCards(newCards.map(card => ({ ...card, isFlipped: true })));
    
    setTimeout(() => {
      setCards(newCards.map(card => ({ ...card, isFlipped: false })));
    }, showTime);

    // Start timer
    timerRef.current = setInterval(() => {
      setGameTime(prev => prev + 1);
    }, 1000);
  }, [initializeCards, difficulty]);

  const flipCard = useCallback((cardId: number) => {
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

            if (firstCard && secondCard && firstCard.symbol === secondCard.symbol) {
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
        completedAt: new Date(),
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
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return {
    gameState,
    cards,
    moves,
    gameTime,
    score,
    leaderboard,
    startGame,
    flipCard,
    resetGame,
    gridSize: getGridSize(),
  };
}
