
import { useState, useEffect, useCallback } from 'react';
import { SavedPuzzleState } from './usePuzzleState';

// Storage key prefix for saved puzzle states
const STORAGE_KEY_PREFIX = 'jigsaw-puzzle-save-';

// Hook for saving and loading puzzle progress
export function usePuzzleSaveState(puzzleId: string, userId?: string) {
  const [hasSavedState, setHasSavedState] = useState(false);
  
  // Generate a unique storage key based on puzzle ID and optionally user ID
  const storageKey = useCallback(() => {
    return userId 
      ? `${STORAGE_KEY_PREFIX}${puzzleId}-${userId}` 
      : `${STORAGE_KEY_PREFIX}${puzzleId}`;
  }, [puzzleId, userId]);
  
  // Check for existing saved state on mount
  useEffect(() => {
    const checkForSavedState = () => {
      try {
        const savedData = localStorage.getItem(storageKey());
        if (savedData) {
          const parsed = JSON.parse(savedData) as SavedPuzzleState;
          if (parsed && parsed.pieces && parsed.pieces.length > 0) {
            setHasSavedState(true);
            return;
          }
        }
        setHasSavedState(false);
      } catch (error) {
        console.error('Error checking for saved puzzle state:', error);
        setHasSavedState(false);
      }
    };
    
    checkForSavedState();
  }, [storageKey]);
  
  // Save the current puzzle state
  const saveState = useCallback((state: SavedPuzzleState) => {
    try {
      const stateWithTimestamp = {
        ...state,
        savedAt: Date.now()
      };
      localStorage.setItem(storageKey(), JSON.stringify(stateWithTimestamp));
    } catch (error) {
      console.error('Error saving puzzle state:', error);
    }
  }, [storageKey]);
  
  // Load a saved puzzle state
  const loadState = useCallback((): SavedPuzzleState | null => {
    try {
      const savedData = localStorage.getItem(storageKey());
      if (savedData) {
        return JSON.parse(savedData) as SavedPuzzleState;
      }
      return null;
    } catch (error) {
      console.error('Error loading puzzle state:', error);
      return null;
    }
  }, [storageKey]);
  
  // Clear the saved puzzle state
  const clearSavedState = useCallback(() => {
    try {
      localStorage.removeItem(storageKey());
      setHasSavedState(false);
    } catch (error) {
      console.error('Error clearing puzzle state:', error);
    }
  }, [storageKey]);
  
  return {
    hasSavedState,
    saveState,
    loadState,
    clearSavedState
  };
}
