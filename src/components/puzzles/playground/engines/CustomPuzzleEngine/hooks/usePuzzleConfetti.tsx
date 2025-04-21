
import React, { useState, useCallback } from 'react';

export const usePuzzleConfetti = () => {
  const [isActive, setIsActive] = useState(false);
  
  const triggerConfetti = useCallback(() => {
    setIsActive(true);
    
    // Disable confetti after animation completes
    setTimeout(() => {
      setIsActive(false);
    }, 3000);
  }, []);
  
  // Create confetti elements
  const createConfettiElements = () => {
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
    const elements = [];
    
    for (let i = 0; i < 50; i++) {
      const left = Math.random() * 100;
      const width = Math.random() * 10 + 5;
      const height = Math.random() * 4 + 2;
      const bg = colors[Math.floor(Math.random() * colors.length)];
      const delay = Math.random() * 3;
      
      elements.push(
        <div 
          key={`confetti-${i}`}
          className="confetti-particle"
          style={{
            left: `${left}%`,
            width: `${width}px`,
            height: `${height}px`,
            backgroundColor: bg,
            animationDelay: `${delay}s`
          }}
        />
      );
    }
    
    return elements;
  };
  
  // Create confetti container
  const confettiContainer = (
    <div className={`confetti-container ${isActive ? 'active' : ''}`}>
      {isActive && createConfettiElements()}
    </div>
  );
  
  return { confettiContainer, triggerConfetti };
};
