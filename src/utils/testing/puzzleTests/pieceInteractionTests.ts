
import { createPieceHandlers } from '@/components/puzzles/utils/pieceInteractionHandlers';

describe('Piece Interaction Handlers', () => {
  // Test setup
  const mockPieces = [
    { id: 'piece-0', position: 0, isDragging: false },
    { id: 'piece-1', position: 1, isDragging: false },
    { id: 'piece-2', position: 2, isDragging: false },
  ];
  const mockSetPieces = jest.fn();
  const mockSetDraggedPiece = jest.fn();
  const mockIncrementMoves = jest.fn();
  const mockPlaySound = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('handleDragStart sets dragged piece correctly', () => {
    const handlers = createPieceHandlers(
      mockPieces,
      mockSetPieces,
      null,
      mockSetDraggedPiece,
      mockIncrementMoves,
      false,
      mockPlaySound
    );
    
    handlers.handleDragStart(mockPieces[0]);
    
    // Check that the setDraggedPiece was called
    expect(mockSetDraggedPiece).toHaveBeenCalledWith(mockPieces[0]);
    
    // Check that the setPieces was called to update isDragging
    expect(mockSetPieces).toHaveBeenCalled();
    
    // Verify that the sound was played
    expect(mockPlaySound).toHaveBeenCalledWith('pickup');
  });
  
  test('handleDrop clears dragged piece', () => {
    const draggedPiece = { ...mockPieces[0], isDragging: true };
    
    const handlers = createPieceHandlers(
      mockPieces,
      mockSetPieces,
      draggedPiece,
      mockSetDraggedPiece,
      mockIncrementMoves,
      false,
      mockPlaySound
    );
    
    handlers.handleDrop(draggedPiece);
    
    // Check that the setDraggedPiece was called with null
    expect(mockSetDraggedPiece).toHaveBeenCalledWith(null);
    
    // Check that the setPieces was called to update isDragging
    expect(mockSetPieces).toHaveBeenCalled();
  });
  
  test('handleMove swaps pieces', () => {
    const draggedPiece = { ...mockPieces[0], isDragging: true };
    let currentPieces = [...mockPieces];
    
    // Override mockSetPieces to actually update our local copy
    mockSetPieces.mockImplementation((updater) => {
      if (typeof updater === 'function') {
        currentPieces = updater(currentPieces);
      } else {
        currentPieces = updater;
      }
      return currentPieces;
    });
    
    const handlers = createPieceHandlers(
      currentPieces,
      mockSetPieces,
      draggedPiece,
      mockSetDraggedPiece,
      mockIncrementMoves,
      false,
      mockPlaySound
    );
    
    // Move piece 0 to position 2
    handlers.handleMove(draggedPiece, 2);
    
    // Check that the move counter was incremented
    expect(mockIncrementMoves).toHaveBeenCalled();
    
    // Verify that the positions were swapped
    expect(currentPieces.find(p => p.id === 'piece-0')?.position).toBe(2);
    expect(currentPieces.find(p => p.id === 'piece-2')?.position).toBe(0);
    
    // Verify that the sound was played
    expect(mockPlaySound).toHaveBeenCalledWith('place');
  });
  
  test('handleDirectionalMove moves piece in specified direction', () => {
    const draggedPiece = { ...mockPieces[1], isDragging: true, position: 4 }; // Center of 3x3 grid
    let currentPieces = [
      { id: 'piece-0', position: 0, isDragging: false },
      { id: 'piece-1', position: 4, isDragging: true }, // Dragged piece in center
      { id: 'piece-2', position: 1, isDragging: false },
      { id: 'piece-3', position: 3, isDragging: false },
      { id: 'piece-4', position: 5, isDragging: false },
      { id: 'piece-5', position: 6, isDragging: false },
      { id: 'piece-6', position: 7, isDragging: false },
      { id: 'piece-7', position: 8, isDragging: false },
      { id: 'piece-8', position: 2, isDragging: false },
    ];
    
    // Override mockSetPieces to actually update our local copy
    mockSetPieces.mockImplementation((updater) => {
      if (typeof updater === 'function') {
        currentPieces = updater(currentPieces);
      } else {
        currentPieces = updater;
      }
      return currentPieces;
    });
    
    const handlers = createPieceHandlers(
      currentPieces,
      mockSetPieces,
      draggedPiece,
      mockSetDraggedPiece,
      mockIncrementMoves,
      false,
      mockPlaySound
    );
    
    // Move up (from position 4 to 1)
    handlers.handleDirectionalMove('up', 3);
    
    // Check that the move counter was incremented
    expect(mockIncrementMoves).toHaveBeenCalled();
    
    // Verify that the positions were swapped
    expect(currentPieces.find(p => p.id === 'piece-1')?.position).toBe(1);
    expect(currentPieces.find(p => p.id === 'piece-2')?.position).toBe(4);
  });
});
