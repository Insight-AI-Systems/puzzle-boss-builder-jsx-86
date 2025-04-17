
import { useState, useEffect } from 'react';
import { PuzzlePiece, difficultyConfig, DifficultyLevel } from '../types/puzzle-types';
import { useToast } from '@/hooks/use-toast';

export const usePuzzlePieces = (
  difficulty: DifficultyLevel, 
  selectedImage: string,
  isLoading: boolean,
  setIsLoading: (value: boolean) => void
) => {
  const { toast } = useToast();
  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const [draggedPiece, setDraggedPiece] = useState<PuzzlePiece | null>(null);
  const [moveCount, setMoveCount] = useState(0);
  const [isSolved, setIsSolved] = useState(false);
  
  const gridSize = difficultyConfig[difficulty].gridSize;
  const pieceCount = gridSize * gridSize;
  
  // Initialize puzzle pieces
  useEffect(() => {
    if (isLoading) {
      setIsSolved(false);
      setMoveCount(0);
      setDraggedPiece(null);
      
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = `${selectedImage}?w=600&h=600&fit=crop&auto=format`;
      
      img.onload = () => {
        initializePuzzlePieces();
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
    }
  }, [difficulty, selectedImage, isLoading]);
  
  // Create puzzle pieces
  const initializePuzzlePieces = () => {
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
  
  // Check if puzzle is solved
  useEffect(() => {
    if (pieces.length === 0) return;
    
    const solved = pieces.every((piece) => {
      const pieceNumber = parseInt(piece.id.split('-')[1]);
      return pieceNumber === pieces.indexOf(piece);
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

  // Shuffle pieces
  const handleShuffleClick = () => {
    if (isSolved) {
      setIsSolved(false);
    }
    
    console.log("Shuffling pieces");
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
  
  return {
    pieces,
    setPieces,
    draggedPiece,
    setDraggedPiece,
    moveCount,
    setMoveCount,
    isSolved,
    setIsSolved,
    gridSize,
    handleShuffleClick,
  };
};
