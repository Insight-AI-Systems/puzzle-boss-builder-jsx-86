import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { calculatePiecePosition, calculatePieceStyle, formatTime } from '@/utils/puzzleUtils';

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

interface PuzzlePiece {
  id: string;
  currentPosition: number;
  correctPosition: number;
  isPlaced: boolean;
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
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [moveCount, setMoveCount] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const [selectedPiece, setSelectedPiece] = useState<string | null>(null);
  const [draggedPiece, setDraggedPiece] = useState<string | null>(null);

  // Calculate grid dimensions
  const gridSize = Math.sqrt(pieceCount);
  const rows = Math.ceil(gridSize);
  const columns = Math.ceil(gridSize);
  
  // Use a fallback image if none provided
  const puzzleImage = imageUrl || '/placeholder.svg';

  console.log('🧩 JigsawGame rendered with:', {
    imageUrl: puzzleImage,
    pieceCount,
    difficulty,
    isActive,
    gameStarted
  });

  // Initialize puzzle pieces
  useEffect(() => {
    if (isActive && !gameStarted) {
      initializePuzzle();
    }
  }, [isActive, pieceCount]);

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

  const initializePuzzle = () => {
    console.log('🧩 Initializing puzzle with', pieceCount, 'pieces');
    
    // Create puzzle pieces
    const newPieces: PuzzlePiece[] = [];
    for (let i = 0; i < pieceCount; i++) {
      newPieces.push({
        id: `piece-${i}`,
        currentPosition: i,
        correctPosition: i,
        isPlaced: false
      });
    }
    
    // Shuffle pieces
    const shuffledPieces = [...newPieces];
    for (let i = shuffledPieces.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = shuffledPieces[i].currentPosition;
      shuffledPieces[i].currentPosition = shuffledPieces[j].currentPosition;
      shuffledPieces[j].currentPosition = temp;
    }
    
    setPieces(shuffledPieces);
    setGameStarted(true);
    setElapsedTime(0);
    setMoveCount(0);
    setGameCompleted(false);
    console.log('🧩 Puzzle initialized with shuffled pieces');
  };

  const handlePieceClick = (pieceId: string) => {
    if (gameCompleted) return;
    
    setSelectedPiece(pieceId === selectedPiece ? null : pieceId);
    console.log('🧩 Piece selected:', pieceId);
  };

  const handleSlotClick = (slotPosition: number) => {
    if (!selectedPiece || gameCompleted) return;
    
    const pieceIndex = pieces.findIndex(p => p.id === selectedPiece);
    if (pieceIndex === -1) return;
    
    // Check if slot is already occupied
    const occupiedBy = pieces.find(p => p.currentPosition === slotPosition);
    
    if (occupiedBy && occupiedBy.id !== selectedPiece) {
      // Swap pieces
      const newPieces = [...pieces];
      const selectedPieceData = newPieces[pieceIndex];
      const occupiedPieceIndex = newPieces.findIndex(p => p.id === occupiedBy.id);
      
      const tempPosition = selectedPieceData.currentPosition;
      newPieces[pieceIndex].currentPosition = slotPosition;
      newPieces[occupiedPieceIndex].currentPosition = tempPosition;
      
      setPieces(newPieces);
    } else {
      // Move piece to empty slot
      const newPieces = [...pieces];
      newPieces[pieceIndex].currentPosition = slotPosition;
      setPieces(newPieces);
    }
    
    setMoveCount(prev => {
      const newCount = prev + 1;
      onMoveUpdate?.(newCount);
      return newCount;
    });
    
    setSelectedPiece(null);
    
    // Check for completion
    checkCompletion();
  };

  const checkCompletion = () => {
    const allPlaced = pieces.every(piece => piece.currentPosition === piece.correctPosition);
    
    if (allPlaced) {
      setGameCompleted(true);
      const finalScore = calculateScore();
      onScoreUpdate?.(finalScore);
      onComplete?.({
        score: finalScore,
        time: elapsedTime,
        moves: moveCount,
        difficulty,
        pieceCount
      });
      console.log('🧩 Puzzle completed!', { score: finalScore, time: elapsedTime, moves: moveCount });
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
    setSelectedPiece(null);
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
        <Button onClick={initializePuzzle}>Try Again</Button>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Puzzle Board */}
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">Puzzle Board</h3>
          <div 
            className="grid gap-1 bg-gray-200 p-2 rounded"
            style={{ 
              gridTemplateColumns: `repeat(${columns}, 1fr)`,
              aspectRatio: '1'
            }}
          >
            {Array.from({ length: pieceCount }, (_, index) => {
              const pieceInSlot = pieces.find(p => p.currentPosition === index);
              return (
                <div
                  key={`slot-${index}`}
                  className={`
                    aspect-square border-2 border-gray-300 cursor-pointer rounded
                    ${pieceInSlot?.correctPosition === index ? 'border-green-500 bg-green-100' : 'border-gray-300'}
                    ${!pieceInSlot ? 'bg-gray-100' : ''}
                  `}
                  onClick={() => handleSlotClick(index)}
                  style={pieceInSlot ? calculatePieceStyle(
                    pieceInSlot.id,
                    pieceInSlot.correctPosition,
                    rows,
                    columns,
                    300,
                    300,
                    puzzleImage
                  ) : {}}
                />
              );
            })}
          </div>
        </Card>

        {/* Piece Tray */}
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">Piece Tray</h3>
          <div 
            className="grid gap-2 max-h-96 overflow-y-auto"
            style={{ gridTemplateColumns: `repeat(${Math.min(columns, 6)}, 1fr)` }}
          >
            {pieces.map((piece) => (
              <div
                key={piece.id}
                className={`
                  aspect-square border-2 cursor-pointer rounded transition-all
                  ${selectedPiece === piece.id ? 'border-blue-500 shadow-lg' : 'border-gray-300'}
                  ${piece.currentPosition === piece.correctPosition ? 'opacity-50' : 'hover:border-blue-400'}
                `}
                onClick={() => handlePieceClick(piece.id)}
                style={calculatePieceStyle(
                  piece.id,
                  piece.correctPosition,
                  rows,
                  columns,
                  200,
                  200,
                  puzzleImage
                )}
              />
            ))}
          </div>
        </Card>
      </div>

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