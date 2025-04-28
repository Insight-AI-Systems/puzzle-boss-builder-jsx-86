
import React, { useEffect, useRef, useState } from 'react';
import { PuzzleConfig } from './PuzzleAdminPanel';

interface PuzzlePreviewProps {
  config: PuzzleConfig;
}

export const PuzzlePreview: React.FC<PuzzlePreviewProps> = ({ config }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 300, height: 300 });
  
  useEffect(() => {
    if (containerRef.current) {
      const { width } = containerRef.current.getBoundingClientRect();
      setDimensions({
        width: width,
        height: width, // Maintaining aspect ratio
      });
    }
  }, []);

  // Calculate piece dimensions
  const pieceWidth = dimensions.width / config.difficulty.columns;
  const pieceHeight = dimensions.height / config.difficulty.rows;

  return (
    <div ref={containerRef} className="w-full">
      <div 
        className="relative border border-gray-300 rounded-md overflow-hidden mb-4 bg-gray-100"
        style={{ width: "100%", height: dimensions.width }}
      >
        {/* Background full image (faded) */}
        <img 
          src={config.imageUrl} 
          alt="Puzzle background" 
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        
        {/* Grid overlay */}
        <div 
          className="absolute inset-0 grid"
          style={{
            gridTemplateColumns: `repeat(${config.difficulty.columns}, 1fr)`,
            gridTemplateRows: `repeat(${config.difficulty.rows}, 1fr)`,
          }}
        >
          {/* Generate grid cells */}
          {Array.from({ length: config.difficulty.rows * config.difficulty.columns }).map((_, index) => {
            const row = Math.floor(index / config.difficulty.columns);
            const col = index % config.difficulty.columns;
            return (
              <div 
                key={index}
                className="border border-gray-400 flex items-center justify-center"
                style={{ 
                  backgroundImage: `url(${config.imageUrl})`,
                  backgroundSize: `${dimensions.width}px ${dimensions.height}px`,
                  backgroundPosition: `-${col * pieceWidth}px -${row * pieceHeight}px`
                }}
              >
                {/* Optionally show piece number for debugging */}
                {/* <span className="text-xs text-white bg-black/50 px-1 rounded">{index + 1}</span> */}
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="text-sm space-y-2">
        <p className="text-muted-foreground">
          <span className="font-medium">Difficulty:</span> {config.difficulty.value} 
          ({config.difficulty.rows}×{config.difficulty.columns})
        </p>
        <p className="text-muted-foreground">
          <span className="font-medium">Style:</span> {config.pieceStyle}
        </p>
        <p className="text-muted-foreground text-xs truncate">
          <span className="font-medium">Image:</span> {config.imageUrl.split('/').pop()?.split('?')[0] || config.imageUrl}
        </p>
      </div>
    </div>
  );
};
