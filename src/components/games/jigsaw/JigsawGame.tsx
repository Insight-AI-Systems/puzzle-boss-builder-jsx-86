import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatTime } from '@/utils/puzzleUtils';
// @ts-ignore - headbreaker library doesn't have TypeScript definitions
import * as headbreaker from 'headbreaker';

interface JigsawGameProps {
  difficulty?: 'easy' | 'medium' | 'hard';
  pieceCount?: 20 | 100 | 500;
  imageUrl?: string;
  gameState?: any;
  isActive?: boolean;
  onComplete?: (stats: any) => void;
  onScoreUpdate?: (score: number) => void;
  onMoveUpdate?: (moves: number) => void;
  onError?: (error: string) => void;
}

export function JigsawGame({
  difficulty = 'medium',
  pieceCount = 100,
  imageUrl,
  gameState,
  isActive = true,
  onComplete,
  onScoreUpdate,
  onMoveUpdate,
  onError
}: JigsawGameProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const puzzleRef = useRef<any>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [moveCount, setMoveCount] = useState(0);
  const [showPreview, setShowPreview] = useState(false);

  // Use a fallback image if none provided
  const puzzleImage = imageUrl || 'https://placekitten.com/800/600';

  console.log('🧩 JigsawGame rendered with:', {
    imageUrl: puzzleImage,
    pieceCount,
    difficulty,
    isActive,
    gameStarted
  });

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameStarted && !gameCompleted) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted, gameCompleted]);

  // Initialize puzzle when canvas is ready
  useEffect(() => {
    // Add a small delay to ensure canvas is properly mounted
    const timer = setTimeout(() => {
      if (isActive && canvasRef.current) {
        initializePuzzle();
      }
    }, 100);
    
    return () => {
      clearTimeout(timer);
      // Cleanup puzzle on unmount
      if (puzzleRef.current) {
        puzzleRef.current.destroy?.();
      }
    };
  }, [isActive, pieceCount, puzzleImage]);

  const initializePuzzle = async () => {
    console.log('🧩 Initializing headbreaker puzzle with', pieceCount, 'pieces');
    setIsLoading(true);
    setError(null);
    
    try {
      // Check if headbreaker is available
      if (!headbreaker || !headbreaker.Canvas) {
        throw new Error('Headbreaker library not available');
      }

      if (!canvasRef.current) {
        console.warn('🧩 Canvas ref not ready yet. Retrying initialization...');
        setIsLoading(true);
        let attempts = 0;
        const retry = () => {
          attempts++;
          if (canvasRef.current) {
            initializePuzzle();
          } else if (attempts < 20) {
            setTimeout(retry, 100);
          } else {
            console.error('🧩 Canvas still not available after retries');
            setError('Failed to initialize puzzle: Canvas not available');
            setIsLoading(false);
          }
        };
        setTimeout(retry, 100);
        return;
      }

      // Clear any existing puzzle
      if (puzzleRef.current) {
        puzzleRef.current.destroy?.();
      }
      // Clear container content to avoid duplicate canvases
      canvasRef.current.innerHTML = '';

      // Calculate grid size based on piece count
      const gridSize = Math.sqrt(pieceCount);
      const rows = Math.ceil(gridSize);
      const cols = Math.ceil(gridSize);

      // Using canvas element directly

      // Load image and then create canvas and puzzle
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        try {
          // Create the puzzle canvas inside the container div
          const canvas = new headbreaker.Canvas(canvasRef.current, {
            width: 800,
            height: 600,
            image: img,
            pieceSize: Math.floor(400 / Math.max(cols, rows)),
            proximity: 20,
            borderFill: 10,
            strokeWidth: 2,
            lineSoftness: 0.18
          });

          // Create puzzle and generate pieces
          const puzzle = new headbreaker.Puzzle(canvas, {
            horizontalPiecesCount: cols,
            verticalPiecesCount: rows
          });

          puzzle.autogenerate();
          puzzle.shuffle(0.8);
          puzzle.draw();

          // Keep reference to the puzzle for events/cleanup
          puzzleRef.current = puzzle;

          console.log('🧩 Puzzle created, pieces count:', puzzle.pieces.length);

          // Add event listeners
          puzzle.onConnect((piece: any, target: any) => {
            console.log('🧩 Piece connected');
            setMoveCount(prev => {
              const newCount = prev + 1;
              onMoveUpdate?.(newCount);
              return newCount;
            });
            
            // Check completion
            if (puzzle.isValid()) {
              setGameCompleted(true);
              const finalScore = calculateScore();
              onScoreUpdate?.(finalScore);
              onComplete?.({
                score: finalScore,
                time: elapsedTime,
                moves: moveCount + 1,
                difficulty,
                pieceCount
              });
              console.log('🧩 Puzzle completed!');
            }
          });

          puzzle.onDisconnect(() => {
            console.log('🧩 Piece disconnected');
            setMoveCount(prev => {
              const newCount = prev + 1;
              onMoveUpdate?.(newCount);
              return newCount;
            });
          });

          // Start the game
          setGameStarted(true);
          setElapsedTime(0);
          setMoveCount(0);
          setGameCompleted(false);
          setIsLoading(false);
          
          console.log('🧩 Headbreaker puzzle initialized successfully');

        } catch (err) {
          console.error('🧩 Error creating puzzle:', err);
          setError('Failed to create puzzle with headbreaker');
          setIsLoading(false);
        }
      };

      img.onerror = () => {
        console.error('🧩 Failed to load image:', puzzleImage);
        setError('Failed to load puzzle image');
        setIsLoading(false);
      };

      img.src = puzzleImage;

    } catch (err) {
      console.error('🧩 Error initializing puzzle:', err);
      setError(`Failed to initialize puzzle: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setIsLoading(false);
    }
  };

  const calculateScore = (): number => {
    // Score based on time and moves (lower is better, but we want higher score)
    const timeBonus = Math.max(0, 10000 - elapsedTime * 10);
    const moveBonus = Math.max(0, 5000 - moveCount * 5);
    const difficultyMultiplier = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 1.5 : 2;
    
    return Math.round((timeBonus + moveBonus) * difficultyMultiplier);
  };

  const handleReset = () => {
    console.log('🧩 Resetting puzzle');
    setGameStarted(false);
    setGameCompleted(false);
    initializePuzzle();
  };

  const togglePreview = () => {
    setShowPreview(!showPreview);
    console.log('🧩 Toggling preview:', !showPreview);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-lg">Loading puzzle...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px] space-y-4">
        <div className="text-lg text-red-600">Error: {error}</div>
        <Button onClick={() => { setError(null); setTimeout(() => initializePuzzle(), 100); }}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      {/* Game Controls */}
      <Card className="mb-4 p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-4">
            <Button onClick={handleReset} variant="outline">
              Reset Puzzle
            </Button>
            <Button onClick={togglePreview} variant="outline">
              {showPreview ? 'Hide' : 'Show'} Preview
            </Button>
          </div>
          <div className="flex gap-6 text-sm">
            <span>Time: {formatTime(elapsedTime)}</span>
            <span>Moves: {moveCount}</span>
            <span>Pieces: {pieceCount}</span>
          </div>
        </div>
        
        {gameCompleted && (
          <div className="text-center p-4 bg-green-100 rounded-lg">
            <h3 className="text-lg font-bold text-green-800">Puzzle Completed! 🎉</h3>
            <p className="text-green-600">
              Time: {formatTime(elapsedTime)} | Moves: {moveCount} | Score: {calculateScore()}
            </p>
          </div>
        )}
      </Card>

      {/* Puzzle Canvas */}
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Jigsaw Puzzle</h3>
        <div className="flex justify-center">
          <div
            ref={canvasRef}
            id="puzzle-canvas"
            className="border border-gray-300 rounded shadow-lg"
            style={{ width: 800, height: 600, maxWidth: '100%' }}
          />
        </div>
        <div className="mt-4 text-sm text-gray-600 text-center">
          <p>Drag pieces from the tray (right side) to the puzzle area (left side)</p>
          <p>Pieces will snap together when correctly aligned</p>
        </div>
      </Card>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Puzzle Preview</h3>
              <Button onClick={togglePreview} variant="outline" size="sm">
                Close
              </Button>
            </div>
            <img 
              src={puzzleImage} 
              alt="Puzzle preview" 
              className="w-full h-auto rounded"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder.svg';
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default JigsawGame;