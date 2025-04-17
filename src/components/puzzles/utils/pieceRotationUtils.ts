
import { PuzzlePiece } from '../types/puzzle-types';

// Rotate a piece 90 degrees clockwise
export const rotatePiece = (piece: PuzzlePiece): PuzzlePiece => {
  const currentRotation = piece.rotation || 0;
  const newRotation = (currentRotation + 90) % 360;
  
  return {
    ...piece,
    rotation: newRotation
  };
};

// Check if a piece has correct rotation (used in challenge mode)
export const hasCorrectRotation = (piece: PuzzlePiece): boolean => {
  const rotation = piece.rotation || 0;
  return rotation === 0; // In our implementation, 0 degrees is the correct orientation
};

// Apply rotation style to a piece
export const getRotationStyle = (rotation?: number): React.CSSProperties => {
  if (!rotation) return {};
  return {
    transform: `rotate(${rotation}deg)`,
    transition: 'transform 0.3s ease-in-out'
  };
};

// Initialize pieces with random rotations for challenge mode
export const initializeWithRotations = (pieces: PuzzlePiece[]): PuzzlePiece[] => {
  return pieces.map(piece => {
    // Generate a random rotation (0, 90, 180, or 270 degrees)
    const randomRotation = Math.floor(Math.random() * 4) * 90;
    return {
      ...piece,
      rotation: randomRotation
    };
  });
};

// Check if all pieces in challenge mode have correct rotation
export const allPiecesCorrectlyRotated = (pieces: PuzzlePiece[]): boolean => {
  return pieces.every(hasCorrectRotation);
};
