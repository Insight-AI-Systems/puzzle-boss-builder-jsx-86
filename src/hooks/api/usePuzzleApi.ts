
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Puzzle {
  id: string;
  name: string;
  category: string;
  category_id?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  imageUrl: string;
  timeLimit: number;
  costPerPlay: number;
  targetRevenue: number;
  status: 'active' | 'inactive' | 'scheduled' | 'completed' | 'draft';
  prize: string;
  prizeValue: number;
}

export function usePuzzles(filters?: { status?: string, category_id?: string }) {
  return useQuery({
    queryKey: ['puzzles', filters],
    queryFn: async () => {
      let query = supabase
        .from('puzzles')
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
      
      return data ? data.map((item: any) => ({
        id: item.id,
        name: item.title,
        category: item.categories?.name || '',
        category_id: item.category_id,
        difficulty: item.difficulty_level as 'easy' | 'medium' | 'hard',
        imageUrl: item.image_url,
        timeLimit: 300,
        costPerPlay: 1.99,
        targetRevenue: 0,
        status: item.status as 'active' | 'inactive' | 'scheduled' | 'completed' | 'draft',
        prize: item.title,
        prizeValue: item.prize_value || 0,
      })) : [];
    }
  });
}

export function usePuzzleById(id: string) {
  return useQuery({
    queryKey: ['puzzle', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('puzzles')
        .select(`
          id, title, image_url, category_id, status, pieces, prize_value, 
          difficulty_level, cost_per_play, time_limit, income_target,
          categories:category_id(name)
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      return {
        id: data.id,
        name: data.title,
        category: data.categories?.name || '',
        category_id: data.category_id,
        difficulty: data.difficulty_level as 'easy' | 'medium' | 'hard',
        imageUrl: data.image_url,
        timeLimit: data.time_limit || 300,
        costPerPlay: data.cost_per_play || 1.99,
        targetRevenue: data.income_target || 0,
        status: data.status as 'active' | 'inactive' | 'scheduled' | 'completed' | 'draft',
        prize: data.title,
        prizeValue: data.prize_value || 0,
      };
    },
    enabled: !!id
  });
}

export function useCreatePuzzle() {
  return useMutation({
    mutationFn: async (newPuzzle: Omit<Puzzle, 'id'>) => {
      const { data, error } = await supabase
        .from('puzzles')
        .insert({
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
          income_target: newPuzzle.targetRevenue,
          release_date: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    }
  });
}

export function useUpdatePuzzle() {
  return useMutation({
    mutationFn: async ({ id, puzzle }: { id: string, puzzle: Partial<Puzzle> }) => {
      const { data, error } = await supabase
        .from('puzzles')
        .update({
          ...(puzzle.name && { title: puzzle.name }),
          ...(puzzle.category_id && { category_id: puzzle.category_id }),
          ...(puzzle.imageUrl && { image_url: puzzle.imageUrl }),
          ...(puzzle.status && { status: puzzle.status }),
          ...(puzzle.difficulty && { difficulty_level: puzzle.difficulty }),
          ...(puzzle.prizeValue !== undefined && { prize_value: puzzle.prizeValue }),
          ...(puzzle.costPerPlay !== undefined && { cost_per_play: puzzle.costPerPlay }),
          ...(puzzle.timeLimit !== undefined && { time_limit: puzzle.timeLimit }),
          ...(puzzle.targetRevenue !== undefined && { income_target: puzzle.targetRevenue })
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    }
  });
}

export function useDeletePuzzle() {
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('puzzles')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return null;
    }
  });
}
