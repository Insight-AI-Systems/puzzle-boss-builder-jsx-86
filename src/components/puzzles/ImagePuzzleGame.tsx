
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Shuffle, Image as ImageIcon } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

type DifficultyLevel = '3x3' | '4x4' | '5x5';

interface PuzzlePiece {
  id: string;
  position: number;
  originalPosition: number;
  isDragging: boolean;
}

interface ImagePuzzleGameProps {
  sampleImages?: string[];
}

const DEFAULT_IMAGES = [
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb', // landscape
  'https://images.unsplash.com/photo-1518877593221-1f28583780b4', // whale
  'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7', // code
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5', // matrix
];

const difficultyConfig = {
  '3x3': { gridSize: 3, containerClass: 'grid-cols-3' },
  '4x4': { gridSize: 4, containerClass: 'grid-cols-4' },
  '5x5': { gridSize: 5, containerClass: 'grid-cols-5' },
};

const ImagePuzzleGame: React.FC<ImagePuzzleGameProps> = ({ sampleImages = DEFAULT_IMAGES }) => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('3x3');
  const [selectedImage, setSelectedImage] = useState<string>(sampleImages[0]);
  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const [draggedPiece, setDraggedPiece] = useState<PuzzlePiece | null>(null);
  const [moveCount, setMoveCount] = useState(0);
  const [isSolved, setIsSolved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const gridSize = difficultyConfig[difficulty].gridSize;
  const pieceCount = gridSize * gridSize;
  
  // Initialize game whenever difficulty or selected image changes
  useEffect(() => {
    setIsLoading(true);
    setIsSolved(false);
    setMoveCount(0);
    setDraggedPiece(null);
    
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = `${selectedImage}?w=600&h=600&fit=crop&auto=format`;
    
    img.onload = () => {
      if (imgRef.current) {
        imgRef.current.src = img.src;
      }
      
      initializePuzzlePieces(img);
      setIsLoading(false);
    };
    
    img.onerror = () => {
      toast({
        title: "Error loading image",
        description: "Could not load the selected image. Please try another one.",
        variant: "destructive",
      });
      setIsLoading(false);
    };
  }, [difficulty, selectedImage]);
  
  // Create puzzle pieces from the loaded image
  const initializePuzzlePieces = (img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const pieceWidth = img.width / gridSize;
    const pieceHeight = img.height / gridSize;
    
    // Create array of puzzle pieces
    const initialPieces: PuzzlePiece[] = [];
    
    for (let i = 0; i < pieceCount; i++) {
      initialPieces.push({
        id: `piece-${i}`,
        position: i,
        originalPosition: i,
        isDragging: false
      });
    }
    
    // Shuffle pieces
    const shuffledPieces = [...initialPieces]
      .sort(() => Math.random() - 0.5)
      .map((p, index) => ({
        ...p,
        position: index
      }));
    
    setPieces(shuffledPieces);
  };
  
  // Create an image sprite for a specific puzzle piece
  const getPieceStyle = (piece: PuzzlePiece, index: number): React.CSSProperties => {
    const pieceNumber = parseInt(piece.id.split('-')[1]);
    const row = Math.floor(pieceNumber / gridSize);
    const col = pieceNumber % gridSize;
    
    return {
      backgroundImage: `url(${selectedImage}?w=600&h=600&fit=crop&auto=format)`,
      backgroundSize: `${gridSize * 100}%`,
      backgroundPosition: `${col * 100 / (gridSize - 1)}% ${row * 100 / (gridSize - 1)}%`,
      opacity: piece.isDragging ? 0.8 : 1,
      transform: piece.isDragging ? 'scale(0.95)' : 'scale(1)',
    };
  };
  
  // Check if puzzle is solved
  useEffect(() => {
    if (pieces.length === 0) return;
    
    const solved = pieces.every((piece, index) => {
      const pieceNumber = parseInt(piece.id.split('-')[1]);
      return pieceNumber === index;
    });
    
    if (solved && !isSolved && moveCount > 0) {
      setIsSolved(true);
      toast({
        title: "Puzzle Solved!",
        description: `You completed the ${difficulty} puzzle in ${moveCount} moves.`,
        variant: "default",
      });
    }
  }, [pieces, isSolved, moveCount, difficulty, toast]);

  // Handle interaction events
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent, piece: PuzzlePiece) => {
    if (isSolved) return;
    
    e.preventDefault();
    setDraggedPiece(piece);
    
    // Update piece state
    setPieces(pieces.map(p => 
      p.id === piece.id 
        ? { ...p, isDragging: true } 
        : p
    ));
  };
  
  const handleDrop = (e: React.MouseEvent | React.TouchEvent, targetIndex: number) => {
    e.preventDefault();
    
    if (!draggedPiece || isSolved) {
      return;
    }
    
    // Find the source piece position
    const sourceIndex = pieces.findIndex(p => p.id === draggedPiece.id);
    
    if (sourceIndex === -1) {
      return;
    }
    
    if (sourceIndex !== targetIndex) {
      // Create a new array with swapped positions
      const newPieces = [...pieces];
      const temp = newPieces[sourceIndex];
      newPieces[sourceIndex] = newPieces[targetIndex];
      newPieces[targetIndex] = temp;
      
      // Update position property
      newPieces[sourceIndex].position = sourceIndex;
      newPieces[targetIndex].position = targetIndex;
      
      // Reset dragging state
      setPieces(newPieces.map(p => ({ ...p, isDragging: false })));
      setDraggedPiece(null);
      
      // Increment move count
      setMoveCount(prev => prev + 1);
    } else {
      // Reset dragging state without counting as a move
      setPieces(pieces.map(p => ({ ...p, isDragging: false })));
      setDraggedPiece(null);
    }
  };
  
  const handlePieceClick = (piece: PuzzlePiece) => {
    if (isSolved) return;
    
    // For touch screens - implement click to select and then click to place
    if (draggedPiece && draggedPiece.id !== piece.id) {
      // Find the source and target indices
      const sourceIndex = pieces.findIndex(p => p.id === draggedPiece.id);
      const targetIndex = pieces.findIndex(p => p.id === piece.id);
      
      if (sourceIndex !== -1 && targetIndex !== -1) {
        // Create a new array with swapped positions
        const newPieces = [...pieces];
        const temp = newPieces[sourceIndex];
        newPieces[sourceIndex] = newPieces[targetIndex];
        newPieces[targetIndex] = temp;
        
        // Update position property
        newPieces[sourceIndex].position = sourceIndex;
        newPieces[targetIndex].position = targetIndex;
        
        // Reset dragging state
        setPieces(newPieces.map(p => ({ ...p, isDragging: false })));
        setDraggedPiece(null);
        
        // Increment move count
        setMoveCount(prev => prev + 1);
      }
    } else {
      // Select or deselect the piece
      if (draggedPiece?.id === piece.id) {
        // Deselect if clicking the same piece
        setPieces(pieces.map(p => ({ ...p, isDragging: false })));
        setDraggedPiece(null);
      } else {
        // Select a new piece
        setDraggedPiece(piece);
        setPieces(pieces.map(p => 
          p.id === piece.id 
            ? { ...p, isDragging: true } 
            : { ...p, isDragging: false }
        ));
      }
    }
  };

  const handleShuffleClick = () => {
    if (isSolved) {
      setIsSolved(false);
    }
    
    // Shuffle the pieces
    setPieces(prevPieces => {
      const shuffled = [...prevPieces].sort(() => Math.random() - 0.5);
      // Update positions after shuffle
      return shuffled.map((p, index) => ({
        ...p,
        position: index,
        isDragging: false
      }));
    });
    setDraggedPiece(null);
    setMoveCount(0);
  };
  
  // Directional movement for better mobile UX
  const handleDirectionalMove = (direction: 'up' | 'down' | 'left' | 'right') => {
    if (!draggedPiece || isSolved) return;
    
    const sourceIndex = pieces.findIndex(p => p.id === draggedPiece.id);
    if (sourceIndex === -1) return;
    
    const row = Math.floor(sourceIndex / gridSize);
    const col = sourceIndex % gridSize;
    
    let targetRow = row;
    let targetCol = col;
    
    switch (direction) {
      case 'up':
        targetRow = Math.max(0, row - 1);
        break;
      case 'down':
        targetRow = Math.min(gridSize - 1, row + 1);
        break;
      case 'left':
        targetCol = Math.max(0, col - 1);
        break;
      case 'right':
        targetCol = Math.min(gridSize - 1, col + 1);
        break;
    }
    
    const targetIndex = targetRow * gridSize + targetCol;
    
    // Only process if we're actually moving to a different position
    if (targetIndex !== sourceIndex) {
      handleDrop({ preventDefault: () => {} } as React.MouseEvent, targetIndex);
    }
  };

  // Calculate container size based on screen size and difficulty
  const getContainerSize = () => {
    if (isMobile) {
      return {
        width: 300,
        height: 300,
        pieceSize: 300 / gridSize
      };
    }
    
    // Decrease size as grid gets larger
    const baseSize = 360;
    const size = difficulty === '5x5' ? baseSize - 30 : baseSize;
    
    return {
      width: size,
      height: size,
      pieceSize: size / gridSize
    };
  };
  
  const containerSize = getContainerSize();

  return (
    <div className="flex flex-col items-center">
      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} width="600" height="600" className="hidden" />
      <img ref={imgRef} className="hidden" alt="Source" />
      
      {/* Controls and info */}
      <div className="mb-4 w-full max-w-[360px]">
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm text-puzzle-aqua">
            Moves: {moveCount}
          </div>
          <Button 
            onClick={handleShuffleClick}
            className="bg-puzzle-gold hover:bg-puzzle-gold/80 text-black"
          >
            <Shuffle className="w-4 h-4 mr-2" />
            Shuffle
          </Button>
        </div>
        
        {/* Difficulty selector */}
        <div className="flex justify-between gap-2 mb-2">
          <div className="w-1/2">
            <Select 
              value={difficulty} 
              onValueChange={(value: string) => setDifficulty(value as DifficultyLevel)}
              disabled={isLoading}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3x3">Easy (3×3)</SelectItem>
                <SelectItem value="4x4">Medium (4×4)</SelectItem>
                <SelectItem value="5x5">Hard (5×5)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Image selector */}
          <div className="w-1/2">
            <Select 
              value={selectedImage} 
              onValueChange={setSelectedImage}
              disabled={isLoading}
            >
              <SelectTrigger className="w-full">
                <ImageIcon className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Image" />
              </SelectTrigger>
              <SelectContent>
                {sampleImages.map((img, index) => (
                  <SelectItem key={img} value={img}>
                    Image {index + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      {/* Puzzle grid */}
      {isLoading ? (
        <div 
          className="flex items-center justify-center bg-puzzle-black/60 rounded-lg border-2 border-puzzle-aqua animate-pulse"
          style={{ width: containerSize.width, height: containerSize.height }}
        >
          <p className="text-puzzle-aqua">Loading puzzle...</p>
        </div>
      ) : (
        <div 
          className={`grid gap-1 bg-puzzle-black/60 p-2 rounded-lg border-2 
            ${isSolved ? 'border-puzzle-gold animate-pulse' : 'border-puzzle-aqua'}
            ${difficultyConfig[difficulty].containerClass}`}
          style={{ 
            width: containerSize.width, 
            height: containerSize.height 
          }}
        >
          {pieces.map((piece, index) => (
            <div 
              key={piece.id}
              onMouseDown={(e) => handleDragStart(e, piece)}
              onTouchStart={(e) => handleDragStart(e, piece)}
              onMouseUp={(e) => handleDrop(e, index)}
              onTouchEnd={(e) => handleDrop(e, index)}
              onClick={() => handlePieceClick(piece)}
              className={`flex items-center justify-center rounded cursor-pointer shadow-md transition-all
                ${piece.isDragging ? 'ring-2 ring-white scale-95' : 'scale-100'}
                ${isSolved ? 'ring-1 ring-puzzle-gold/50' : ''}`}
              style={{ 
                ...getPieceStyle(piece, index),
                width: containerSize.pieceSize - 2,
                height: containerSize.pieceSize - 2,
              }}
            >
              {difficulty === '5x5' ? null : (
                <span className={`text-lg font-bold text-white drop-shadow-md bg-black/30 w-6 h-6 flex items-center justify-center rounded-full
                  ${piece.isDragging ? 'scale-110' : ''}`}
                >
                  {parseInt(piece.id.split('-')[1]) + 1}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
      
      {/* Mobile-friendly directional controls */}
      {(isMobile || draggedPiece) && !isSolved && !isLoading && (
        <div className="mt-4 grid grid-cols-3 gap-2 w-[200px]">
          <div></div>
          <Button 
            size="icon" 
            variant="outline" 
            onClick={() => handleDirectionalMove('up')}
            className="aspect-square"
            disabled={!draggedPiece}
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
          <div></div>
          <Button 
            size="icon" 
            variant="outline" 
            onClick={() => handleDirectionalMove('left')}
            className="aspect-square"
            disabled={!draggedPiece}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center justify-center text-xs text-puzzle-aqua">
            {draggedPiece ? `Move ${parseInt(draggedPiece.id.split('-')[1]) + 1}` : 'Select a piece'}
          </div>
          <Button 
            size="icon" 
            variant="outline" 
            onClick={() => handleDirectionalMove('right')}
            className="aspect-square"
            disabled={!draggedPiece}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <div></div>
          <Button 
            size="icon" 
            variant="outline" 
            onClick={() => handleDirectionalMove('down')}
            className="aspect-square"
            disabled={!draggedPiece}
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
          <div></div>
        </div>
      )}
      
      <p className="mt-4 text-sm text-puzzle-aqua">
        {isSolved 
          ? "Puzzle solved! Shuffle to play again."
          : isLoading
            ? "Loading puzzle..."
            : isMobile 
              ? "Tap a piece to select, then tap another to swap"
              : "Click or drag pieces to rearrange the puzzle"
        }
      </p>
      
      {isSolved && (
        <div className="mt-2 text-puzzle-gold font-bold animate-pulse">
          🏆 Puzzle Solved in {moveCount} moves! 🏆
        </div>
      )}
    </div>
  );
};

export default ImagePuzzleGame;
