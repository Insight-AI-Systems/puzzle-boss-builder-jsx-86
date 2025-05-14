
import { apiClient } from '@/integrations/supabase/api-client';
import { PuzzleModel, PuzzleCreateDTO, PuzzleUpdateDTO } from '@/types/puzzle-models';

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
    let query = apiClient.query('puzzles').select(`
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
    
    try {
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
      const { data, error } = await apiClient.query('puzzles')
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
    const response = await apiClient.getById<any>('puzzles', id, {
      query: `*,
      categories:category_id(name)`
    });
    
    if (response.error || !response.data) {
      console.error('Error fetching puzzle:', response.error);
      return null;
    }
    
    return this.mapDatabaseToPuzzle(response.data);
  },
  
  /**
   * Create a new puzzle
   */
  async createPuzzle(puzzle: PuzzleCreateDTO): Promise<PuzzleModel | null> {
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
    
    const response = await apiClient.create<any>('puzzles', dbPuzzle);
    
    if (response.error || !response.data) {
      console.error('Error creating puzzle:', response.error);
      return null;
    }
    
    return this.mapDatabaseToPuzzle(response.data);
  },
  
  /**
   * Update an existing puzzle
   */
  async updatePuzzle(puzzle: PuzzleUpdateDTO): Promise<PuzzleModel | null> {
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
    
    const response = await apiClient.update<any>('puzzles', puzzle.id, dbPuzzle);
    
    if (response.error || !response.data) {
      console.error('Error updating puzzle:', response.error);
      return null;
    }
    
    return this.mapDatabaseToPuzzle(response.data);
  },
  
  /**
   * Delete a puzzle
   */
  async deletePuzzle(id: string): Promise<boolean> {
    const response = await apiClient.delete('puzzles', id);
    
    if (response.error) {
      console.error('Error deleting puzzle:', response.error);
      return false;
    }
    
    return true;
  }
};
