
import React, { useEffect } from 'react';

interface MemoryCelebrationProps {
  scoreData: {
    finalScore: number;
    isPerfectGame: boolean;
    accuracy: number;
    timeElapsed: number;
    moves: number;
  };
  show: boolean;
  onComplete?: () => void;
}

export function MemoryCelebration({ scoreData, show, onComplete }: MemoryCelebrationProps) {
  useEffect(() => {
    if (!show) return;

    const timer = setTimeout(() => {
      onComplete?.();
    }, 3000);

    return () => clearTimeout(timer);
  }, [show, onComplete]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center animate-scale-in">
          {scoreData.isPerfectGame && (
            <div className="text-6xl font-bold text-puzzle-gold animate-bounce mb-4">
              PERFECT GAME!
            </div>
          )}
          
          <div className="text-4xl font-bold text-puzzle-white animate-pulse">
            {scoreData.finalScore.toLocaleString()} POINTS
          </div>
        </div>
      </div>
    </div>
  );
}
