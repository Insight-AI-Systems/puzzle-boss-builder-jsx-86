
import { formatTime, usePuzzleState } from '@/components/puzzles/hooks/usePuzzleState';
import { act, renderHook } from '@testing-library/react';

describe('Puzzle State Functions', () => {
  describe('formatTime function', () => {
    test('formats seconds correctly', () => {
      expect(formatTime(0)).toBe('00:00');
      expect(formatTime(30)).toBe('00:30');
      expect(formatTime(60)).toBe('01:00');
      expect(formatTime(90)).toBe('01:30');
      expect(formatTime(3661)).toBe('61:01'); // Over an hour
    });
  });

  describe('usePuzzleState hook', () => {
    test('initializes with default values', () => {
      const { result } = renderHook(() => usePuzzleState());
      
      expect(result.current.isComplete).toBe(false);
      expect(result.current.timeSpent).toBe(0);
      expect(result.current.correctPieces).toBe(0);
      expect(result.current.difficulty).toBe('3x3');
      expect(result.current.moveCount).toBe(0);
      expect(result.current.isActive).toBe(false);
      expect(result.current.gameMode).toBe('classic');
    });
    
    test('starts new puzzle correctly', () => {
      const { result } = renderHook(() => usePuzzleState());
      
      act(() => {
        result.current.startNewPuzzle('4x4', 'timed', 300);
      });
      
      expect(result.current.isComplete).toBe(false);
      expect(result.current.timeSpent).toBe(0);
      expect(result.current.difficulty).toBe('4x4');
      expect(result.current.moveCount).toBe(0);
      expect(result.current.isActive).toBe(true);
      expect(result.current.gameMode).toBe('timed');
      expect(result.current.timeLimit).toBe(300);
    });
    
    test('increments moves correctly', () => {
      const { result } = renderHook(() => usePuzzleState());
      
      act(() => {
        result.current.incrementMoves();
        result.current.incrementMoves();
      });
      
      expect(result.current.moveCount).toBe(2);
    });
    
    test('updates correct pieces', () => {
      const { result } = renderHook(() => usePuzzleState());
      
      act(() => {
        result.current.updateCorrectPieces(5);
      });
      
      expect(result.current.correctPieces).toBe(5);
    });
    
    test('toggles pause state', () => {
      const { result } = renderHook(() => usePuzzleState());
      
      act(() => {
        result.current.startNewPuzzle(); // Start a puzzle first
        result.current.togglePause();
      });
      
      expect(result.current.isActive).toBe(false);
      
      act(() => {
        result.current.togglePause();
      });
      
      expect(result.current.isActive).toBe(true);
    });
  });
});
