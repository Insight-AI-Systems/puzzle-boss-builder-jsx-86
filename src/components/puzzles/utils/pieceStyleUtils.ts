
import { BasePuzzlePiece } from '../types/puzzle-types';

export const getImagePieceStyle = (piece: BasePuzzlePiece, imageUrl: string, gridSize: number): React.CSSProperties => {
  // Extract the original piece number from the id
  const pieceNumber = parseInt(piece.id.split('-')[1]);
  
  // Calculate row and column for the original position
  const row = Math.floor(pieceNumber / gridSize);
  const col = pieceNumber % gridSize;
  
  // Calculate the background position to show the correct part of the image
  // Use percentage-based positioning for better scaling
  const xPosition = (col * 100 / (gridSize - 1));
  const yPosition = (row * 100 / (gridSize - 1));
  
  return {
    backgroundImage: imageUrl ? `url(${imageUrl})` : 'none',
    backgroundSize: `${gridSize * 100}%`,
    backgroundPosition: `${xPosition}% ${yPosition}%`,
    opacity: piece.isDragging ? 0.8 : 1,
    backgroundRepeat: 'no-repeat',
  };
};
