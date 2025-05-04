
import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Button } from '@/components/ui/button';
import { formatTime } from '../utils/timeUtils';

interface GameCompletionOverlayProps {
  moves: number;
  time: number;
  onPlayAgain: () => void;
}

const GameCompletionOverlay: React.FC<GameCompletionOverlayProps> = ({
  moves,
  time,
  onPlayAgain
}) => {
  // Celebrate with confetti on completion
  useEffect(() => {
    const duration = 3000;
    const end = Date.now() + duration;
    
    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.8 }
      });
      
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.8 }
      });
      
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    
    // Immediate celebration
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    
    // Continuous confetti
    frame();
    
    return () => {
      // Try to cancel any pending animations
      window.cancelAnimationFrame(requestAnimationFrame(frame));
    };
  }, []);
  
  return (
    <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-30 backdrop-blur-sm">
      <div className="bg-background p-8 rounded-xl shadow-xl max-w-md w-full text-center">
        <h2 className="text-2xl font-bold mb-2">🎉 Puzzle Completed!</h2>
        
        <div className="flex justify-center gap-8 my-6">
          <div className="text-center">
            <div className="text-3xl font-mono mb-1">{formatTime(time)}</div>
            <div className="text-sm text-muted-foreground">Time</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-mono mb-1">{moves}</div>
            <div className="text-sm text-muted-foreground">Moves</div>
          </div>
        </div>
        
        <Button onClick={onPlayAgain} className="mt-2 w-full">
          Play Again
        </Button>
      </div>
    </div>
  );
};

export default GameCompletionOverlay;
