
import { useSimplePuzzlePieces } from '@/components/puzzles/hooks/useSimplePuzzlePieces';
import { renderHook, act } from '@testing-library/react';

jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn()
  })
}));

describe('Simple Puzzle Pieces Hook', () => {
  test('initializes with 9 pieces by default', () => {
    const { result } = renderHook(() => useSimplePuzzlePieces());
    
    expect(result.current.pieces.length).toBe(9);
    expect(result.current.moveCount).toBe(0);
    expect(result.current.isSolved).toBe(false);
  });
  
  test('shuffle function rearranges pieces', () => {
    const { result } = renderHook(() => useSimplePuzzlePieces());
    
    // Get initial positions
    const initialPiecePositions = result.current.pieces.map(p => p.position);
    
    // Shuffle
    act(() => {
      result.current.handleShuffleClick();
    });
    
    // Get positions after shuffle
    const shuffledPiecePositions = result.current.pieces.map(p => p.position);
    
    // Check that the positions changed
    expect(initialPiecePositions).not.toEqual(shuffledPiecePositions);
    
    // Check that move count was reset
    expect(result.current.moveCount).toBe(0);
  });
  
  test('tracks dragged piece', () => {
    const { result } = renderHook(() => useSimplePuzzlePieces());
    
    // Initial state should have no dragged piece
    expect(result.current.draggedPiece).toBeNull();
    
    // Set a dragged piece
    const testPiece = result.current.pieces[0];
    act(() => {
      result.current.setDraggedPiece(testPiece);
    });
    
    // Check that the dragged piece is set
    expect(result.current.draggedPiece).toEqual(testPiece);
  });
  
  test('detects puzzle completion', () => {
    const { result } = renderHook(() => useSimplePuzzlePieces());
    
    // Setup pieces in solved state
    const solvedPieces = Array(9).fill(null).map((_, i) => ({
      id: `piece-${i}`,
      position: i,
      color: `hsl(${Math.floor(Math.random() * 360)}, 80%, 60%)`,
      isDragging: false
    }));
    
    act(() => {
      // Set move count to 1 (to avoid initial state detection)
      result.current.setMoveCount(1);
      // Set pieces to solved state
      result.current.setPieces(solvedPieces);
    });
    
    // isSolved should be true
    expect(result.current.isSolved).toBe(true);
  });
});
