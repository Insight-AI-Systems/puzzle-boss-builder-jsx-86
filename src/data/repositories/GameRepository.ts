
import { BaseRepository } from './BaseRepository';
import { Game } from '@/business/models/Game';
import { supabase } from '@/integrations/supabase/client';

export class GameRepository extends BaseRepository<Game> {
  protected tableName = 'puzzles';

  constructor() {
    super(supabase);
  }

  async saveProgress(gameState: any): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('puzzle_progress')
        .upsert({
          user_id: gameState.player?.id,
          puzzle_id: gameState.id,
          progress: gameState,
          last_updated: new Date().toISOString()
        });

      if (error) throw error;
    } catch (error) {
      console.error('Failed to save game progress:', error);
      throw error;
    }
  }

  async loadProgress(userId: string, gameId: string): Promise<any> {
    try {
      const { data, error } = await this.supabase
        .from('puzzle_progress')
        .select('progress')
        .eq('user_id', userId)
        .eq('puzzle_id', gameId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data?.progress || null;
    } catch (error) {
      console.error('Failed to load game progress:', error);
      return null;
    }
  }
}

export const gameRepository = new GameRepository();
