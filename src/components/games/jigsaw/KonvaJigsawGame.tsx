import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Stage, Layer, Image as KonvaImage, Group, Rect } from 'react-konva';
import Konva from 'konva';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatTime } from '@/utils/puzzleUtils';
// @ts-ignore - headbreaker library doesn't have TypeScript definitions
import * as headbreaker from 'headbreaker';

interface KonvaJigsawGameProps {
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

interface PuzzlePiece {
  id: string;
  x: number;
  y: number;
  correctX: number;
  correctY: number;
  width: number;
  height: number;
  row: number;
  col: number;
  image?: HTMLImageElement;
  cropX: number;
  cropY: number;
  isConnected: boolean;
  groupId: string;
}

export function KonvaJigsawGame({
  difficulty = 'medium',
  pieceCount = 100,
  imageUrl,
  gameState,
  isActive = true,
  onComplete,
  onScoreUpdate,
  onMoveUpdate,
  onError
}: KonvaJigsawGameProps) {
  const stageRef = useRef<Konva.Stage>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const [selectedPiece, setSelectedPiece] = useState<string | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [moveCount, setMoveCount] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [puzzleImage, setPuzzleImage] = useState<HTMLImageElement | null>(null);

  // Use a fallback image if none provided
  const imageSrc = imageUrl || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop';

  // Calculate grid size based on difficulty
  const getGridSize = useCallback(() => {
    switch (difficulty) {
      case 'easy':
        return { rows: 3, cols: 4 };
      case 'hard':
        return { rows: 8, cols: 10 };
      default:
        return { rows: 5, cols: 6 };
    }
  }, [difficulty]);

  // Load and process the image
  useEffect(() => {
    const loadImage = () => {
      setIsLoading(true);
      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        setPuzzleImage(img);
        initializePuzzle(img);
        setIsLoading(false);
      };
      
      img.onerror = () => {
        setError('Failed to load image');
        setIsLoading(false);
        if (onError) {
          onError('Failed to load puzzle image');
        }
      };
      
      img.src = imageSrc;
    };

    if (gameStarted && !puzzleImage) {
      loadImage();
    }
  }, [gameStarted, imageSrc]);

  // Initialize puzzle pieces
  const initializePuzzle = (img: HTMLImageElement) => {
    const { rows, cols } = getGridSize();
    const pieceWidth = dimensions.width / cols;
    const pieceHeight = dimensions.height / rows;
    const newPieces: PuzzlePiece[] = [];

    // Create pieces with random initial positions
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const id = `piece-${row}-${col}`;
        const piece: PuzzlePiece = {
          id,
          x: Math.random() * (dimensions.width - pieceWidth),
          y: Math.random() * (dimensions.height - pieceHeight),
          correctX: col * pieceWidth,
          correctY: row * pieceHeight,
          width: pieceWidth,
          height: pieceHeight,
          row,
          col,
          image: img,
          cropX: col * (img.width / cols),
          cropY: row * (img.height / rows),
          isConnected: false,
          groupId: id // Initially each piece is its own group
        };
        newPieces.push(piece);
      }
    }

    setPieces(newPieces);
  };

  // Handle piece drag end
  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>, pieceId: string) => {
    const piece = pieces.find(p => p.id === pieceId);
    if (!piece) return;

    const stage = stageRef.current;
    if (!stage) return;

    const newX = e.target.x();
    const newY = e.target.y();

    // Update piece position
    const updatedPieces = pieces.map(p => {
      if (p.id === pieceId) {
        return { ...p, x: newX, y: newY };
      }
      return p;
    });

    // Check for connections
    const snapDistance = 30;
    let connected = false;

    updatedPieces.forEach((otherPiece, index) => {
      if (otherPiece.id !== pieceId) {
        // Check if pieces should connect
        const isNeighbor = 
          (Math.abs(piece.row - otherPiece.row) === 1 && piece.col === otherPiece.col) ||
          (Math.abs(piece.col - otherPiece.col) === 1 && piece.row === otherPiece.row);

        if (isNeighbor) {
          const expectedX = otherPiece.x + (piece.col - otherPiece.col) * piece.width;
          const expectedY = otherPiece.y + (piece.row - otherPiece.row) * piece.height;
          
          const distance = Math.sqrt(
            Math.pow(newX - expectedX, 2) + Math.pow(newY - expectedY, 2)
          );

          if (distance < snapDistance) {
            // Snap pieces together
            updatedPieces[updatedPieces.findIndex(p => p.id === pieceId)] = {
              ...piece,
              x: expectedX,
              y: expectedY,
              isConnected: true,
              groupId: otherPiece.groupId
            };
            connected = true;
          }
        }
      }
    });

    setPieces(updatedPieces);
    
    // Update move count
    const newMoveCount = moveCount + 1;
    setMoveCount(newMoveCount);
    if (onMoveUpdate) {
      onMoveUpdate(newMoveCount);
    }

    // Check for completion
    if (connected) {
      checkCompletion(updatedPieces);
    }
  };

  // Check if puzzle is completed
  const checkCompletion = (currentPieces: PuzzlePiece[]) => {
    const tolerance = 10;
    const isComplete = currentPieces.every(piece => {
      const distance = Math.sqrt(
        Math.pow(piece.x - piece.correctX, 2) + 
        Math.pow(piece.y - piece.correctY, 2)
      );
      return distance < tolerance;
    });

    if (isComplete && !gameCompleted) {
      setGameCompleted(true);
      if (onComplete) {
        const stats = {
          time: elapsedTime,
          moves: moveCount,
          score: calculateScore()
        };
        onComplete(stats);
      }
    }
  };

  // Calculate score
  const calculateScore = () => {
    const baseScore = 1000;
    const timeBonus = Math.max(0, 600 - elapsedTime);
    const movesPenalty = moveCount * 2;
    const difficultyMultiplier = difficulty === 'easy' ? 0.5 : difficulty === 'hard' ? 1.5 : 1;
    
    return Math.round((baseScore + timeBonus - movesPenalty) * difficultyMultiplier);
  };

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (gameStarted && !gameCompleted && isActive) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [gameStarted, gameCompleted, isActive]);

  // Handle game start
  const handleStartGame = () => {
    setGameStarted(true);
    setGameCompleted(false);
    setElapsedTime(0);
    setMoveCount(0);
    setError(null);
  };

  // Handle game reset
  const handleResetGame = () => {
    if (puzzleImage) {
      initializePuzzle(puzzleImage);
    }
    setGameCompleted(false);
    setElapsedTime(0);
    setMoveCount(0);
  };

  // Render loading state
  if (isLoading) {
    return (
      <Card className="p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p>Loading puzzle...</p>
      </Card>
    );
  }

  // Render error state
  if (error) {
    return (
      <Card className="p-8 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={handleStartGame}>Try Again</Button>
      </Card>
    );
  }

  // Render game not started state
  if (!gameStarted) {
    return (
      <Card className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Konva Enhanced Jigsaw Puzzle</h2>
        <p className="mb-4">
          Difficulty: {difficulty} | Pieces: {getGridSize().rows * getGridSize().cols}
        </p>
        <Button onClick={handleStartGame} size="lg">
          Start Puzzle
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Game Stats */}
      <Card className="p-4">
        <div className="flex justify-between items-center">
          <div className="flex gap-6">
            <div>
              <span className="text-sm text-muted-foreground">Time:</span>
              <span className="ml-2 font-bold">{formatTime(elapsedTime)}</span>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Moves:</span>
              <span className="ml-2 font-bold">{moveCount}</span>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Score:</span>
              <span className="ml-2 font-bold">{calculateScore()}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
            >
              {showPreview ? 'Hide' : 'Show'} Preview
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetGame}
            >
              Reset
            </Button>
          </div>
        </div>
      </Card>

      {/* Puzzle Canvas */}
      <Card className="p-4">
        <div className="relative">
          {/* Preview overlay */}
          {showPreview && puzzleImage && (
            <div className="absolute top-2 right-2 z-10 border-2 border-primary rounded-lg overflow-hidden">
              <img
                src={puzzleImage.src}
                alt="Preview"
                className="w-32 h-24 object-cover opacity-75"
              />
            </div>
          )}

          {/* Konva Stage */}
          <Stage
            ref={stageRef}
            width={dimensions.width}
            height={dimensions.height}
            className="border border-border rounded-lg"
          >
            <Layer>
              {/* Background */}
              <Rect
                x={0}
                y={0}
                width={dimensions.width}
                height={dimensions.height}
                fill="#f0f0f0"
              />

              {/* Puzzle pieces */}
              {pieces.map(piece => (
                <Group
                  key={piece.id}
                  x={piece.x}
                  y={piece.y}
                  draggable={!gameCompleted}
                  onDragEnd={(e) => handleDragEnd(e, piece.id)}
                  onMouseEnter={(e) => {
                    const container = e.target.getStage()?.container();
                    if (container) {
                      container.style.cursor = 'grab';
                    }
                  }}
                  onMouseLeave={(e) => {
                    const container = e.target.getStage()?.container();
                    if (container) {
                      container.style.cursor = 'default';
                    }
                  }}
                >
                  {piece.image && (
                    <KonvaImage
                      image={piece.image}
                      width={piece.width}
                      height={piece.height}
                      crop={{
                        x: piece.cropX,
                        y: piece.cropY,
                        width: piece.image.width / getGridSize().cols,
                        height: piece.image.height / getGridSize().rows
                      }}
                      stroke={piece.isConnected ? '#10b981' : '#6366f1'}
                      strokeWidth={2}
                      shadowColor="black"
                      shadowBlur={5}
                      shadowOpacity={0.3}
                      shadowOffsetX={2}
                      shadowOffsetY={2}
                    />
                  )}
                </Group>
              ))}
            </Layer>
          </Stage>

          {/* Completion message */}
          {gameCompleted && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-lg">
              <Card className="p-8 text-center">
                <h3 className="text-2xl font-bold mb-4">🎉 Puzzle Complete!</h3>
                <p className="mb-2">Time: {formatTime(elapsedTime)}</p>
                <p className="mb-2">Moves: {moveCount}</p>
                <p className="mb-4">Score: {calculateScore()}</p>
                <Button onClick={handleResetGame}>Play Again</Button>
              </Card>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}