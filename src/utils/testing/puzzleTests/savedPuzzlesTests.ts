
import { useSavedPuzzles } from '@/components/puzzles/hooks/useSavedPuzzles';
import { renderHook, act } from '@testing-library/react';
import { SavedPuzzleState } from '@/components/puzzles/types/save-types';

jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn()
  })
}));

describe('Saved Puzzles Hook', () => {
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
  
  beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();
  });
  
  test('initializes with empty savedGames', () => {
    const { result } = renderHook(() => useSavedPuzzles());
    
    expect(result.current.savedGames).toEqual([]);
  });
  
  test('saves and retrieves a game', () => {
    const { result } = renderHook(() => useSavedPuzzles());
    
    const testSave: SavedPuzzleState = {
      id: 'test-save-1',
      name: 'Test Save',
      timestamp: Date.now(),
      difficulty: '3x3',
      pieces: [],
      moveCount: 10,
      timeSpent: 120,
      selectedImage: 'https://example.com/image.jpg',
      version: '1.0.0'
    };
    
    act(() => {
      result.current.saveGame(testSave);
    });
    
    // Should have one saved game
    expect(result.current.savedGames.length).toBe(1);
    expect(result.current.savedGames[0].id).toBe('test-save-1');
    
    // Save a second game
    const testSave2 = { ...testSave, id: 'test-save-2', name: 'Test Save 2' };
    
    act(() => {
      result.current.saveGame(testSave2);
    });
    
    // Should have two saved games
    expect(result.current.savedGames.length).toBe(2);
  });
  
  test('deletes a saved game', () => {
    const { result } = renderHook(() => useSavedPuzzles());
    
    const testSave: SavedPuzzleState = {
      id: 'test-save-1',
      name: 'Test Save',
      timestamp: Date.now(),
      difficulty: '3x3',
      pieces: [],
      moveCount: 10,
      timeSpent: 120,
      selectedImage: 'https://example.com/image.jpg',
      version: '1.0.0'
    };
    
    const testSave2 = { ...testSave, id: 'test-save-2', name: 'Test Save 2' };
    
    act(() => {
      result.current.saveGame(testSave);
      result.current.saveGame(testSave2);
    });
    
    // Should have two saved games
    expect(result.current.savedGames.length).toBe(2);
    
    // Delete the first save
    act(() => {
      result.current.deleteSave('test-save-1');
    });
    
    // Should have one saved game left
    expect(result.current.savedGames.length).toBe(1);
    expect(result.current.savedGames[0].id).toBe('test-save-2');
  });
  
  test('overwrites a save with same ID', () => {
    const { result } = renderHook(() => useSavedPuzzles());
    
    const testSave: SavedPuzzleState = {
      id: 'test-save-1',
      name: 'Test Save',
      timestamp: Date.now(),
      difficulty: '3x3',
      pieces: [],
      moveCount: 10,
      timeSpent: 120,
      selectedImage: 'https://example.com/image.jpg',
      version: '1.0.0'
    };
    
    act(() => {
      result.current.saveGame(testSave);
    });
    
    // Update the same save
    const updatedSave = { ...testSave, moveCount: 20, timeSpent: 240 };
    
    act(() => {
      result.current.saveGame(updatedSave);
    });
    
    // Should still have one saved game
    expect(result.current.savedGames.length).toBe(1);
    // With updated values
    expect(result.current.savedGames[0].moveCount).toBe(20);
    expect(result.current.savedGames[0].timeSpent).toBe(240);
  });
});
