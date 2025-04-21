
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

export interface Puzzle {
  id: string;
  name: string;
  category: string;
  category_id: string;
  difficulty: 'easy' | 'medium' | 'hard';
  imageUrl: string;
  timeLimit: number;
  costPerPlay: number;
  targetRevenue: number;
  status: 'active' | 'inactive' | 'scheduled' | 'completed' | 'draft';
  prize: string;
  description?: string;
  puzzleOwner?: string;
  supplier?: string;
  completions?: number;
  avgTime?: number;
  prizeValue: number;
}

export function usePuzzles() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Function to check if puzzles table exists
  const checkPuzzleTableExists = async () => {
    try {
      const { error } = await supabase.from('puzzles').select('id').limit(1);
      if (error && error.message.includes('does not exist')) {
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error checking puzzles table:', error);
      return false;
    }
  };

  // Function to get category by name
  const getCategoryByName = async (categoryName: string) => {
    if (!categoryName) return null;
    
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id')
        .eq('name', categoryName)
        .single();
      
      if (error) {
        console.error('Error fetching category:', error);
        return null;
      }
      
      return data?.id || null;
    } catch (error) {
      console.error('Error in getCategoryByName:', error);
      return null;
    }
  };

  // Function to fetch puzzles from database
  const fetchPuzzles = async () => {
    console.log('Fetching puzzles from database...');
    
    const tableExists = await checkPuzzleTableExists();
    if (!tableExists) {
      console.warn('Puzzles table does not exist');
      return [];
    }
    
    const { data, error } = await supabase
      .from('puzzles')
      .select(`
        *,
        categories:category_id(name)
      `)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching puzzles:', error);
      throw error;
    }
    
    // Log the raw data from database to understand its structure
    console.log('Raw puzzle data from database:', data);
    
    // Transform database records to match frontend format
    return data.map(item => ({
      id: item.id,
      name: item.title,
      category: item.categories?.name || '',
      category_id: item.category_id,
      difficulty: (item.pieces <= 9 ? 'easy' : item.pieces <= 16 ? 'medium' : 'hard') as 'easy' | 'medium' | 'hard',
      imageUrl: item.image_url,
      timeLimit: 0, // Default since column doesn't exist yet
      costPerPlay: 1.99, // Default since column doesn't exist yet
      targetRevenue: item.income_target || 0,
      status: (item.status || 'draft') as 'active' | 'inactive' | 'scheduled' | 'completed' | 'draft',
      prize: item.title, // Using title as prize name
      description: item.description || '',
      puzzleOwner: '', // Default since column doesn't exist yet
      supplier: '', // Default since column doesn't exist yet
      completions: 0, // Default since column doesn't exist yet
      avgTime: 0, // Default since column doesn't exist yet
      prizeValue: item.prize_value || 0
    }));
  };

  // Query for fetching puzzles
  const puzzlesQuery = useQuery({
    queryKey: ['puzzles'],
    queryFn: fetchPuzzles,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Mutation for creating a puzzle
  const createPuzzleMutation = useMutation({
    mutationFn: async (puzzle: Partial<Puzzle>) => {
      console.log('Creating puzzle:', puzzle);
      
      // Ensure puzzles table exists
      const tableExists = await checkPuzzleTableExists();
      if (!tableExists) {
        throw new Error('Puzzles table does not exist');
      }
      
      // Get category ID from category name
      const categoryId = await getCategoryByName(puzzle.category as string);
      
      // Prepare release date (default to now if not provided)
      const releaseDate = new Date().toISOString();
      
      // Prepare puzzle data for database
      const puzzleData = {
        title: puzzle.name,
        category_id: categoryId,
        difficulty: puzzle.difficulty || 'medium',
        image_url: puzzle.imageUrl || 'https://via.placeholder.com/400',
        income_target: puzzle.targetRevenue || 0,
        status: puzzle.status || 'draft',
        description: puzzle.description || '',
        prize_value: puzzle.prizeValue || 0,
        release_date: releaseDate,
        pieces: puzzle.difficulty === 'easy' ? 9 : puzzle.difficulty === 'medium' ? 16 : 25
      };
      
      const { data, error } = await supabase
        .from('puzzles')
        .insert(puzzleData)
        .select();
      
      if (error) {
        console.error('Error creating puzzle:', error);
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      toast({
        title: 'Puzzle created',
        description: 'The puzzle was created successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['puzzles'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error creating puzzle',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Mutation for updating a puzzle
  const updatePuzzleMutation = useMutation({
    mutationFn: async (puzzle: Partial<Puzzle>) => {
      console.log('Updating puzzle:', puzzle);
      
      // Check if table exists
      const tableExists = await checkPuzzleTableExists();
      if (!tableExists) {
        throw new Error('Puzzles table does not exist');
      }
      
      // Get category ID from name
      const categoryId = await getCategoryByName(puzzle.category as string);
      
      // Prepare puzzle data for update
      const puzzleData = {
        title: puzzle.name,
        category_id: categoryId,
        image_url: puzzle.imageUrl,
        income_target: puzzle.targetRevenue,
        status: puzzle.status,
        description: puzzle.description,
        prize_value: puzzle.prizeValue,
        pieces: puzzle.difficulty === 'easy' ? 9 : puzzle.difficulty === 'medium' ? 16 : 25
      };
      
      console.log('Sending update to database:', puzzleData);
      
      const { data, error } = await supabase
        .from('puzzles')
        .update(puzzleData)
        .eq('id', puzzle.id)
        .select();
      
      if (error) {
        console.error('Error updating puzzle:', error);
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      toast({
        title: 'Puzzle updated',
        description: 'The puzzle was updated successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['puzzles'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error updating puzzle',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Mutation for deleting a puzzle
  const deletePuzzleMutation = useMutation({
    mutationFn: async (puzzleId: string) => {
      const { error } = await supabase
        .from('puzzles')
        .delete()
        .eq('id', puzzleId);
      
      if (error) {
        console.error('Error deleting puzzle:', error);
        throw error;
      }
      
      return puzzleId;
    },
    onSuccess: () => {
      toast({
        title: 'Puzzle deleted',
        description: 'The puzzle was deleted successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['puzzles'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error deleting puzzle',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    puzzles: puzzlesQuery.data || [],
    isLoading: puzzlesQuery.isLoading,
    isError: puzzlesQuery.isError,
    error: puzzlesQuery.error,
    createPuzzle: createPuzzleMutation.mutate,
    updatePuzzle: updatePuzzleMutation.mutate,
    deletePuzzle: deletePuzzleMutation.mutate,
    checkPuzzleTableExists,
  };
}
