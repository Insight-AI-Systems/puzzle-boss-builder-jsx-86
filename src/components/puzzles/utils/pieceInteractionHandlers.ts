
import { BasePuzzlePiece } from '../types/puzzle-types';
import { checkForHints } from './pieceHintUtils';

// Function to create handlers for piece interactions
export const createPieceHandlers = <T extends BasePuzzlePiece>(
  pieces: T[],
  setPieces: React.Dispatch<React.SetStateAction<T[]>>,
  draggedPiece: T | null,
  setDraggedPiece: React.Dispatch<React.SetStateAction<T | null>>,
  incrementMoveCount: (count: number) => void,
  isSolved: boolean,
  playSound?: (soundType: 'pickup' | 'place' | 'correct' | 'complete') => void
) => {
  // Track move count for the current session
  let moveCount = 0;

  // Handle the start of a drag operation
  const handleDragStart = (piece: T) => {
    if (isSolved) return;
    
    if (playSound) playSound('pickup');
    setDraggedPiece(piece);
    
    setPieces(pieces.map(p => 
      p.id === piece.id 
        ? { ...p, isDragging: true } 
        : p
    ));
  };

  // Handle piece movement during drag
  const handleMove = (piece: T, newPosition: number) => {
    if (isSolved || !piece.isDragging) return;
    
    setPieces(pieces.map(p => 
      p.id === piece.id 
        ? { ...p, position: newPosition } 
        : p
    ));
  };

  // Handle the end of a drag operation
  const handleDrop = (piece: T) => {
    if (isSolved) return;
    
    if (playSound) playSound('place');
    
    moveCount++;
    incrementMoveCount(moveCount);
    
    const pieceId = piece.id;
    const pieceNumber = parseInt(pieceId.split('-')[1]);
    const isCorrectlyPlaced = pieceNumber === piece.position;
    
    setPieces(pieces.map(p => 
      p.id === piece.id 
        ? { 
            ...p, 
            isDragging: false,
            correctlyPlaced: isCorrectlyPlaced
          } 
        : p
    ));
    
    if (isCorrectlyPlaced && playSound) {
      playSound('correct');
    }
    
    setDraggedPiece(null);
  };

  // Handle piece click for non-drag interactions
  const handlePieceClick = (piece: T) => {
    if (isSolved) return;
    
    if (draggedPiece && draggedPiece.id !== piece.id) {
      if (playSound) playSound('place');
      
      const draggedPosition = draggedPiece.position;
      const targetPosition = piece.position;
      
      setPieces(pieces.map(p => {
        if (p.id === draggedPiece.id) {
          return { ...p, position: targetPosition, isDragging: false };
        }
        if (p.id === piece.id) {
          return { ...p, position: draggedPosition };
        }
        return p;
      }));
      
      moveCount++;
      incrementMoveCount(moveCount);
      
      setDraggedPiece(null);
    } else {
      handleDragStart(piece);
    }
  };

  // Handle directional movement for keyboard/gamepad controls
  const handleDirectionalMove = (direction: 'up' | 'down' | 'left' | 'right', gridSize: number) => {
    if (isSolved || !draggedPiece) return;
    
    const currentPosition = draggedPiece.position;
    let newPosition = currentPosition;
    
    switch (direction) {
      case 'up':
        if (currentPosition >= gridSize) {
          newPosition = currentPosition - gridSize;
        }
        break;
      case 'down':
        if (currentPosition < (gridSize * gridSize) - gridSize) {
          newPosition = currentPosition + gridSize;
        }
        break;
      case 'left':
        if (currentPosition % gridSize !== 0) {
          newPosition = currentPosition - 1;
        }
        break;
      case 'right':
        if (currentPosition % gridSize !== gridSize - 1) {
          newPosition = currentPosition + 1;
        }
        break;
    }
    
    if (newPosition !== currentPosition) {
      handleMove(draggedPiece, newPosition);
    }
  };

  return {
    handleDragStart,
    handleMove,
    handleDrop,
    handlePieceClick,
    handleDirectionalMove,
    checkForHints: () => checkForHints(pieces, setPieces, isSolved)
  };
};

export { checkForHints } from './pieceHintUtils';
export { getImagePieceStyle } from './pieceStyleUtils';
