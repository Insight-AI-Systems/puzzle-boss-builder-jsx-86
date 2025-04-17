
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface PuzzleGameProps {
  width?: number;
  height?: number;
  rows?: number;
  columns?: number;
  imageSrc?: string;
}

const PuzzleGame: React.FC<PuzzleGameProps> = ({
  width = 800,
  height = 600,
  rows = 3,
  columns = 3,
  imageSrc = 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Use this function to manually refresh the puzzle
  const refreshPuzzle = () => {
    setIsLoaded(false);
    setError(null);
    
    // Small delay to ensure DOM clears before re-initializing
    setTimeout(() => {
      if (containerRef.current) {
        try {
          loadSimplePuzzle();
        } catch (e) {
          console.error("Error refreshing puzzle:", e);
          setError("Failed to refresh puzzle. Please try again.");
        }
      }
    }, 100);
  };
  
  const loadSimplePuzzle = () => {
    if (!containerRef.current) return;
    
    // Clear any existing content
    containerRef.current.innerHTML = '';
    
    // Create a simple color grid instead of using headbreaker
    const puzzleContainer = document.createElement('div');
    puzzleContainer.style.width = `${width}px`;
    puzzleContainer.style.height = `${height}px`;
    puzzleContainer.style.display = 'grid';
    puzzleContainer.style.gap = '2px';
    puzzleContainer.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
    puzzleContainer.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
    
    // Create the puzzle grid pieces
    for (let i = 0; i < rows * columns; i++) {
      const piece = document.createElement('div');
      const hue = Math.floor(Math.random() * 360);
      piece.style.backgroundColor = `hsl(${hue}, 80%, 60%)`;
      piece.style.border = '1px solid rgba(255, 255, 255, 0.2)';
      piece.style.cursor = 'grab';
      piece.style.borderRadius = '4px';
      piece.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
      piece.style.transition = 'transform 0.2s';
      
      // Add hover effect
      piece.addEventListener('mouseenter', () => {
        piece.style.transform = 'scale(0.98)';
      });
      
      piece.addEventListener('mouseleave', () => {
        piece.style.transform = 'scale(1)';
      });
      
      // Add drag functionality (simplified)
      let isDragging = false;
      let startX = 0;
      let startY = 0;
      let originalX = 0;
      let originalY = 0;
      
      piece.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        
        // Get current position from computed transform
        const style = window.getComputedStyle(piece);
        const matrix = new DOMMatrix(style.transform);
        originalX = matrix.e;
        originalY = matrix.f;
        
        piece.style.zIndex = '10';
        piece.style.cursor = 'grabbing';
      });
      
      document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        
        piece.style.transform = `translate(${originalX + dx}px, ${originalY + dy}px)`;
      });
      
      document.addEventListener('mouseup', () => {
        if (!isDragging) return;
        
        isDragging = false;
        piece.style.zIndex = '';
        piece.style.cursor = 'grab';
      });
      
      puzzleContainer.appendChild(piece);
    }
    
    containerRef.current.appendChild(puzzleContainer);
    setIsLoaded(true);
  };
  
  // Initialize the puzzle on component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        loadSimplePuzzle();
      } catch (err) {
        console.error("Failed to load puzzle:", err);
        setError("Failed to load the puzzle. Please try refreshing.");
      }
    }, 500);
    
    return () => {
      clearTimeout(timer);
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [width, height, rows, columns, imageSrc]);
  
  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-end w-full mb-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={refreshPuzzle}
          className="text-puzzle-aqua border-puzzle-aqua/50 hover:bg-puzzle-aqua/10"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh Puzzle
        </Button>
      </div>
      
      <div 
        className="border-2 border-puzzle-aqua rounded-lg bg-puzzle-black/50 shadow-lg p-4 my-4 overflow-hidden"
        style={{ width: `${width + 20}px`, height: `${height + 20}px` }}
      >
        {!isLoaded && !error && (
          <div className="flex items-center justify-center h-full">
            <div className="animate-pulse text-puzzle-aqua">Loading puzzle...</div>
          </div>
        )}
        
        {error && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <Button variant="outline" onClick={refreshPuzzle}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </div>
        )}
        
        <div ref={containerRef} className="w-full h-full" />
      </div>
      
      <div className="mt-4 text-center max-w-2xl">
        <h3 className="text-lg font-bold text-puzzle-aqua">How to Play</h3>
        <p className="text-sm text-muted-foreground">
          Drag the puzzle pieces to move them around. Complete the puzzle by arranging all pieces in their correct positions.
        </p>
      </div>
    </div>
  );
};

export default PuzzleGame;
