
import { BasePuzzlePiece } from '../types/puzzle-types';

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
