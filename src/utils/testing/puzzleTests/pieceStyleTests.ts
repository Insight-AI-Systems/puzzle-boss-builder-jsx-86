
import { getImagePieceStyle } from '@/components/puzzles/utils/pieceStyleUtils';
import { getRotationStyle } from '@/components/puzzles/utils/pieceRotationUtils';

describe('Piece Style Utils', () => {
  describe('getImagePieceStyle', () => {
    test('calculates correct background position for pieces', () => {
      const testPiece = {
        id: 'piece-0',
        position: 0,
        originalPosition: 0,
        isDragging: false
      };
      
      const result = getImagePieceStyle(testPiece, 'https://example.com/image.jpg', 3);
      
      expect(result).toHaveProperty('backgroundImage');
      expect(result).toHaveProperty('backgroundSize');
      expect(result).toHaveProperty('backgroundPosition');
      
      // Test for position 0,0 (top-left)
      expect(result.backgroundPosition).toBe('0% 0%');
      
      // Test for position 1,0 (top-middle)
      const piece1 = { ...testPiece, id: 'piece-1', originalPosition: 1 };
      const result1 = getImagePieceStyle(piece1, 'https://example.com/image.jpg', 3);
      expect(result1.backgroundPosition).toBe('50% 0%');
      
      // Test for position 1,1 (center)
      const piece4 = { ...testPiece, id: 'piece-4', originalPosition: 4 };
      const result4 = getImagePieceStyle(piece4, 'https://example.com/image.jpg', 3);
      expect(result4.backgroundPosition).toBe('50% 50%');
    });
  });
  
  describe('getRotationStyle', () => {
    test('returns correct transform style for different rotations', () => {
      // No rotation
      expect(getRotationStyle(0)).toEqual({
        transform: 'rotate(0deg)'
      });
      
      // 90 degree rotation
      expect(getRotationStyle(90)).toEqual({
        transform: 'rotate(90deg)'
      });
      
      // 180 degree rotation
      expect(getRotationStyle(180)).toEqual({
        transform: 'rotate(180deg)'
      });
      
      // 270 degree rotation
      expect(getRotationStyle(270)).toEqual({
        transform: 'rotate(270deg)'
      });
      
      // Handles undefined
      expect(getRotationStyle(undefined)).toEqual({
        transform: 'rotate(0deg)'
      });
    });
  });
});
