import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// Dynamic import to avoid SSR issues
let headbreaker: any = null;

interface SimpleHeadreakerProps {
  difficulty?: 'easy' | 'medium' | 'hard';
}

export function SimpleHeadbreaker({ difficulty = 'easy' }: SimpleHeadreakerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const puzzleRef = useRef<any>(null);
  const [status, setStatus] = useState('Loading headbreaker library...');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Dynamic import of headbreaker
    import('headbreaker').then((module) => {
      headbreaker = module;
      setStatus('Headbreaker library loaded');
      setIsReady(true);
    }).catch((err) => {
      setStatus(`Failed to load headbreaker: ${err.message}`);
      console.error('Headbreaker load error:', err);
    });
  }, []);

  const createSimplePuzzle = () => {
    if (!headbreaker || !canvasRef.current) {
      setStatus('Library or canvas not ready');
      return;
    }

    setStatus('Creating puzzle...');

    try {
      // Clear any existing puzzle
      if (puzzleRef.current) {
        puzzleRef.current = null;
      }

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      // Create a simple gradient as our image
      const gradient = ctx!.createLinearGradient(0, 0, 400, 300);
      gradient.addColorStop(0, '#667eea');
      gradient.addColorStop(1, '#764ba2');
      ctx!.fillStyle = gradient;
      ctx!.fillRect(0, 0, 400, 300);
      
      // Add some shapes
      ctx!.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx!.beginPath();
      ctx!.arc(100, 75, 40, 0, Math.PI * 2);
      ctx!.fill();
      
      ctx!.beginPath();
      ctx!.arc(300, 225, 60, 0, Math.PI * 2);
      ctx!.fill();
      
      // Create image from canvas
      canvas.toBlob((blob) => {
        if (!blob) {
          setStatus('Failed to create image');
          return;
        }

        const img = new Image();
        img.onload = () => {
          try {
            setStatus('Creating puzzle from image...');
            
            // Create new puzzle
            const puzzle = new headbreaker.Canvas(canvas, {
              width: 400,
              height: 300,
              pieceSize: difficulty === 'easy' ? 100 : difficulty === 'medium' ? 75 : 50,
              image: img,
              proximity: 20,
              borderFill: 10,
              strokeWidth: 2,
              lineSoftness: 0.12
            });

            // Generate pieces
            const pieces = difficulty === 'easy' ? 2 : difficulty === 'medium' ? 3 : 4;
            puzzle.autogenerate({
              horizontalPiecesCount: pieces,
              verticalPiecesCount: pieces
            });

            // Shuffle
            puzzle.shuffle(0.7);
            
            // Draw
            puzzle.draw();
            
            puzzleRef.current = puzzle;
            
            // Add event listeners
            let connections = 0;
            puzzle.onConnect(() => {
              connections++;
              setStatus(`Connected ${connections} pieces!`);
            });

            puzzle.attachSolvedValidator();
            puzzle.onValid(() => {
              setStatus('🎉 Puzzle Complete!');
            });

            setStatus('Puzzle ready! Drag pieces to solve.');
          } catch (err: any) {
            setStatus(`Puzzle creation error: ${err.message}`);
            console.error('Puzzle creation error:', err);
          }
        };

        img.onerror = () => {
          setStatus('Failed to load generated image');
        };

        img.src = URL.createObjectURL(blob);
      });
    } catch (err: any) {
      setStatus(`Error: ${err.message}`);
      console.error('Error in createSimplePuzzle:', err);
    }
  };

  const shufflePuzzle = () => {
    if (puzzleRef.current) {
      puzzleRef.current.shuffle(0.7);
      puzzleRef.current.draw();
      setStatus('Pieces shuffled!');
    }
  };

  return (
    <Card className="p-6 space-y-4">
      <div className="text-center">
        <h3 className="text-xl font-bold mb-2">Simple Headbreaker Test</h3>
        <p className="text-sm text-muted-foreground mb-4">{status}</p>
      </div>

      <div className="flex justify-center gap-2">
        <Button 
          onClick={createSimplePuzzle} 
          disabled={!isReady}
          variant="default"
        >
          Create Puzzle
        </Button>
        <Button 
          onClick={shufflePuzzle}
          variant="outline"
        >
          Shuffle
        </Button>
      </div>

      <div className="flex justify-center">
        <canvas
          ref={canvasRef}
          width={400}
          height={300}
          className="border-2 border-purple-500 rounded-lg bg-gray-900"
        />
      </div>

      <div className="text-xs text-muted-foreground text-center">
        Difficulty: {difficulty} | 
        Library loaded: {isReady ? '✅' : '⏳'} |
        Canvas ready: {canvasRef.current ? '✅' : '❌'}
      </div>
    </Card>
  );
}