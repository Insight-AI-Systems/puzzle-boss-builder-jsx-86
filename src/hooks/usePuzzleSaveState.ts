
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { PuzzleState } from '@/types/puzzle-types';

const STORAGE_KEY = 'puzzle_save_state';

interface SavedPuzzleState extends PuzzleState {
  timestamp: number;
  imageUrl: string;
}

export function usePuzzleSaveState(imageUrl: string) {
  const [hasSavedState, setHasSavedState] = useState(false);
  const { toast } = useToast();

  // Auto-save current state
  const saveState = (currentState: PuzzleState) => {
    try {
      const stateToSave: SavedPuzzleState = {
        ...currentState,
        timestamp: Date.now(),
        imageUrl
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (error) {
      console.error('Failed to save puzzle state:', error);
      toast({
        title: "Save Error",
        description: "Could not save your progress",
        variant: "destructive",
      });
    }
  };

  // Load saved state
  const loadState = (): SavedPuzzleState | null => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return null;

      const parsedState = JSON.parse(saved) as SavedPuzzleState;
      
      // Only return if it's the same puzzle
      if (parsedState.imageUrl === imageUrl) {
        return parsedState;
      }
      return null;
    } catch (error) {
      console.error('Failed to load puzzle state:', error);
      return null;
    }
  };

  // Clear saved state
  const clearSavedState = () => {
    localStorage.removeItem(STORAGE_KEY);
    setHasSavedState(false);
  };

  // Check for existing save on mount
  useEffect(() => {
    const savedState = loadState();
    setHasSavedState(!!savedState);
  }, []);

  return {
    hasSavedState,
    saveState,
    loadState,
    clearSavedState
  };
}
