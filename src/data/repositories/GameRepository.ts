
import { BaseRepository } from './BaseRepository';
import { SupabaseClient } from '@/data/api/supabase/SupabaseClient';
import { 
  Game, 
  GameSession, 
  GameProgress, 
  GameScore, 
  GameCompletion,
  GameLeaderboard,
  GameStats,
  GameCreateData,
  GameUpdateData,
  GameNotFoundError,
  GameValidationError,
  GameStateError,
  InsufficientCreditsError
} from '@/business/models/Game';
import { NotFoundError, ValidationError } from './IRepository';

export class GameRepository extends BaseRepository<Game> {
  constructor(supabaseClient: SupabaseClient) {
    super(supabaseClient, 'puzzles');
  }

  // Game management methods
  async createGame(gameData: GameCreateData): Promise<Game> {
    this.validateGameData(gameData);

    try {
      const result = await this.supabaseClient.executeMutation(async () => {
        return this.supabaseClient
          .getClient()
          .from('puzzles')
          .insert({
            title: gameData.title,
            puzzle_type: gameData.type,
            category_id: gameData.category_id,
            image_url: gameData.image_url,
            description: gameData.description,
            difficulty_level: gameData.difficulty,
            prize_value: gameData.prize_value || 0,
            cost_per_play: gameData.entry_fee || 0,
            time_limit: gameData.time_limit || 300,
            puzzle_config: gameData.config,
            status: 'draft',
            pieces: 64, // Default for jigsaw
            release_date: new Date().toISOString()
          })
          .select()
          .single();
      });

      return this.mapPuzzleToGame(result);
    } catch (error) {
      console.error('Error creating game:', error);
      throw new GameValidationError('Failed to create game');
    }
  }

  async updateGame(gameId: string, updates: GameUpdateData): Promise<Game> {
    try {
      const result = await this.supabaseClient.executeMutation(async () => {
        return this.supabaseClient
          .getClient()
          .from('puzzles')
          .update({
            title: updates.title,
            description: updates.description,
            difficulty_level: updates.difficulty,
            status: updates.status,
            prize_value: updates.prize_value,
            cost_per_play: updates.entry_fee,
            time_limit: updates.time_limit,
            puzzle_config: updates.config,
            updated_at: new Date().toISOString()
          })
          .eq('id', gameId)
          .select()
          .single();
      });

      if (!result) {
        throw new GameNotFoundError(gameId);
      }

      return this.mapPuzzleToGame(result);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new GameNotFoundError(gameId);
      }
      throw error;
    }
  }

  // Game session management
  async saveGameState(sessionData: {
    gameId: string;
    userId: string;
    gameState: any;
    score?: number;
    moves?: number;
    timeElapsed?: number;
  }): Promise<GameSession> {
    try {
      // Check if session exists
      const existingSession = await this.supabaseClient.executeOptionalQuery(async () => {
        return this.supabaseClient
          .getClient()
          .from('puzzle_progress')
          .select('*')
          .eq('puzzle_id', sessionData.gameId)
          .eq('user_id', sessionData.userId)
          .eq('is_completed', false)
          .maybeSingle();
      });

      let result;
      if (existingSession) {
        // Update existing session
        result = await this.supabaseClient.executeMutation(async () => {
          return this.supabaseClient
            .getClient()
            .from('puzzle_progress')
            .update({
              progress: {
                ...sessionData.gameState,
                score: sessionData.score,
                moves: sessionData.moves,
                timeElapsed: sessionData.timeElapsed
              },
              last_updated: new Date().toISOString()
            })
            .eq('id', existingSession.id)
            .select()
            .single();
        });
      } else {
        // Create new session
        result = await this.supabaseClient.executeMutation(async () => {
          return this.supabaseClient
            .getClient()
            .from('puzzle_progress')
            .insert({
              puzzle_id: sessionData.gameId,
              user_id: sessionData.userId,
              progress: {
                ...sessionData.gameState,
                score: sessionData.score,
                moves: sessionData.moves,
                timeElapsed: sessionData.timeElapsed
              },
              start_time: new Date().toISOString()
            })
            .select()
            .single();
        });
      }

      return this.mapProgressToSession(result);
    } catch (error) {
      console.error('Error saving game state:', error);
      throw new GameStateError('Failed to save game state');
    }
  }

  async getGameHistory(userId: string, limit: number = 50): Promise<GameSession[]> {
    try {
      const result = await this.supabaseClient.executeArrayQuery(async () => {
        return this.supabaseClient
          .getClient()
          .from('puzzle_progress')
          .select(`
            *,
            puzzles!inner(title, puzzle_type, image_url)
          `)
          .eq('user_id', userId)
          .order('start_time', { ascending: false })
          .limit(limit);
      });

      return result.map(item => this.mapProgressToSession(item));
    } catch (error) {
      console.error('Error fetching game history:', error);
      throw error;
    }
  }

  async updateScore(sessionId: string, score: number): Promise<void> {
    try {
      await this.supabaseClient.executeMutation(async () => {
        return this.supabaseClient
          .getClient()
          .from('puzzle_progress')
          .update({
            progress: this.supabaseClient.getClient().raw(`
              jsonb_set(progress, '{score}', '${score}')
            `),
            last_updated: new Date().toISOString()
          })
          .eq('id', sessionId);
      });
    } catch (error) {
      console.error('Error updating score:', error);
      throw new GameStateError('Failed to update score');
    }
  }

  async recordCompletion(completionData: {
    gameId: string;
    userId: string;
    sessionId: string;
    completionTime: number;
    finalScore: number;
    movesCount?: number;
    hintsUsed?: number;
    isWinner: boolean;
    prizeAwarded?: number;
  }): Promise<GameCompletion> {
    try {
      // Use transaction for completion recording
      const result = await this.supabaseClient.executeMutation(async () => {
        // Record completion
        const completion = await this.supabaseClient
          .getClient()
          .from('puzzle_completions')
          .insert({
            puzzle_id: completionData.gameId,
            user_id: completionData.userId,
            completion_time: completionData.completionTime,
            moves_count: completionData.movesCount,
            is_winner: completionData.isWinner
          })
          .select()
          .single();

        // Update progress as completed
        await this.supabaseClient
          .getClient()
          .from('puzzle_progress')
          .update({
            is_completed: true,
            completion_time: completionData.completionTime
          })
          .eq('id', completionData.sessionId);

        // Update game stats
        await this.supabaseClient
          .getClient()
          .from('puzzles')
          .update({
            completions: this.supabaseClient.getClient().raw('completions + 1')
          })
          .eq('id', completionData.gameId);

        return completion;
      });

      return {
        id: result.id,
        game_id: result.puzzle_id,
        user_id: result.user_id,
        session_id: completionData.sessionId,
        completion_time: result.completion_time,
        final_score: completionData.finalScore,
        moves_count: result.moves_count,
        hints_used: completionData.hintsUsed,
        is_winner: result.is_winner,
        prize_awarded: completionData.prizeAwarded,
        completion_data: {},
        created_at: result.completed_at
      };
    } catch (error) {
      console.error('Error recording completion:', error);
      throw new GameStateError('Failed to record game completion');
    }
  }

  async getGameStats(gameId: string): Promise<GameStats> {
    try {
      const result = await this.supabaseClient.executeOptionalQuery(async () => {
        return this.supabaseClient
          .getClient()
          .rpc('get_puzzle_stats', { puzzle_id: gameId })
          .single();
      });

      if (!result) {
        return {
          total_plays: 0,
          total_completions: 0,
          average_score: 0,
          best_score: 0,
          average_time: 0,
          best_time: 0,
          completion_rate: 0
        };
      }

      return {
        total_plays: result.total_plays || 0,
        total_completions: result.total_plays || 0,
        average_score: 0, // Not available in current schema
        best_score: 0, // Not available in current schema
        average_time: result.avg_completion_time || 0,
        best_time: result.fastest_time || 0,
        completion_rate: result.completion_rate || 0
      };
    } catch (error) {
      console.error('Error fetching game stats:', error);
      throw error;
    }
  }

  async getLeaderboard(gameId: string, limit: number = 10): Promise<GameLeaderboard[]> {
    try {
      const result = await this.supabaseClient.executeArrayQuery(async () => {
        return this.supabaseClient
          .getClient()
          .from('puzzle_leaderboard')
          .select(`
            *,
            profiles!inner(username)
          `)
          .eq('puzzle_id', gameId)
          .order('time_seconds', { ascending: true })
          .limit(limit);
      });

      return result.map((item, index) => ({
        id: item.id,
        game_id: item.puzzle_id,
        user_id: item.player_id,
        username: item.player_name || item.profiles?.username || 'Anonymous',
        score: 0, // Not available in current schema
        time_taken: item.time_seconds,
        rank: index + 1,
        created_at: item.created_at
      }));
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      throw error;
    }
  }

  // Private helper methods
  private validateGameData(gameData: GameCreateData): void {
    if (!gameData.title || gameData.title.length < 3) {
      throw new GameValidationError('Game title must be at least 3 characters long', 'title');
    }

    if (!gameData.type) {
      throw new GameValidationError('Game type is required', 'type');
    }

    if (gameData.entry_fee && gameData.entry_fee < 0) {
      throw new GameValidationError('Entry fee cannot be negative', 'entry_fee');
    }

    if (gameData.prize_value && gameData.prize_value < 0) {
      throw new GameValidationError('Prize value cannot be negative', 'prize_value');
    }
  }

  private mapPuzzleToGame(puzzle: any): Game {
    return {
      id: puzzle.id,
      title: puzzle.title,
      type: puzzle.puzzle_type,
      category_id: puzzle.category_id,
      image_url: puzzle.image_url,
      description: puzzle.description,
      difficulty: puzzle.difficulty_level,
      status: puzzle.status,
      prize_value: puzzle.prize_value,
      entry_fee: puzzle.cost_per_play,
      time_limit: puzzle.time_limit,
      max_players: undefined, // Not in current schema
      config: puzzle.puzzle_config || {},
      created_at: puzzle.created_at,
      updated_at: puzzle.updated_at,
      created_by: puzzle.created_by
    };
  }

  private mapProgressToSession(progress: any): GameSession {
    return {
      id: progress.id,
      game_id: progress.puzzle_id,
      user_id: progress.user_id,
      status: progress.is_completed ? 'completed' : 'active',
      start_time: progress.start_time,
      end_time: progress.is_completed ? progress.last_updated : undefined,
      score: progress.progress?.score,
      moves: progress.progress?.moves,
      time_elapsed: progress.progress?.timeElapsed,
      game_state: progress.progress,
      created_at: progress.start_time,
      updated_at: progress.last_updated
    };
  }
}

// Export a singleton instance
import { supabaseClient } from '@/data/api/supabase/SupabaseClient';
export const gameRepository = new GameRepository(supabaseClient);
