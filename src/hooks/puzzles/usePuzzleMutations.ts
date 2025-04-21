import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { getCategoryByName } from './puzzleCategoryHelpers';
import { checkPuzzleTableExists } from './puzzleTableHelpers';
import type { Puzzle } from './puzzleTypes';
import { useToast } from '../use-toast';

export function usePuzzleMutations() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createPuzzle = useMutation({
    mutationFn: async (puzzle: Partial<Puzzle>) => {
      const tableExists = await checkPuzzleTableExists();
      if (!tableExists) throw new Error('Puzzles table does not exist');

      const categoryId = await getCategoryByName(puzzle.category as string);
      const releaseDate = new Date().toISOString();

      const puzzleData = {
        title: puzzle.name,
        category_id: categoryId,
        image_url: puzzle.imageUrl || 'https://via.placeholder.com/400',
        income_target: puzzle.targetRevenue ?? 0,
        status: puzzle.status || 'draft',
        description: puzzle.description || '',
        prize_value: puzzle.prizeValue ?? 0,
        release_date: releaseDate,
        puzzle_owner: puzzle.puzzleOwner || '',
        supplier: puzzle.supplier || '',
        cost_per_play: puzzle.costPerPlay ?? 1.99,
        time_limit: puzzle.timeLimit ?? 300,
        pieces:
          puzzle.difficulty === 'easy'
            ? 9
            : puzzle.difficulty === 'medium'
            ? 16
            : 25,
      };

      const { data, error } = await supabase.from('puzzles').insert(puzzleData).select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({ title: 'Puzzle created', description: 'The puzzle was created successfully' });
      queryClient.invalidateQueries({ queryKey: ['puzzles'] });
    },
    onError: (error: Error) => {
      toast({ title: 'Error creating puzzle', description: error.message, variant: 'destructive' });
    },
  });

  const updatePuzzle = useMutation({
    mutationFn: async (puzzle: Partial<Puzzle>) => {
      const tableExists = await checkPuzzleTableExists();
      if (!tableExists) throw new Error('Puzzles table does not exist');
      const categoryId = await getCategoryByName(puzzle.category as string);

      const puzzleData = {
        title: puzzle.name,
        category_id: categoryId,
        image_url: puzzle.imageUrl,
        income_target: puzzle.targetRevenue,
        status: puzzle.status,
        description: puzzle.description,
        prize_value: puzzle.prizeValue,
        puzzle_owner: puzzle.puzzleOwner,
        supplier: puzzle.supplier,
        cost_per_play: puzzle.costPerPlay,
        time_limit: puzzle.timeLimit,
        pieces:
          puzzle.difficulty === 'easy'
            ? 9
            : puzzle.difficulty === 'medium'
            ? 16
            : 25,
      };

      const { data, error } = await supabase.from('puzzles')
        .update(puzzleData)
        .eq('id', puzzle.id)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({ title: 'Puzzle updated', description: 'The puzzle was updated successfully' });
      queryClient.invalidateQueries({ queryKey: ['puzzles'] });
    },
    onError: (error: Error) => {
      toast({ title: 'Error updating puzzle', description: error.message, variant: 'destructive' });
    },
  });

  const deletePuzzle = useMutation({
    mutationFn: async (puzzleId: string) => {
      const { error } = await supabase.from('puzzles').delete().eq('id', puzzleId);
      if (error) throw error;
      return puzzleId;
    },
    onSuccess: () => {
      toast({ title: 'Puzzle deleted', description: 'The puzzle was deleted successfully' });
      queryClient.invalidateQueries({ queryKey: ['puzzles'] });
    },
    onError: (error: Error) => {
      toast({ title: 'Error deleting puzzle', description: error.message, variant: 'destructive' });
    },
  });

  return {
    createPuzzle: createPuzzle.mutate,
    updatePuzzle: updatePuzzle.mutate,
    deletePuzzle: deletePuzzle.mutate,
  };
}
