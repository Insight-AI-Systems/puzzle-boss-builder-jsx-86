import { useState, useEffect, useCallback } from 'react';

export interface PuzzlePiece {
  id: number;
  position: number;
  originalPosition: number;
  isDragging: boolean;
}

export const usePuzzleState = (rows: number, columns: number, imageUrl: string, initialShowGuideImage: boolean) => {
  const [puzzlePieces, setPuzzlePieces] = useState<PuzzlePiece[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const [showGuideImage, setShowGuideImage] = useState<boolean>(initialShowGuideImage);
  const [solveTime, setSolveTime] = useState<number | null>(null);
  const [draggedPiece, setDraggedPiece] = useState<number | null>(null);

  const initPuzzle = useCallback(() => {
    const pieces: PuzzlePiece[] = [];
    const pieceCount = rows * columns;

    for (let i = 0; i < pieceCount; i++) {
      pieces.push({
        id: i,
        position: -1,
        originalPosition: i,
        isDragging: false
      });
    }

    const shuffledPositions = shuffleArray([...Array(pieceCount).keys()]);
    const shuffledPieces = pieces.map((piece, index) => ({
      ...piece,
      position: shuffledPositions[index]
    }));

    setPuzzlePieces(shuffledPieces);
    setIsComplete(false);
  }, [rows, columns]);

  useEffect(() => {
    initPuzzle();
  }, [initPuzzle, imageUrl, rows, columns]);

  const resetPuzzle = useCallback(() => {
    initPuzzle();
    setIsComplete(false);
    setHasStarted(false);
    setSolveTime(null);
  }, [initPuzzle]);

  const shufflePieces = useCallback(() => {
    const pieceCount = rows * columns;
    const shuffledPositions = shuffleArray([...Array(pieceCount).keys()]);
    
    setPuzzlePieces(prev => {
      return prev.map((piece, index) => ({
        ...piece,
        position: shuffledPositions[index],
        isDragging: false
      }));
    });
    
    setIsComplete(false);
  }, [rows, columns]);

  const toggleGuideImage = useCallback(() => {
    console.log('Toggling guide image, current value:', showGuideImage);
    setShowGuideImage(prev => {
      const newValue = !prev;
      console.log('New guide image value:', newValue);
      return newValue;
    });
  }, [showGuideImage]);

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const isPieceCorrect = useCallback((id: number) => {
    const piece = puzzlePieces.find(p => p.id === id);
    return piece ? piece.position === piece.originalPosition : false;
  }, [puzzlePieces]);

  const placePiece = useCallback((id: number, position: number) => {
    setPuzzlePieces(prev => {
      const pieceAtPosition = prev.find(p => p.position === position);
      
      const updatedPieces = prev.map(piece => {
        if (piece.id === id) {
          return { ...piece, position, isDragging: false };
        } else if (pieceAtPosition && piece.id === pieceAtPosition.id) {
          return { ...piece, position: prev.find(p => p.id === id)?.position || -1 };
        }
        return piece;
      });
      
      const isNowComplete = updatedPieces.every(piece => piece.position === piece.originalPosition);
      if (isNowComplete) {
        setIsComplete(true);
      }
      
      return updatedPieces;
    });
  }, []);

  return {
    puzzlePieces,
    setPuzzlePieces,
    isComplete,
    isLoading,
    setIsLoading,
    hasStarted, 
    setHasStarted,
    showGuideImage,
    toggleGuideImage,
    solveTime,
    setSolveTime,
    resetPuzzle,
    placePiece,
    isPieceCorrect,
    draggedPiece,
    setDraggedPiece,
    shufflePieces
  };
};
