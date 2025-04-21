
import React, { useState, useEffect, useRef } from 'react';
import { JigsawPuzzle } from 'react-jigsaw-puzzle/lib';
import 'react-jigsaw-puzzle/lib/jigsaw-puzzle.css';
import { Loader2, Clock, RefreshCcw, Image as ImageIcon } from 'lucide-react';

interface ReactJigsawPuzzleEngineProps {
  imageUrl: string;
  rows: number;
  columns: number;
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// Simple representation of a puzzle piece for staging logic
type StagedPiece = {
  id: number;
  inPuzzle: boolean;
};

const ReactJigsawPuzzleEngine: React.FC<ReactJigsawPuzzleEngineProps> = ({ 
  imageUrl, 
  rows, 
  columns 
}) => {
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [solveTime, setSolveTime] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState<number>(0);
  const [resetKey, setResetKey] = useState(0);

  // New: track staged pieces (simplistic placeholder — real drag/drop logic would be much deeper)
  const [pieces, setPieces] = useState<StagedPiece[]>([]);

  const timerRef = useRef<number | null>(null);

  // Preload image
  useEffect(() => {
    setLoading(true);
    setCompleted(false);
    setSolveTime(null);
    setStartTime(null);
    setElapsed(0);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    const img = new window.Image();
    img.src = imageUrl;
    img.onload = () => {
      setLoading(false);
      setStartTime(Date.now());
      setElapsed(0);
      // Initialize pieces: all start in the staging area (not in puzzle)
      const total = rows * columns;
      setPieces(Array.from({ length: total }).map((_, i) => ({ id: i, inPuzzle: false })));
    };
    img.onerror = (error) => {
      console.error('Error loading puzzle image:', error);
      setLoading(false);
    };
    return () => {
      img.onload = null;
      img.onerror = null;
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [imageUrl, rows, columns, resetKey]);

  // Timer logic (always runs while solving)
  useEffect(() => {
    if (!loading && !completed && startTime !== null) {
      timerRef.current = window.setInterval(() => {
        setElapsed(Math.floor((Date.now() - (startTime as number)) / 1000));
      }, 250);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [loading, completed, startTime]);

  // Mark solve time when completed
  const handleOnChange = (isSolved: boolean) => {
    if (isSolved && !completed) {
      setCompleted(true);
      const endTime = Date.now();
      if (startTime) {
        setSolveTime((endTime - startTime) / 1000);
        setElapsed(Math.floor((endTime - startTime) / 1000));
      }
      if (timerRef.current) clearInterval(timerRef.current);
      // Mark all pieces as placed (for simplicity)
      setPieces(p => p.map(piece => ({ ...piece, inPuzzle: true })));
    }
  };

  // RESET button logic
  const handleReset = () => {
    setResetKey(rk => rk + 1);
  };

  // Custom styles
  const customStyles = {
    wrapper: {
      position: 'relative' as const,
      width: '100%',
      maxWidth: '700px',
      aspectRatio: '1 / 1',
      margin: '0 auto',
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
      borderRadius: '0.5rem',
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
    },
    ghost: {
      position: 'absolute' as const,
      inset: 0,
      zIndex: 1,
      backgroundImage: `url(${imageUrl})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      opacity: 0.18,
      pointerEvents: 'none',
      transition: 'opacity 0.2s'
    },
    puzzle: {
      position: 'relative' as const,
      zIndex: 2,
    }
  };

  // "Fake" the staged area: all not-in-puzzle pieces
  const stagedPieces = pieces.filter(p => !p.inPuzzle);

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="flex items-center gap-3 mb-3 w-full justify-between max-w-xl">
        <div className="flex items-center gap-1 text-sm rounded px-2 py-1">
          <Clock className="h-4 w-4 mr-1 text-primary/80" />
          <span className="font-mono tabular-nums">{formatTime(elapsed)}</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleReset}
            className="inline-flex items-center px-3 py-1 rounded-md bg-muted hover:bg-accent text-xs font-medium border border-input shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
            type="button"
            aria-label="Reset Puzzle"
            tabIndex={0}
          >
            <RefreshCcw className="h-4 w-4 mr-1" />
            Reset
          </button>
        </div>
      </div>
      {/* Puzzle + ghost overlay */}
      <div style={customStyles.wrapper} className="relative">
        {!loading && (
          <div style={customStyles.ghost} aria-hidden="true">
            {/* Intentionally empty—background image */}
          </div>
        )}
        <div style={customStyles.puzzle}>
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading puzzle...</span>
            </div>
          )}
          <JigsawPuzzle
            key={resetKey}
            imageSrc={imageUrl}
            rows={rows}
            columns={columns}
            onSolved={() => handleOnChange(true)}
          />
        </div>
      </div>
      {/* Staging area for unused pieces */}
      {stagedPieces.length > 0 && (
        <div className="w-full max-w-xl mt-6 p-4 border rounded bg-muted/30 flex flex-wrap gap-2 justify-center">
          <div className="w-full text-xs mb-2 font-medium text-muted-foreground text-center uppercase tracking-widest">
            Staging Area ({stagedPieces.length} pieces)
          </div>
          {/* Show simple numbered tokens for now. Replace below with interactive logic as engine allows */}
          {stagedPieces.map(piece => (
            <div key={piece.id} className="w-8 h-8 bg-background/60 rounded shadow border flex items-center justify-center font-bold text-lg">
              {piece.id + 1}
            </div>
          ))}
        </div>
      )}
      {completed && (
        <div className="mt-4 p-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-md text-center">
          🎉 Puzzle completed in {solveTime?.toFixed(2)} seconds!
        </div>
      )}
      <div className="mt-4 text-sm text-muted-foreground">
        <p className="font-medium flex items-center gap-1">
          <ImageIcon className="h-4 w-4" /> Ghost (preview) enabled
        </p>
        <p className="font-medium">Engine: React Jigsaw Puzzle</p>
        <p className="text-xs">Difficulty: {rows}x{columns}</p>
      </div>
    </div>
  );
};

export default ReactJigsawPuzzleEngine;
