
import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Puzzle {
  id: string;
  name: string;
  category: string;
  category_id?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  imageUrl: string;
  timeLimit: number;
  costPerPlay: number;
  targetRevenue: number;
  status: string;
  prize: string;
  prizeValue: number;
  completions?: number;
  avgTime?: number;
  description?: string;
  puzzleOwner?: string;
  supplier?: string;
}

export const usePuzzles = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get user profile from auth context or local storage if needed
  const getUserProfile = () => {
    const profileStr = localStorage.getItem('userProfile');
    if (profileStr) {
      try {
        return JSON.parse(profileStr);
      } catch (e) {
        console.error('Error parsing user profile:', e);
      }
    }
    return null;
  };

  const profile = getUserProfile();

  const fetchPuzzles = async () => {
    console.log('Fetching puzzles from Supabase...');
    const { data, error } = await supabase
      .from('puzzles')
      .select('*, categories(name)');
    
    if (error) {
      console.error('Error fetching puzzles:', error);
      throw error;
    }
    
    console.log('Puzzles data from Supabase:', data);
    
    // Transform the data to match our Puzzle interface
    return data.map((puzzle: any): Puzzle => ({
      id: puzzle.id,
      name: puzzle.title || '',
      category: puzzle.categories?.name || '',
      category_id: puzzle.category_id || '',
      difficulty: puzzle.difficulty || 'medium',
      imageUrl: puzzle.image_url || '',
      timeLimit: puzzle.time_limit || 0,
      costPerPlay: puzzle.cost_per_play || 0,
      targetRevenue: puzzle.income_target || 0,
      status: puzzle.status || 'draft',
      prize: puzzle.prize || '',
      prizeValue: puzzle.prize_value || 0,
      description: puzzle.description || '',
      puzzleOwner: puzzle.puzzle_owner || '',
      supplier: puzzle.supplier || '',
      completions: puzzle.completions || 0,
      avgTime: puzzle.avg_time || 0,
    }));
  };

  const { data: puzzles = [], isLoading, error } = useQuery({
    queryKey: ['puzzles'],
    queryFn: fetchPuzzles,
  });

  const createPuzzle = useMutation({
    mutationFn: async (puzzle: Partial<Puzzle>) => {
      // Set default puzzleOwner if not provided
      if (!puzzle.puzzleOwner && profile) {
        puzzle.puzzleOwner = profile.display_name || profile.email || 'Unknown Admin';
      }
      
      // Convert from our frontend model to the database model
      const dbPuzzle = {
        title: puzzle.name,
        category_id: puzzle.category_id,
        difficulty: puzzle.difficulty,
        image_url: puzzle.imageUrl,
        time_limit: puzzle.timeLimit,
        cost_per_play: puzzle.costPerPlay,
        income_target: puzzle.targetRevenue,
        status: puzzle.status,
        prize: puzzle.prize,
        prize_value: puzzle.prizeValue,
        description: puzzle.description,
        puzzle_owner: puzzle.puzzleOwner,
        supplier: puzzle.supplier,
        release_date: new Date().toISOString(), // Add required release_date field
      };

      console.log('Creating new puzzle:', dbPuzzle);
      
      const { data, error } = await supabase
        .from('puzzles')
        .insert(dbPuzzle)
        .select();

      if (error) {
        console.error('Error creating puzzle:', error);
        throw error;
      }
      
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['puzzles'] });
      toast({
        title: "Puzzle created",
        description: "The puzzle has been created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error creating puzzle",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updatePuzzle = useMutation({
    mutationFn: async (puzzle: Puzzle) => {
      // Convert from our frontend model to the database model
      const dbPuzzle = {
        title: puzzle.name,
        category_id: puzzle.category_id,
        difficulty: puzzle.difficulty,
        image_url: puzzle.imageUrl,
        time_limit: puzzle.timeLimit,
        cost_per_play: puzzle.costPerPlay,
        income_target: puzzle.targetRevenue,
        status: puzzle.status,
        prize: puzzle.prize,
        prize_value: puzzle.prizeValue,
        description: puzzle.description,
        puzzle_owner: puzzle.puzzleOwner,
        supplier: puzzle.supplier,
      };

      console.log('Updating puzzle:', puzzle.id, dbPuzzle);
      
      const { data, error } = await supabase
        .from('puzzles')
        .update(dbPuzzle)
        .eq('id', puzzle.id)
        .select();

      if (error) {
        console.error('Error updating puzzle:', error);
        throw error;
      }
      
      console.log('Update response:', data);
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['puzzles'] });
      toast({
        title: "Puzzle updated",
        description: "The puzzle has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error updating puzzle",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deletePuzzle = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting puzzle:', id);
      
      const { error } = await supabase
        .from('puzzles')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting puzzle:', error);
        throw error;
      }
      
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['puzzles'] });
      toast({
        title: "Puzzle deleted",
        description: "The puzzle has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error deleting puzzle",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const togglePuzzleStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      console.log('Toggling puzzle status:', id, status);
      
      const { data, error } = await supabase
        .from('puzzles')
        .update({ status })
        .eq('id', id)
        .select();

      if (error) {
        console.error('Error toggling puzzle status:', error);
        throw error;
      }
      
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['puzzles'] });
    },
    onError: (error) => {
      toast({
        title: "Error updating puzzle status",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    puzzles,
    isLoading,
    error,
    createPuzzle,
    updatePuzzle,
    deletePuzzle,
    togglePuzzleStatus,
    profile
  };
};
