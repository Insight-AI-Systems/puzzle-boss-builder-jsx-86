
import { PuzzlePiece } from '../types/puzzle-types';

export const createPieceHandlers = (
  pieces: PuzzlePiece[], 
  setPieces: (pieces: PuzzlePiece[]) => void,
  draggedPiece: PuzzlePiece | null, 
  setDraggedPiece: (piece: PuzzlePiece | null) => void,
  incrementMoves: () => void,
  playSound: (sound: string) => void
) => {
  const handleDragStart = (piece: PuzzlePiece) => {
    setDraggedPiece(piece);
    playSound('pickup');
    
    setPieces(pieces.map(p => 
      p.id === piece.id ? { ...p, isDragging: true } : p
    ));
  };

  const handleMove = (piece: PuzzlePiece, index: number) => {
    if (draggedPiece && draggedPiece.id === piece.id) {
      const newPieces = [...pieces];
      const draggedIndex = newPieces.findIndex(p => p.id === piece.id);
      
      // Swap positions
      [newPieces[draggedIndex].position, newPieces[index].position] = 
      [newPieces[index].position, newPieces[draggedIndex].position];
      
      setPieces(newPieces);
      incrementMoves();
      playSound('place');
    }
  };

  const handleDrop = () => {
    if (draggedPiece) {
      setPieces(pieces.map(p => 
        p.id === draggedPiece.id ? { ...p, isDragging: false } : p
      ));
      setDraggedPiece(null);
    }
  };

  const handlePieceClick = (piece: PuzzlePiece) => {
    playSound('pickup');
  };

  const handleDirectionalMove = (direction: 'up' | 'down' | 'left' | 'right') => {
    if (!draggedPiece) return;
    
    // Implementation depends on grid layout
    console.log(`Move ${draggedPiece.id} to ${direction}`);
  };

  return {
    handleDragStart,
    handleMove,
    handleDrop,
    handlePieceClick,
    handleDirectionalMove
  };
};
