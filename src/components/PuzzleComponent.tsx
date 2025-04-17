
import React, { useEffect, useRef, useState } from 'react';

const PuzzleComponent: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Clear any existing content
    containerRef.current.innerHTML = '';
    
    // Create a simple 4x4 colored grid as the puzzle
    const grid = document.createElement('div');
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = 'repeat(4, 1fr)';
    grid.style.gridTemplateRows = 'repeat(4, 1fr)';
    grid.style.gap = '4px';
    grid.style.width = '100%';
    grid.style.height = '100%';
    
    // Create 16 colored cells
    for (let i = 0; i < 16; i++) {
      const cell = document.createElement('div');
      const color = `hsl(${Math.random() * 360}, 80%, 60%)`;
      cell.style.backgroundColor = color;
      cell.style.borderRadius = '4px';
      cell.style.border = '1px solid rgba(255, 255, 255, 0.2)';
      
      // Add some interactivity
      cell.addEventListener('mouseenter', () => {
        cell.style.opacity = '0.8';
      });
      
      cell.addEventListener('mouseleave', () => {
        cell.style.opacity = '1';
      });
      
      grid.appendChild(cell);
    }
    
    containerRef.current.appendChild(grid);
    setIsLoaded(true);
    
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []);
  
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-bold mb-4">Jigsaw Puzzle Demo</h2>
      <div 
        className="border border-puzzle-aqua/40 bg-puzzle-black/50 rounded-lg p-4"
        style={{ width: '400px', height: '400px' }}
      >
        {!isLoaded && (
          <div className="flex items-center justify-center h-full">
            <div className="animate-pulse text-puzzle-aqua">Loading puzzle...</div>
          </div>
        )}
        <div ref={containerRef} className="w-full h-full" />
      </div>
      <p className="mt-4 text-sm text-muted-foreground">
        This is a simple colored grid puzzle demonstration.
      </p>
    </div>
  );
};

export default PuzzleComponent;
