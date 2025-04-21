
import React, { useState, useEffect } from 'react';
import { JigsawPuzzle } from 'react-jigsaw-puzzle/lib';
import 'react-jigsaw-puzzle/lib/jigsaw-puzzle.css';
import { Loader2 } from 'lucide-react';

interface ReactJigsawPuzzleEngineProps {
  imageUrl: string;
  rows: number;
  columns: number;
}

const ReactJigsawPuzzleEngine: React.FC<ReactJigsawPuzzleEngineProps> = ({ 
  imageUrl, 
  rows, 
  columns 
}) => {
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [solveTime, setSolveTime] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);

  const handleOnChange = (isSolved: boolean) => {
    if (isSolved && !completed) {
      setCompleted(true);
      const endTime = Date.now();
      if (startTime) {
        setSolveTime((endTime - startTime) / 1000);
      }
    }
  };

  // Use an effect to handle image preloading instead of an onLoadingComplete prop
  useEffect(() => {
    // Reset states when image URL changes
    setLoading(true);
    setCompleted(false);
    setSolveTime(null);
    
    // Preload the image
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      setLoading(false);
      setStartTime(Date.now());
    };
    img.onerror = (error) => {
      console.error('Error loading puzzle image:', error);
      setLoading(false);
    };
    
    return () => {
      // Clean up by removing event listeners
      img.onload = null;
      img.onerror = null;
    };
  }, [imageUrl]);

  // Custom styles for this specific puzzle implementation
  const customStyles = {
    container: {
      width: '100%',
      maxWidth: '700px',
      height: 'auto',
      aspectRatio: '1 / 1',
      margin: '0 auto',
      position: 'relative' as const,
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
      borderRadius: '0.5rem',
      overflow: 'hidden',
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading puzzle...</span>
        </div>
      )}
      
      <div style={customStyles.container}>
        <JigsawPuzzle
          imageSrc={imageUrl}
          rows={rows}
          columns={columns}
          onSolved={() => handleOnChange(true)}
        />
      </div>
      
      {completed && (
        <div className="mt-4 p-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-md text-center">
          🎉 Puzzle completed in {solveTime?.toFixed(2)} seconds!
        </div>
      )}
      
      <div className="mt-4 text-sm text-muted-foreground">
        <p className="font-medium">Engine: React Jigsaw Puzzle</p>
        <p className="text-xs">Difficulty: {rows}x{columns}</p>
      </div>
    </div>
  );
};

export default ReactJigsawPuzzleEngine;
