
import { useEffect } from 'react';

export const usePuzzleConfetti = (isComplete: boolean) => {
  useEffect(() => {
    if (!isComplete) return;
    
    // Simple function to trigger confetti effect
    const triggerConfetti = async () => {
      try {
        const confetti = (await import('canvas-confetti')).default;
        
        const duration = 2000;
        const end = Date.now() + duration;
        
        const colors = ['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42', '#ffa62d', '#ff36ff'];
        
        (function frame() {
          confetti({
            particleCount: 7,
            angle: 60,
            spread: 55,
            origin: { x: 0, y: 0.7 },
            colors
          });
          
          confetti({
            particleCount: 7,
            angle: 120,
            spread: 55,
            origin: { x: 1, y: 0.7 },
            colors
          });
          
          if (Date.now() < end) {
            requestAnimationFrame(frame);
          }
        })();
      } catch (error) {
        console.error('Error loading confetti:', error);
      }
    };
    
    triggerConfetti();
  }, [isComplete]);
};
