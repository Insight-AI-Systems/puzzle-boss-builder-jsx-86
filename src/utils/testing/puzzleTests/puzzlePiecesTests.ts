
import { usePuzzlePieces } from '@/components/puzzles/hooks/usePuzzlePieces';
import { act, renderHook } from '@testing-library/react';

jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn()
  })
}));

describe('Puzzle Pieces Hook', () => {
  const mockSetIsLoading = jest.fn();
  const defaultTestImage = 'https://example.com/test-image.jpg';
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock Image loading
    const originalImage = global.Image;
    global.Image = class {
      onload: () => void = () => {};
      onerror: () => void = () => {};
      src: string = '';
      crossOrigin: string | null = null;
      
      constructor() {
        setTimeout(() => this.onload(), 10);
      }
    } as any;
    
    return () => {
      global.Image = originalImage;
    };
  });
  
  test('initializes with correct grid size based on difficulty', () => {
    const { result } = renderHook(() => 
      usePuzzlePieces('3x3', defaultTestImage, true, mockSetIsLoading));
    
    expect(result.current.gridSize).toBe(3);
    
    const { result: result4x4 } = renderHook(() => 
      usePuzzlePieces('4x4', defaultTestImage, true, mockSetIsLoading));
    
    expect(result4x4.current.gridSize).toBe(4);
  });
  
  test('shuffle function creates a different piece arrangement', async () => {
    const { result, waitForNextUpdate } = renderHook(() => 
      usePuzzlePieces('3x3', defaultTestImage, true, mockSetIsLoading));
    
    // Wait for image loading to complete
    await waitForNextUpdate();
    
    // Get initial positions
    const initialPositions = result.current.pieces.map(p => p.position);
    
    // Shuffle
    act(() => {
      result.current.handleShuffleClick();
    });
    
    // Get new positions
    const newPositions = result.current.pieces.map(p => p.position);
    
    // Check that something changed
    expect(JSON.stringify(initialPositions) !== JSON.stringify(newPositions)).toBe(true);
  });
  
  test('tracks move count correctly', async () => {
    const { result, waitForNextUpdate } = renderHook(() => 
      usePuzzlePieces('3x3', defaultTestImage, true, mockSetIsLoading));
    
    // Wait for image loading to complete
    await waitForNextUpdate();
    
    expect(result.current.moveCount).toBe(0);
    
    act(() => {
      result.current.setMoveCount(5);
    });
    
    expect(result.current.moveCount).toBe(5);
  });
});
