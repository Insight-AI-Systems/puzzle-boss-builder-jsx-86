
import { supabase } from '@/integrations/supabase/client';

export interface PuzzleModel {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  difficulty: string;
  status: string;
  categoryId?: string;
  categoryName?: string;
  pieces: number;
  costPerPlay?: number;
  prizeValue: number;
  completions?: number;
  avgTime?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface PuzzleCreateDTO {
  title: string;
  description?: string;
  imageUrl: string;
  difficulty: string;
  categoryId?: string;
  pieces: number;
  costPerPlay?: number;
  prizeValue: number;
}

export interface PuzzleUpdateDTO {
  id: string;
  title?: string;
  description?: string;
  imageUrl?: string;
  difficulty?: string;
  categoryId?: string;
  pieces?: number;
  costPerPlay?: number;
  prizeValue?: number;
  status?: string;
}

/**
 * Puzzles API Module
 * Provides type-safe access to puzzle data
 */
export const puzzlesApi = {
  /**
   * Map database puzzle to frontend model
   */
  mapDatabaseToPuzzle(dbPuzzle: any): PuzzleModel {
    return {
      id: dbPuzzle.id,
      title: dbPuzzle.title || '',
      description: dbPuzzle.description,
      imageUrl: dbPuzzle.image_url,
      difficulty: dbPuzzle.difficulty_level,
      status: dbPuzzle.status,
      categoryId: dbPuzzle.category_id,
      categoryName: dbPuzzle.categories?.name,
      pieces: dbPuzzle.pieces,
      costPerPlay: dbPuzzle.cost_per_play,
      prizeValue: dbPuzzle.prize_value,
      completions: dbPuzzle.completions || 0,
      avgTime: dbPuzzle.avg_time,
      createdAt: dbPuzzle.created_at,
      updatedAt: dbPuzzle.updated_at
    };
  },

  /**
   * Fetch all puzzles with optional filtering
   */
  async getPuzzles(options?: {
    status?: string | string[];
    categoryId?: string;
    difficulty?: string;
    orderBy?: string;
    ascending?: boolean;
    page?: number;
    pageSize?: number;
  }): Promise<PuzzleModel[]> {
    try {
      let query = supabase.from('puzzles').select(`
        *,
        categories:category_id(name)
      `);

      // Apply filters
      if (options?.status) {
        if (Array.isArray(options.status)) {
          query = query.in('status', options.status);
        } else {
          query = query.eq('status', options.status);
        }
      }
      
      if (options?.categoryId) {
        query = query.eq('category_id', options.categoryId);
      }
      
      if (options?.difficulty) {
        query = query.eq('difficulty_level', options.difficulty);
      }
      
      // Apply ordering
      if (options?.orderBy) {
        query = query.order(options.orderBy, { 
          ascending: options.ascending !== false 
        });
      } else {
        query = query.order('created_at', { ascending: false });
      }
      
      // Apply pagination
      if (options?.page !== undefined && options?.pageSize) {
        const from = options.page * options.pageSize;
        const to = from + options.pageSize - 1;
        query = query.range(from, to);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching puzzles:', error);
        return [];
      }
      
      return (data || []).map(this.mapDatabaseToPuzzle);
    } catch (error) {
      console.error('Exception fetching puzzles:', error);
      return [];
    }
  },
  
  /**
   * Get puzzles by category ID with improved type safety
   */
  async getPuzzlesByCategoryId(categoryId: string): Promise<PuzzleModel[]> {
    try {
      const { data, error } = await supabase.from('puzzles')
        .select(`
          *,
          categories:category_id(name)
        `)
        .eq('category_id', categoryId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching puzzles by category:', error);
        return [];
      }
      
      return (data || []).map(this.mapDatabaseToPuzzle);
    } catch (error) {
      console.error('Exception fetching puzzles by category:', error);
      return [];
    }
  },
  
  /**
   * Fetch a single puzzle by ID
   */
  async getPuzzleById(id: string): Promise<PuzzleModel | null> {
    try {
      const { data, error } = await supabase
        .from('puzzles')
        .select(`*,
        categories:category_id(name)`)
        .eq('id', id)
        .single();
      
      if (error || !data) {
        console.error('Error fetching puzzle:', error);
        return null;
      }
      
      return this.mapDatabaseToPuzzle(data);
    } catch (error) {
      console.error('Exception fetching puzzle:', error);
      return null;
    }
  },
  
  /**
   * Create a new puzzle
   */
  async createPuzzle(puzzle: PuzzleCreateDTO): Promise<PuzzleModel | null> {
    try {
      const dbPuzzle = {
        title: puzzle.title,
        description: puzzle.description,
        image_url: puzzle.imageUrl,
        difficulty_level: puzzle.difficulty,
        category_id: puzzle.categoryId,
        pieces: puzzle.pieces,
        cost_per_play: puzzle.costPerPlay,
        prize_value: puzzle.prizeValue,
        status: 'draft'
      };
      
      const { data, error } = await supabase
        .from('puzzles')
        .insert(dbPuzzle)
        .select()
        .single();
      
      if (error || !data) {
        console.error('Error creating puzzle:', error);
        return null;
      }
      
      return this.mapDatabaseToPuzzle(data);
    } catch (error) {
      console.error('Exception creating puzzle:', error);
      return null;
    }
  },
  
  /**
   * Update an existing puzzle
   */
  async updatePuzzle(puzzle: PuzzleUpdateDTO): Promise<PuzzleModel | null> {
    try {
      const dbPuzzle: Record<string, any> = {};
      
      if (puzzle.title !== undefined) dbPuzzle.title = puzzle.title;
      if (puzzle.description !== undefined) dbPuzzle.description = puzzle.description;
      if (puzzle.imageUrl !== undefined) dbPuzzle.image_url = puzzle.imageUrl;
      if (puzzle.difficulty !== undefined) dbPuzzle.difficulty_level = puzzle.difficulty;
      if (puzzle.categoryId !== undefined) dbPuzzle.category_id = puzzle.categoryId;
      if (puzzle.pieces !== undefined) dbPuzzle.pieces = puzzle.pieces;
      if (puzzle.costPerPlay !== undefined) dbPuzzle.cost_per_play = puzzle.costPerPlay;
      if (puzzle.prizeValue !== undefined) dbPuzzle.prize_value = puzzle.prizeValue;
      if (puzzle.status !== undefined) dbPuzzle.status = puzzle.status;
      
      // Only update if there are changes
      if (Object.keys(dbPuzzle).length === 0) {
        console.warn('No fields to update for puzzle');
        return await this.getPuzzleById(puzzle.id);
      }
      
      const { data, error } = await supabase
        .from('puzzles')
        .update(dbPuzzle)
        .eq('id', puzzle.id)
        .select()
        .single();
      
      if (error || !data) {
        console.error('Error updating puzzle:', error);
        return null;
      }
      
      return this.mapDatabaseToPuzzle(data);
    } catch (error) {
      console.error('Exception updating puzzle:', error);
      return null;
    }
  },
  
  /**
   * Delete a puzzle
   */
  async deletePuzzle(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('puzzles')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting puzzle:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Exception deleting puzzle:', error);
      return false;
    }
  }
};
