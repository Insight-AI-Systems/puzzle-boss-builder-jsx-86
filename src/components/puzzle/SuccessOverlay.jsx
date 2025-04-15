
import React, { memo, useEffect, useState } from 'react';
import { Check, Trophy, Star } from 'lucide-react';

/**
 * Success overlay displayed when puzzle is completed
 * @returns {JSX.Element} Success overlay component
 */
const SuccessOverlay = memo(({ completionTime, moveCount }) => {
  const [showStars, setShowStars] = useState(false);
  
  // Delay star animation
  useEffect(() => {
    console.log('[SuccessOverlay] Component mounted', { completionTime, moveCount });
    const timer = setTimeout(() => {
      setShowStars(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [completionTime, moveCount]);
  
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-puzzle-black/50 backdrop-blur-[2px] animate-fade-in overflow-hidden z-50">
      <div className="text-puzzle-gold flex items-center gap-2 font-bold text-3xl mb-2 animate-scale-in">
        <Trophy className="w-8 h-8" />
        <span className="gold-gradient">Complete!</span>
        <Trophy className="w-8 h-8" />
      </div>
      
      <div className="text-puzzle-aqua text-lg animate-fade-in opacity-0" style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}>
        <Check className="w-5 h-5 inline mr-1" />
        Puzzle Solved
      </div>
      
      {/* Stats summary */}
      {(completionTime || moveCount) && (
        <div className="mt-4 text-white animate-fade-in opacity-0" style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}>
          {completionTime && (
            <div className="text-center mb-1">
              <span className="text-puzzle-gold">Time:</span> {completionTime}
            </div>
          )}
          {moveCount !== undefined && (
            <div className="text-center">
              <span className="text-puzzle-gold">Moves:</span> {moveCount}
            </div>
          )}
        </div>
      )}
      
      {/* Animated stars */}
      {showStars && (
        <>
          <Star className="absolute text-puzzle-gold w-6 h-6 left-[20%] top-[20%] animate-scale-in opacity-0" style={{ animationDelay: "0.4s", animationFillMode: "forwards" }} />
          <Star className="absolute text-puzzle-gold w-4 h-4 left-[70%] top-[30%] animate-scale-in opacity-0" style={{ animationDelay: "0.5s", animationFillMode: "forwards" }} />
          <Star className="absolute text-puzzle-gold w-5 h-5 left-[30%] top-[70%] animate-scale-in opacity-0" style={{ animationDelay: "0.6s", animationFillMode: "forwards" }} />
          <Star className="absolute text-puzzle-gold w-3 h-3 left-[80%] top-[60%] animate-scale-in opacity-0" style={{ animationDelay: "0.7s", animationFillMode: "forwards" }} />
        </>
      )}
    </div>
  );
});

// Display name for debugging
SuccessOverlay.displayName = 'SuccessOverlay';

export default SuccessOverlay;
