
import { useState, useCallback } from 'react';
import { MemoryLayout, LAYOUT_CONFIGS, MemoryScore } from '../types/memoryTypes';

export interface LeaderboardEntry {
  id: string;
  playerName: string;
  score: number;
  timeElapsed: number;
  moves: number;
  accuracy: number;
  isPerfectGame: boolean;
  layout: MemoryLayout;
  achievedAt: Date;
}

export function useMemoryGameScoring(layout: MemoryLayout) {
  const [scoreData, setScoreData] = useState<MemoryScore>({
    moves: 0,
    timeElapsed: 0,
    accuracy: 0,
    baseScore: 0,
    timeBonus: 0,
    accuracyBonus: 0,
    finalScore: 0,
    isPerfectGame: false,
  });
  
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [personalBests, setPersonalBests] = useState<Record<string, LeaderboardEntry>>({});

  const calculateScore = useCallback((matchedPairs: number, moves: number, timeElapsed: number) => {
    const config = LAYOUT_CONFIGS[layout];
    const totalPairs = config.totalCards / 2;
    const accuracy = moves > 0 ? (matchedPairs / moves) * 100 : 0;
    
    // Base score calculation
    const baseScore = matchedPairs * 100;
    
    // Time bonus (faster = higher bonus)
    const timeBonus = Math.max(0, (300000 - timeElapsed) / 1000); // 5 minute baseline
    
    // Accuracy bonus
    const accuracyBonus = accuracy >= 90 ? 500 : accuracy >= 75 ? 250 : 0;
    
    // Perfect game bonus
    const isPerfectGame = accuracy === 100 && matchedPairs === totalPairs;
    const perfectBonus = isPerfectGame ? 1000 : 0;
    
    const finalScore = Math.round(baseScore + timeBonus + accuracyBonus + perfectBonus);
    
    return {
      moves,
      timeElapsed,
      accuracy: Math.round(accuracy * 100) / 100,
      baseScore,
      timeBonus: Math.round(timeBonus),
      accuracyBonus,
      finalScore,
      isPerfectGame,
    };
  }, [layout]);

  const updateScore = useCallback((matchedPairs: number, moves: number, timeElapsed: number) => {
    const newScoreData = calculateScore(matchedPairs, moves, timeElapsed);
    setScoreData(newScoreData);
    return newScoreData;
  }, [calculateScore]);

  const submitToLeaderboard = useCallback((scoreData: MemoryScore, playerName: string) => {
    const entry: LeaderboardEntry = {
      id: Date.now().toString(),
      playerName,
      score: scoreData.finalScore,
      timeElapsed: scoreData.timeElapsed,
      moves: scoreData.moves,
      accuracy: scoreData.accuracy,
      isPerfectGame: scoreData.isPerfectGame,
      layout,
      achievedAt: new Date(),
    };

    setLeaderboard(prev => [...prev, entry].sort((a, b) => b.score - a.score).slice(0, 10));
    
    // Update personal best if this is better
    const personalBestKey = `${layout}-${playerName}`;
    const currentBest = personalBests[personalBestKey];
    if (!currentBest || entry.score > currentBest.score) {
      setPersonalBests(prev => ({ ...prev, [personalBestKey]: entry }));
    }
    
    return entry;
  }, [layout, personalBests]);

  const resetScore = useCallback(() => {
    setScoreData({
      moves: 0,
      timeElapsed: 0,
      accuracy: 0,
      baseScore: 0,
      timeBonus: 0,
      accuracyBonus: 0,
      finalScore: 0,
      isPerfectGame: false,
    });
  }, []);

  return {
    scoreData,
    leaderboard,
    personalBests,
    calculateScore,
    updateScore,
    submitToLeaderboard,
    resetScore,
  };
}
