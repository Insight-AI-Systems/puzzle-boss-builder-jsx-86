
import { useState, useCallback, useEffect } from 'react';
import { MemoryLayout, LAYOUT_CONFIGS } from '../types/memoryTypes';

export interface MemoryScoreData {
  basePoints: number;
  timeBonus: number;
  perfectGameBonus: number;
  mistakePenalty: number;
  finalScore: number;
  moves: number;
  timeElapsed: number;
  accuracy: number;
  isPerfectGame: boolean;
  mistakes: number;
}

export interface LeaderboardEntry {
  id: string;
  playerName: string;
  score: number;
  moves: number;
  timeElapsed: number;
  accuracy: number;
  layout: MemoryLayout;
  achievedAt: Date;
  isPerfectGame: boolean;
}

export function useMemoryScoring(layout: MemoryLayout) {
  const [scoreData, setScoreData] = useState<MemoryScoreData>({
    basePoints: 0,
    timeBonus: 0,
    perfectGameBonus: 0,
    mistakePenalty: 0,
    finalScore: 0,
    moves: 0,
    timeElapsed: 0,
    accuracy: 0,
    isPerfectGame: false,
    mistakes: 0
  });

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [personalBests, setPersonalBests] = useState({
    highestScore: 0,
    fastestTime: Infinity,
    lowestMoves: Infinity,
    bestAccuracy: 0
  });

  // Scoring constants
  const SCORING_CONFIG = {
    BASE_POINTS_PER_PAIR: 100,
    PERFECT_GAME_BONUS: 1000,
    TIME_BONUS_MULTIPLIER: 1.5,
    MISTAKE_PENALTY: 50,
    SPEED_BONUS_THRESHOLD: 30000, // 30 seconds
    EFFICIENCY_BONUS_THRESHOLD: 0.8 // 80% accuracy
  };

  const calculateScore = useCallback((
    matchedPairs: number,
    moves: number,
    timeElapsed: number,
    totalPairs: number
  ): MemoryScoreData => {
    const accuracy = moves > 0 ? (matchedPairs / moves) * 100 : 0;
    const mistakes = moves - matchedPairs;
    const isPerfectGame = accuracy === 100 && moves === totalPairs;

    // Base points calculation
    const basePoints = matchedPairs * SCORING_CONFIG.BASE_POINTS_PER_PAIR;

    // Time bonus (higher bonus for faster completion)
    const timeInSeconds = timeElapsed / 1000;
    const expectedTime = totalPairs * 3; // 3 seconds per pair as baseline
    const timeBonus = Math.max(0, (expectedTime - timeInSeconds) * SCORING_CONFIG.TIME_BONUS_MULTIPLIER);

    // Perfect game bonus
    const perfectGameBonus = isPerfectGame ? SCORING_CONFIG.PERFECT_GAME_BONUS : 0;

    // Mistake penalty
    const mistakePenalty = mistakes * SCORING_CONFIG.MISTAKE_PENALTY;

    // Final score calculation: (Base Points / Moves Made) * Time Bonus + Perfect Bonus - Penalties
    const scoreMultiplier = moves > 0 ? Math.max(0.1, totalPairs / moves) : 0;
    const finalScore = Math.round(
      (basePoints * scoreMultiplier) + timeBonus + perfectGameBonus - mistakePenalty
    );

    return {
      basePoints,
      timeBonus: Math.round(timeBonus),
      perfectGameBonus,
      mistakePenalty,
      finalScore: Math.max(0, finalScore),
      moves,
      timeElapsed,
      accuracy,
      isPerfectGame,
      mistakes
    };
  }, []);

  const updateScore = useCallback((
    matchedPairs: number,
    moves: number,
    timeElapsed: number
  ) => {
    const totalPairs = LAYOUT_CONFIGS[layout].totalCards / 2;
    const newScoreData = calculateScore(matchedPairs, moves, timeElapsed, totalPairs);
    setScoreData(newScoreData);
    return newScoreData;
  }, [layout, calculateScore]);

  const submitToLeaderboard = useCallback((scoreData: MemoryScoreData, playerName: string) => {
    const entry: LeaderboardEntry = {
      id: Math.random().toString(36).substr(2, 9),
      playerName,
      score: scoreData.finalScore,
      moves: scoreData.moves,
      timeElapsed: scoreData.timeElapsed,
      accuracy: scoreData.accuracy,
      layout,
      achievedAt: new Date(),
      isPerfectGame: scoreData.isPerfectGame
    };

    setLeaderboard(prev => {
      const updated = [...prev, entry].sort((a, b) => b.score - a.score).slice(0, 10);
      
      // Update localStorage
      localStorage.setItem(`memory-leaderboard-${layout}`, JSON.stringify(updated));
      
      return updated;
    });

    // Update personal bests
    setPersonalBests(prev => ({
      highestScore: Math.max(prev.highestScore, scoreData.finalScore),
      fastestTime: Math.min(prev.fastestTime, scoreData.timeElapsed),
      lowestMoves: Math.min(prev.lowestMoves, scoreData.moves),
      bestAccuracy: Math.max(prev.bestAccuracy, scoreData.accuracy)
    }));

    return entry;
  }, [layout]);

  // Load leaderboard from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(`memory-leaderboard-${layout}`);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setLeaderboard(parsed);
      } catch (error) {
        console.error('Failed to load leaderboard:', error);
      }
    }
  }, [layout]);

  const resetScore = useCallback(() => {
    setScoreData({
      basePoints: 0,
      timeBonus: 0,
      perfectGameBonus: 0,
      mistakePenalty: 0,
      finalScore: 0,
      moves: 0,
      timeElapsed: 0,
      accuracy: 0,
      isPerfectGame: false,
      mistakes: 0
    });
  }, []);

  const getScoreBreakdown = useCallback(() => {
    return {
      'Base Points': scoreData.basePoints,
      'Time Bonus': scoreData.timeBonus,
      'Perfect Game Bonus': scoreData.perfectGameBonus,
      'Mistake Penalty': -scoreData.mistakePenalty,
      'Final Score': scoreData.finalScore
    };
  }, [scoreData]);

  return {
    scoreData,
    leaderboard,
    personalBests,
    updateScore,
    submitToLeaderboard,
    resetScore,
    getScoreBreakdown,
    calculateScore
  };
}
