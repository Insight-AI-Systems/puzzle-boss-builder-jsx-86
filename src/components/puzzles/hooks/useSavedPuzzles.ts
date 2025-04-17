
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { SavedPuzzleState, SaveManagerState } from '../types/save-types';

const STORAGE_KEY = 'puzzle_saves';
const CURRENT_VERSION = '1.0.0';

export const useSavedPuzzles = () => {
  const [savedGames, setSavedGames] = useState<SaveManagerState>({ saves: [] });
  const { toast } = useToast();

  // Load saved games from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setSavedGames(parsed);
      }
    } catch (error) {
      console.error('Error loading saved games:', error);
      toast({
        title: "Error Loading Saves",
        description: "Could not load saved puzzles. Storage might be corrupted.",
        variant: "destructive",
      });
    }
  }, []);

  // Save current game state
  const saveGame = useCallback((state: SavedPuzzleState) => {
    try {
      const newState = {
        ...state,
        timestamp: Date.now(),
        version: CURRENT_VERSION
      };
      
      setSavedGames(prev => {
        // Remove any existing save with the same ID
        const filteredSaves = prev.saves.filter(save => save.id !== newState.id);
        const newSaves = [...filteredSaves, newState];
        
        // Store in localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          saves: newSaves,
          lastAutoSave: Date.now()
        }));
        
        return { saves: newSaves, lastAutoSave: Date.now() };
      });

      toast({
        title: "Puzzle Saved",
        description: "Your progress has been saved successfully.",
      });
      
      return true;
    } catch (error) {
      console.error('Error saving game:', error);
      toast({
        title: "Error Saving",
        description: "Could not save puzzle progress. Storage might be full.",
        variant: "destructive",
      });
      return false;
    }
  }, []);

  // Delete a saved game
  const deleteSave = useCallback((id: string) => {
    try {
      setSavedGames(prev => {
        const newSaves = prev.saves.filter(save => save.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ saves: newSaves }));
        return { saves: newSaves };
      });

      toast({
        title: "Save Deleted",
        description: "The saved puzzle was deleted successfully.",
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting save:', error);
      toast({
        title: "Error Deleting",
        description: "Could not delete saved puzzle.",
        variant: "destructive",
      });
      return false;
    }
  }, []);

  return {
    savedGames: savedGames.saves,
    saveGame,
    deleteSave
  };
};
