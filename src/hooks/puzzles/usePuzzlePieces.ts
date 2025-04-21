
import { useState, useEffect, useCallback, useRef } from 'react';
import { PuzzlePiece, difficultyConfig, DifficultyLevel } from '../components/puzzles/types/puzzle-types';
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
  
  const cleanupRef = useRef<(() => void) | null>(null);
  
  const gridSize = difficultyConfig[difficulty].gridSize;
  const pieceCount = gridSize * gridSize;
  
  useEffect(() => {
    if (isLoading) {
      setIsSolved(false);
      setMoveCount(0);
      setDraggedPiece(null);
      
      const img = new Image();
      img.crossOrigin = "anonymous";
      
      const cacheBuster = process.env.NODE_ENV === 'development' ? `&cb=${Date.now()}` : '';
      
      const size = gridSize * 100;
      img.src = `${selectedImage}?w=${size}&h=${size}&fit=crop&auto=format${cacheBuster}`;
      
      cleanupRef.current = () => {
        img.onload = null;
        img.onerror = null;
      };
      
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
      
      return () => {
        if (cleanupRef.current) {
          cleanupRef.current();
        }
      };
    }
  }, [difficulty, selectedImage, isLoading, gridSize, toast]);
  
  const initializePuzzlePieces = useCallback(() => {
    console.time('initializePieces');
    const initialPieces: PuzzlePiece[] = [];
    
    for (let i = 0; i < pieceCount; i++) {
      initialPieces.push({
        id: `piece-${i}`,
        position: i,
        originalPosition: i,
        isDragging: false
      });
    }
    
    const shuffledPieces = shufflePieces([...initialPieces]);
    setPieces(shuffledPieces);
    console.timeEnd('initializePieces');
  }, [pieceCount]);
  
  const shufflePieces = useCallback((piecesToShuffle: PuzzlePiece[]): PuzzlePiece[] => {
    console.time('shufflePieces');
    for (let i = piecesToShuffle.length - 1; i > 0; i--) {
      const j = Math.floor((window.crypto ? 
        window.crypto.getRandomValues(new Uint32Array(1))[0] / 4294967296 : 
        Math.random()) * (i + 1));
      
      [piecesToShuffle[i], piecesToShuffle[j]] = [piecesToShuffle[j], piecesToShuffle[i]];
    }
    
    const result = piecesToShuffle.map((p, index) => ({
      ...p,
      position: index
    }));
    console.timeEnd('shufflePieces');
    return result;
  }, []);

  const handleShuffleClick = useCallback(() => {
    if (isSolved) {
      setIsSolved(false);
    }
    
    console.time('handleShuffle');
    setPieces(prevPieces => {
      const shuffled = shufflePieces([...prevPieces]);
      return shuffled.map(p => ({
        ...p,
        isDragging: false
      }));
    });
    setDraggedPiece(null);
    setMoveCount(0);
    console.timeEnd('handleShuffle');
  }, [isSolved, shufflePieces]);
  
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
