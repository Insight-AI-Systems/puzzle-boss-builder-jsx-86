
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { puzzlesApi } from '@/api/puzzles-api';
import { PuzzleModel, PuzzleCreateDTO, PuzzleUpdateDTO } from '@/types/puzzle-models';
import { showErrorToast } from '@/utils/error-handling';

/**
 * React Query hook for fetching and managing puzzles
 */
export function usePuzzlesQuery(options?: {
  status?: string | string[];
  categoryId?: string;
  difficulty?: string;
  enabled?: boolean;
}) {
  return useQuery({
    queryKey: ['puzzles', options?.status, options?.categoryId, options?.difficulty],
    queryFn: async () => {
      const puzzles = await puzzlesApi.getPuzzles({
        status: options?.status,
        categoryId: options?.categoryId,
        difficulty: options?.difficulty
      });
      return puzzles;
    },
    enabled: options?.enabled !== false
  });
}

/**
 * React Query hook for fetching puzzles by category
 */
export function usePuzzlesByCategoryQuery(categoryId: string | undefined) {
  return useQuery({
    queryKey: ['puzzles', 'by-category', categoryId],
    queryFn: async () => {
      if (!categoryId) return [];
      return await puzzlesApi.getPuzzlesByCategoryId(categoryId);
    },
    enabled: !!categoryId
  });
}

/**
 * React Query hook for fetching a single puzzle
 */
export function usePuzzleQuery(id: string | undefined) {
  return useQuery({
    queryKey: ['puzzle', id],
    queryFn: async () => {
      if (!id) return null;
      return await puzzlesApi.getPuzzleById(id);
    },
    enabled: !!id
  });
}

/**
 * React Query hooks for puzzle mutations
 */
export function usePuzzleMutations() {
  const queryClient = useQueryClient();
  
  const createPuzzle = useMutation({
    mutationFn: async (newPuzzle: PuzzleCreateDTO) => {
      const result = await puzzlesApi.createPuzzle(newPuzzle);
      if (!result) {
        throw new Error('Failed to create puzzle');
      }
      return result;
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['puzzles'] });
      queryClient.invalidateQueries({ queryKey: ['puzzles', 'by-category', result.categoryId] });
    },
    onError: (error) => {
      showErrorToast(error, 'Failed to create puzzle');
    }
  });
  
  const updatePuzzle = useMutation({
    mutationFn: async (updatedPuzzle: PuzzleUpdateDTO) => {
      const result = await puzzlesApi.updatePuzzle(updatedPuzzle);
      if (!result) {
        throw new Error('Failed to update puzzle');
      }
      return result;
    },
    onSuccess: (result, variables) => {
      queryClient.invalidateQueries({ queryKey: ['puzzles'] });
      queryClient.invalidateQueries({ queryKey: ['puzzle', variables.id] });
      
      // If category changed, invalidate both old and new category queries
      if (variables.categoryId && result.categoryId !== variables.categoryId) {
        queryClient.invalidateQueries({ queryKey: ['puzzles', 'by-category', variables.categoryId] });
      }
      
      queryClient.invalidateQueries({ queryKey: ['puzzles', 'by-category', result.categoryId] });
    },
    onError: (error) => {
      showErrorToast(error, 'Failed to update puzzle');
    }
  });
  
  const deletePuzzle = useMutation({
    mutationFn: async (puzzle: { id: string; categoryId?: string }) => {
      const success = await puzzlesApi.deletePuzzle(puzzle.id);
      if (!success) {
        throw new Error('Failed to delete puzzle');
      }
      return puzzle;
    },
    onSuccess: (puzzle) => {
      queryClient.invalidateQueries({ queryKey: ['puzzles'] });
      queryClient.invalidateQueries({ queryKey: ['puzzle', puzzle.id] });
      
      if (puzzle.categoryId) {
        queryClient.invalidateQueries({ 
          queryKey: ['puzzles', 'by-category', puzzle.categoryId] 
        });
      }
    },
    onError: (error) => {
      showErrorToast(error, 'Failed to delete puzzle');
    }
  });
  
  return {
    createPuzzle,
    updatePuzzle,
    deletePuzzle
  };
}
