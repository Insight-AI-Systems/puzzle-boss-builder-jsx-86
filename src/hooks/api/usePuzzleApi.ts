
import { apiClient } from '@/integrations/supabase/api-client';
import { useApiQuery, useApiMutation } from './useQueryHelpers';
import { Puzzle } from '@/hooks/puzzles/puzzleTypes';

export function usePuzzles(filters?: { status?: string, category_id?: string }) {
  return useApiQuery<Puzzle[]>(
    ['puzzles', filters],
    async () => {
      let query = apiClient.query('puzzles')
        .select(`
          id, 
          title, 
          image_url, 
          category_id, 
          status, 
          pieces, 
          prize_value, 
          difficulty_level,
          categories:category_id(name)
        `);
        
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      
      if (filters?.category_id) {
        query = query.eq('category_id', filters.category_id);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      return {
        data: data ? data.map((item: any) => ({
          id: item.id,
          name: item.title,
          category: item.categories?.name || '',
          category_id: item.category_id,
          difficulty: item.difficulty_level as 'easy' | 'medium' | 'hard',
          imageUrl: item.image_url,
          timeLimit: item.time_limit ?? 300,
          costPerPlay: item.cost_per_play ?? 1.99,
          targetRevenue: item.income_target || 0,
          status: item.status as 'active' | 'inactive' | 'scheduled' | 'completed' | 'draft',
          prize: item.title,
          prizeValue: item.prize_value || 0,
        })) : null,
        error
      };
    }
  );
}

export function usePuzzleById(id: string) {
  return useApiQuery<Puzzle>(
    ['puzzle', id],
    async () => {
      return apiClient.getById<Puzzle>('puzzles', id, {
        query: `
          id, title, image_url, category_id, status, pieces, prize_value, 
          difficulty_level, cost_per_play, time_limit, income_target,
          categories:category_id(name)
        `
      });
    },
    {
      enabled: !!id
    }
  );
}

export function useCreatePuzzle() {
  return useApiMutation<Puzzle, Omit<Puzzle, 'id'>>(
    async (newPuzzle) => {
      return apiClient.create<Puzzle>('puzzles', {
        title: newPuzzle.name,
        category_id: newPuzzle.category_id,
        image_url: newPuzzle.imageUrl,
        status: newPuzzle.status || 'draft',
        pieces: newPuzzle.difficulty === 'easy' ? 9 : 
                newPuzzle.difficulty === 'medium' ? 16 : 25,
        difficulty_level: newPuzzle.difficulty,
        prize_value: newPuzzle.prizeValue,
        cost_per_play: newPuzzle.costPerPlay,
        time_limit: newPuzzle.timeLimit,
        income_target: newPuzzle.targetRevenue
      });
    }
  );
}

export function useUpdatePuzzle() {
  return useApiMutation<Puzzle, { id: string, puzzle: Partial<Puzzle> }>(
    async ({ id, puzzle }) => {
      return apiClient.update<Puzzle>('puzzles', id, {
        ...(puzzle.name && { title: puzzle.name }),
        ...(puzzle.category_id && { category_id: puzzle.category_id }),
        ...(puzzle.imageUrl && { image_url: puzzle.imageUrl }),
        ...(puzzle.status && { status: puzzle.status }),
        ...(puzzle.difficulty && { difficulty_level: puzzle.difficulty }),
        ...(puzzle.prizeValue !== undefined && { prize_value: puzzle.prizeValue }),
        ...(puzzle.costPerPlay !== undefined && { cost_per_play: puzzle.costPerPlay }),
        ...(puzzle.timeLimit !== undefined && { time_limit: puzzle.timeLimit }),
        ...(puzzle.targetRevenue !== undefined && { income_target: puzzle.targetRevenue })
      });
    }
  );
}

export function useDeletePuzzle() {
  return useApiMutation<null, string>(
    async (id) => {
      return apiClient.delete('puzzles', id);
    }
  );
}
