
import React, { useState, useCallback } from 'react';

export const usePuzzleConfetti = () => {
  const [isActive, setIsActive] = useState(false);
  
  const triggerConfetti = useCallback(() => {
    setIsActive(true);
    
    // Disable confetti after animation completes
    setTimeout(() => {
      setIsActive(false);
    }, 5000);
  }, []);
  
  // Create confetti elements
  const createConfettiElements = () => {
    if (!isActive) return null;
    
    const confetti = [];
    const colors = ['#FFD700', '#00BFFF', '#FF69B4', '#00FF00', '#FF4500'];
    
    for (let i = 0; i < 100; i++) {
      const left = `${Math.random() * 100}%`;
      const animationDuration = `${Math.random() * 3 + 2}s`;
      const animationDelay = `${Math.random() * 2}s`;
      const size = `${Math.random() * 10 + 5}px`;
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      confetti.push(
        <div
          key={i}
          className="confetti-piece"
          style={{
            position: 'absolute',
            top: '-10%',
            left,
            width: size,
            height: size,
            backgroundColor: color,
            borderRadius: '50%',
            animation: `fall ${animationDuration} ease-in forwards`,
            animationDelay,
            opacity: 0,
          }}
        />
      );
    }
    
    return confetti;
  };
  
  // Create the confetti container component
  const confettiContainer = (
    <div
      className="confetti-container"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 100,
      }}
    >
      <style>
        {`
          @keyframes fall {
            0% {
              transform: translateY(0) rotate(0deg);
              opacity: 1;
            }
            100% {
              transform: translateY(100vh) rotate(720deg);
              opacity: 0;
            }
          }
        `}
      </style>
      {createConfettiElements()}
    </div>
  );
  
  return { confettiContainer, triggerConfetti, isActive };
};
