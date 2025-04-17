
import { act, renderHook } from '@testing-library/react';
import { usePuzzlePieces } from '@/components/puzzles/hooks/usePuzzlePieces';
import { usePuzzleState } from '@/components/puzzles/hooks/usePuzzleState';
import { createPieceHandlers } from '@/components/puzzles/utils/pieceInteractionHandlers';

jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn()
  })
}));

describe('Puzzle Game Integration Tests', () => {
  beforeEach(() => {
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

  test('Complete puzzle solving scenario', async () => {
    // 1. Initialize puzzle state
    const { result: puzzleStateResult } = renderHook(() => usePuzzleState('3x3'));
    
    // 2. Initialize puzzle pieces
    const mockSetIsLoading = jest.fn();
    const { result: piecesResult, waitForNextUpdate } = renderHook(() => 
      usePuzzlePieces('3x3', 'https://example.com/test.jpg', true, mockSetIsLoading)
    );
    
    // Wait for image loading
    await waitForNextUpdate();
    
    // 3. Start new puzzle
    act(() => {
      puzzleStateResult.current.startNewPuzzle('3x3');
    });
    
    expect(puzzleStateResult.current.isActive).toBe(true);
    
    // 4. Create piece handlers
    const handlers = createPieceHandlers(
      piecesResult.current.pieces,
      piecesResult.current.setPieces,
      null,
      piecesResult.current.setDraggedPiece,
      (count) => {
        piecesResult.current.setMoveCount(count);
        puzzleStateResult.current.incrementMoves();
      },
      false,
      jest.fn()
    );
    
    // 5. Manually arrange pieces to solved state
    act(() => {
      // Create a solved arrangement (each piece at its original position)
      const solvedPieces = piecesResult.current.pieces.map((piece, index) => ({
        ...piece,
        position: parseInt(piece.id.split('-')[1])
      }));
      
      piecesResult.current.setPieces(solvedPieces);
      // Need at least one move for completion detection
      piecesResult.current.setMoveCount(1);
    });
    
    // 6. Check completion
    act(() => {
      const isComplete = puzzleStateResult.current.checkCompletion(
        9, 9
      );
      expect(isComplete).toBe(true);
    });
    
    // 7. Verify game state after completion
    expect(puzzleStateResult.current.isComplete).toBe(true);
    expect(puzzleStateResult.current.isActive).toBe(false);
  });
  
  test('Game Mode - Timed functionality', async () => {
    // 1. Initialize puzzle state with timed mode
    const { result: puzzleStateResult } = renderHook(() => 
      usePuzzleState('3x3', 'timed', 60) // 60 seconds time limit
    );
    
    // 2. Start new puzzle in timed mode
    act(() => {
      puzzleStateResult.current.startNewPuzzle('3x3', 'timed', 60);
    });
    
    expect(puzzleStateResult.current.isActive).toBe(true);
    expect(puzzleStateResult.current.gameMode).toBe('timed');
    expect(puzzleStateResult.current.timeLimit).toBe(60);
    
    // 3. Advance time manually (simulate 30 seconds passing)
    for (let i = 0; i < 30; i++) {
      act(() => {
        // @ts-ignore - Directly accessing private property for testing
        puzzleStateResult.current.timeSpent += 1;
      });
    }
    
    // 4. Check time remaining
    expect(puzzleStateResult.current.timeSpent).toBe(30);
    
    // 5. Simulate the game ending before timeout
    act(() => {
      puzzleStateResult.current.checkCompletion(9, 9);
    });
    
    // 6. Verify game completed state
    expect(puzzleStateResult.current.isComplete).toBe(true);
    expect(puzzleStateResult.current.isActive).toBe(false);
  });
  
  test('Save/Load functionality integration', async () => {
    // Mock localStorage
    const localStorageMock = (() => {
      let store: Record<string, string> = {};
      
      return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => {
          store[key] = value.toString();
        },
        clear: () => {
          store = {};
        }
      };
    })();
    
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock
    });
    
    // 1. Initialize puzzle state
    const { result: puzzleStateResult } = renderHook(() => usePuzzleState('3x3'));
    
    // 2. Start new puzzle
    act(() => {
      puzzleStateResult.current.startNewPuzzle('3x3');
    });
    
    // 3. Make some moves
    act(() => {
      for (let i = 0; i < 5; i++) {
        puzzleStateResult.current.incrementMoves();
      }
    });
    
    // 4. Advance time
    act(() => {
      // @ts-ignore - Directly accessing private property for testing
      puzzleStateResult.current.timeSpent = 120; // 2 minutes
    });
    
    // 5. Create mock save data
    const saveData = {
      id: 'test-save',
      name: 'Test Save',
      timestamp: Date.now(),
      difficulty: puzzleStateResult.current.difficulty,
      pieces: [],
      moveCount: puzzleStateResult.current.moveCount,
      timeSpent: puzzleStateResult.current.timeSpent,
      selectedImage: 'https://example.com/test.jpg',
      version: '1.0.0'
    };
    
    // 6. Save to localStorage
    localStorageMock.setItem('puzzle_saves', JSON.stringify({ saves: [saveData] }));
    
    // 7. Initialize a new puzzle state
    const { result: newPuzzleState } = renderHook(() => usePuzzleState('4x4')); // Different difficulty
    
    // 8. Load the saved state
    act(() => {
      newPuzzleState.current.loadState(
        saveData.timeSpent,
        'classic',
        300
      );
    });
    
    // 9. Verify loaded state
    expect(newPuzzleState.current.timeSpent).toBe(120);
    expect(newPuzzleState.current.isActive).toBe(true);
  });
});
