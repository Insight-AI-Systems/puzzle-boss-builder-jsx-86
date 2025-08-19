import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
// @ts-ignore
import * as headbreaker from 'headbreaker';

interface FixedHeadreakerProps {
  difficulty?: 'easy' | 'medium' | 'hard';
  imageUrl?: string;
  onComplete?: (stats: any) => void;
}

export function FixedHeadbreaker({
  difficulty = 'medium',
  imageUrl,
  onComplete
}: FixedHeadreakerProps) {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const puzzleRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [moveCount, setMoveCount] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);

  // Use local images that don't have CORS issues
  const defaultImages = [
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxkZWZzPgogICAgICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZCIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+CiAgICAgICAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiM2NjdlZWE7c3RvcC1vcGFjaXR5OjEiIC8+CiAgICAgICAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6Izc2NGJhMjtzdG9wLW9wYWNpdHk6MSIgLz4KICAgICAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPC9kZWZzPgogICAgPHJlY3Qgd2lkdGg9IjgwMCIgaGVpZ2h0PSI2MDAiIGZpbGw9InVybCgjZ3JhZCkiLz4KICAgIDxjaXJjbGUgY3g9IjIwMCIgY3k9IjE1MCIgcj0iODAiIGZpbGw9IiNmZmYiIG9wYWNpdHk9IjAuMyIvPgogICAgPGNpcmNsZSBjeD0iNjAwIiBjeT0iNDUwIiByPSIxMjAiIGZpbGw9IiNmZmYiIG9wYWNpdHk9IjAuMiIvPgogICAgPHJlY3QgeD0iMzUwIiB5PSIyNTAiIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjZmZmIiBvcGFjaXR5PSIwLjI1IiB0cmFuc2Zvcm09InJvdGF0ZSg0NSA0MDAgMzAwKSIvPgogICAgPHBhdGggZD0iTTEwMCA0MDBMMjAwIDMwMEwzMDAgNDAwTDI1MCA1MDBMMTUwIDUwMFoiIGZpbGw9IiNmZmYiIG9wYWNpdHk9IjAuMiIvPgogICAgPHRleHQgeD0iNDAwIiB5PSIzMDAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSI0OCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+UHV6emxlIFRlc3Q8L3RleHQ+Cjwvc3ZnPg==',
    '/api/placeholder/800/600'
  ];

  const puzzleImageUrl = imageUrl || defaultImages[0];

  const getGridSize = () => {
    switch (difficulty) {
      case 'easy': return { rows: 3, cols: 3 };
      case 'hard': return { rows: 5, cols: 5 };
      default: return { rows: 4, cols: 4 };
    }
  };

  const initializePuzzle = async () => {
    if (!canvasContainerRef.current) {
      setError('Canvas container not ready');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Clear any existing content
      if (canvasContainerRef.current) {
        canvasContainerRef.current.innerHTML = '';
      }

      // Create a canvas element
      const canvas = document.createElement('canvas');
      canvas.width = 800;
      canvas.height = 600;
      canvas.style.border = '2px solid #8b5cf6';
      canvas.style.borderRadius = '8px';
      canvas.style.background = '#1a1a1a';
      canvasContainerRef.current.appendChild(canvas);
      canvasRef.current = canvas;

      // Create image
      const img = new Image();
      img.crossOrigin = 'anonymous';

      // For base64 images, we don't need CORS
      if (puzzleImageUrl.startsWith('data:')) {
        img.src = puzzleImageUrl;
      } else {
        // For external images, try to load with CORS
        img.src = puzzleImageUrl;
      }

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = () => {
          console.warn('Failed to load image, using fallback');
          // Use fallback SVG image
          img.src = defaultImages[0];
          img.onload = resolve;
          img.onerror = reject;
        };
      });

      const { rows, cols } = getGridSize();

      // Create Headbreaker puzzle
      const puzzle = new headbreaker.Canvas(canvas, {
        width: 800,
        height: 600,
        pieceSize: 100,
        image: img,
        proximity: 20,
        borderFill: 10,
        strokeWidth: 2,
        lineSoftness: 0.12
      });

      // Generate puzzle
      puzzle.autogenerate({
        horizontalPiecesCount: cols,
        verticalPiecesCount: rows
      });

      // Shuffle pieces
      puzzle.shuffle(0.7);
      
      // Draw puzzle
      puzzle.draw();

      // Store reference
      puzzleRef.current = puzzle;

      // Add event listeners
      puzzle.onConnect(() => {
        setMoveCount(prev => prev + 1);
        console.log('Piece connected!');
      });

      puzzle.onDisconnect(() => {
        setMoveCount(prev => prev + 1);
      });

      // Check for completion
      puzzle.attachSolvedValidator();
      puzzle.onValid(() => {
        const endTime = Date.now();
        const timeTaken = startTime ? Math.floor((endTime - startTime) / 1000) : 0;
        
        if (onComplete) {
          onComplete({
            time: timeTaken,
            moves: moveCount,
            score: Math.max(0, 1000 - timeTaken * 5 - moveCount * 2)
          });
        }
        
        alert(`🎉 Puzzle Complete!\nTime: ${timeTaken}s\nMoves: ${moveCount}`);
      });

      setGameStarted(true);
      setStartTime(Date.now());
      setIsLoading(false);

    } catch (err) {
      console.error('Error initializing puzzle:', err);
      setError('Failed to initialize puzzle. Please try again.');
      setIsLoading(false);
    }
  };

  const handleStart = () => {
    initializePuzzle();
  };

  const handleReset = () => {
    if (puzzleRef.current) {
      puzzleRef.current.shuffle(0.7);
      puzzleRef.current.draw();
      setMoveCount(0);
      setStartTime(Date.now());
    }
  };

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (puzzleRef.current) {
        try {
          puzzleRef.current.destroy?.();
        } catch (e) {
          console.log('Cleanup error:', e);
        }
      }
    };
  }, []);

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={handleStart}>Try Again</Button>
        </div>
      </Card>
    );
  }

  if (!gameStarted) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <h3 className="text-xl font-bold mb-4">Headbreaker Puzzle Engine</h3>
          <p className="mb-4">Difficulty: {difficulty} ({getGridSize().rows}x{getGridSize().cols} pieces)</p>
          <Button onClick={handleStart} size="lg">
            Start Puzzle
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            <span>Moves: <strong>{moveCount}</strong></span>
            <span>Difficulty: <strong>{difficulty}</strong></span>
          </div>
          <Button onClick={handleReset} variant="outline" size="sm">
            Shuffle Again
          </Button>
        </div>
      </Card>

      <Card className="p-4">
        <div ref={canvasContainerRef} className="flex justify-center">
          {isLoading && (
            <div className="flex items-center justify-center h-[600px]">
              <div className="text-lg">Loading puzzle...</div>
            </div>
          )}
        </div>
      </Card>

      <Card className="p-4 bg-blue-50 dark:bg-blue-900/20">
        <p className="text-sm">
          <strong>How to play:</strong> Drag and drop pieces to connect them. 
          Pieces will snap together when they're in the right position.
        </p>
      </Card>
    </div>
  );
}