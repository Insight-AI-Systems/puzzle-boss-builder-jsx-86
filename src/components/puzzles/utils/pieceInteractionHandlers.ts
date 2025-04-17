
import { BasePuzzlePiece } from '../types/puzzle-types';

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
    
    // Play pickup sound if available
    if (playSound) playSound('pickup');
    
    setDraggedPiece(piece);
    
    // Update the piece's dragging state
    setPieces(pieces.map(p => 
      p.id === piece.id 
        ? { ...p, isDragging: true } 
        : p
    ));
  };

  // Handle piece movement during drag
  const handleMove = (piece: T, newPosition: number) => {
    if (isSolved || !piece.isDragging) return;
    
    // Update the piece's position
    setPieces(pieces.map(p => 
      p.id === piece.id 
        ? { ...p, position: newPosition } 
        : p
    ));
  };

  // Handle the end of a drag operation
  const handleDrop = (piece: T) => {
    if (isSolved) return;
    
    // Play place sound if available
    if (playSound) playSound('place');
    
    // Update move count
    moveCount++;
    incrementMoveCount(moveCount);
    
    // Check if the piece is in its correct position
    const pieceId = piece.id;
    const pieceNumber = parseInt(pieceId.split('-')[1]);
    const isCorrectlyPlaced = pieceNumber === piece.position;
    
    // Update the piece's state
    setPieces(pieces.map(p => 
      p.id === piece.id 
        ? { 
            ...p, 
            isDragging: false,
            correctlyPlaced: isCorrectlyPlaced
          } 
        : p
    ));
    
    // Play correct sound if the piece is placed correctly
    if (isCorrectlyPlaced && playSound) {
      playSound('correct');
    }
    
    setDraggedPiece(null);
  };

  // Handle piece click for non-drag interactions
  const handlePieceClick = (piece: T) => {
    if (isSolved) return;
    
    // If we already have a dragged piece, swap positions
    if (draggedPiece && draggedPiece.id !== piece.id) {
      // Play place sound if available
      if (playSound) playSound('place');
      
      // Swap positions
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
      
      // Update move count
      moveCount++;
      incrementMoveCount(moveCount);
      
      setDraggedPiece(null);
    } else {
      // Start dragging this piece
      handleDragStart(piece);
    }
  };

  // Handle directional movement for keyboard/gamepad controls
  const handleDirectionalMove = (direction: 'up' | 'down' | 'left' | 'right', gridSize: number) => {
    if (isSolved || !draggedPiece) return;
    
    const currentPosition = draggedPiece.position;
    let newPosition = currentPosition;
    
    // Calculate the new position based on direction
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
    
    // If position changed, update the piece
    if (newPosition !== currentPosition) {
      handleMove(draggedPiece, newPosition);
    }
  };

  // Function to check for nearby pieces to provide hints
  const checkForHints = () => {
    // Only provide hints if the puzzle is not solved
    if (isSolved) return;
    
    // Find pieces that are close to their correct position
    const hintablePieceIds: string[] = [];
    
    pieces.forEach(piece => {
      const pieceId = piece.id;
      const pieceNumber = parseInt(pieceId.split('-')[1]);
      const correctPosition = pieceNumber;
      
      // If piece is within 1-2 positions of its correct spot
      if (piece.position !== correctPosition) {
        const currentRow = Math.floor(piece.position / 3);
        const currentCol = piece.position % 3;
        const correctRow = Math.floor(correctPosition / 3);
        const correctCol = correctPosition % 3;
        
        // Calculate Manhattan distance
        const distance = Math.abs(currentRow - correctRow) + Math.abs(currentCol - correctCol);
        
        // If piece is close to its correct position, add it to hintable pieces
        if (distance === 1) {
          hintablePieceIds.push(pieceId);
        }
      }
    });
    
    // Randomly select up to 2 pieces to hint
    if (hintablePieceIds.length > 2) {
      hintablePieceIds.sort(() => Math.random() - 0.5);
      hintablePieceIds.splice(2);
    }
    
    // Update pieces with hints
    setPieces(prev => {
      return prev.map(piece => {
        if (hintablePieceIds.includes(piece.id)) {
          return { ...piece, showHint: true };
        }
        return { ...piece, showHint: false };
      });
    });
  };

  return {
    handleDragStart,
    handleMove,
    handleDrop,
    handlePieceClick,
    handleDirectionalMove,
    checkForHints
  };
};

// Add the missing getImagePieceStyle function
export const getImagePieceStyle = (piece: BasePuzzlePiece, imageUrl: string, gridSize: number): React.CSSProperties => {
  const pieceNumber = parseInt(piece.id.split('-')[1]);
  
  // Calculate row and column for the original position
  const row = Math.floor(pieceNumber / gridSize);
  const col = pieceNumber % gridSize;
  
  // Calculate the background position to show the correct part of the image
  const xOffset = -(col * 100 / (gridSize - 1));
  const yOffset = -(row * 100 / (gridSize - 1));
  
  return {
    backgroundImage: `url(${imageUrl})`,
    backgroundSize: `${gridSize * 100}%`,
    backgroundPosition: `${xOffset}% ${yOffset}%`,
    opacity: piece.isDragging ? 0.8 : 1,
  };
};
