
import React, { useEffect, useState } from 'react';
import { MemoryScoreData } from '../hooks/useMemoryScoring';

interface MemoryCelebrationProps {
  scoreData: MemoryScoreData;
  show: boolean;
  onComplete?: () => void;
}

export function MemoryCelebration({ scoreData, show, onComplete }: MemoryCelebrationProps) {
  const [animations, setAnimations] = useState<string[]>([]);

  useEffect(() => {
    if (!show) return;

    const celebrationTypes = [];

    // Determine celebration intensity based on performance
    if (scoreData.isPerfectGame) {
      celebrationTypes.push('perfect-game');
    } else if (scoreData.accuracy >= 90) {
      celebrationTypes.push('excellent');
    } else if (scoreData.accuracy >= 75) {
      celebrationTypes.push('good');
    } else {
      celebrationTypes.push('completed');
    }

    // Add specific achievement celebrations
    if (scoreData.finalScore >= 2000) celebrationTypes.push('high-score');
    if (scoreData.moves <= 12) celebrationTypes.push('efficient');
    if (scoreData.timeElapsed <= 30000) celebrationTypes.push('speed');

    setAnimations(celebrationTypes);

    // Auto-complete after animations
    const timer = setTimeout(() => {
      onComplete?.();
    }, 3000);

    return () => clearTimeout(timer);
  }, [show, scoreData, onComplete]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Fireworks for perfect games */}
      {animations.includes('perfect-game') && (
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={`firework-${i}`}
              className="absolute animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: '1s'
              }}
            >
              <div className="w-4 h-4 bg-puzzle-gold rounded-full opacity-75" />
            </div>
          ))}
        </div>
      )}

      {/* Score burst animations */}
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

          {/* Achievement badges */}
          <div className="mt-4 space-y-2">
            {animations.includes('high-score') && (
              <div className="text-lg text-puzzle-gold animate-fade-in">
                🏆 HIGH SCORE ACHIEVED!
              </div>
            )}
            {animations.includes('efficient') && (
              <div className="text-lg text-puzzle-aqua animate-fade-in">
                🎯 EFFICIENCY MASTER!
              </div>
            )}
            {animations.includes('speed') && (
              <div className="text-lg text-emerald-400 animate-fade-in">
                ⚡ SPEED DEMON!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating score elements */}
      {scoreData.timeBonus > 0 && (
        <div className="absolute top-1/4 right-1/4 animate-float-up text-emerald-400 font-bold text-xl">
          +{scoreData.timeBonus} TIME BONUS
        </div>
      )}

      {scoreData.perfectGameBonus > 0 && (
        <div className="absolute top-1/3 left-1/4 animate-float-up text-puzzle-gold font-bold text-xl">
          +{scoreData.perfectGameBonus} PERFECT BONUS
        </div>
      )}

      <style>{`
        @keyframes float-up {
          0% {
            opacity: 0;
            transform: translateY(50px);
          }
          50% {
            opacity: 1;
            transform: translateY(-20px);
          }
          100% {
            opacity: 0;
            transform: translateY(-100px);
          }
        }
        .animate-float-up {
          animation: float-up 2s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
