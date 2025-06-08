
import { BaseRepository } from './BaseRepository';
import { SupabaseClient } from '@/data/api/supabase/SupabaseClient';
import { 
  User, 
  UserStats, 
  UserPuzzle, 
  UserCreateData, 
  UserUpdateData,
  UserNotFoundError,
  UserValidationError,
  UserPermissionError
} from '@/business/models/User';
import { NotFoundError, ValidationError } from './IRepository';

export class UserRepository extends BaseRepository<User> {
  constructor(supabaseClient: SupabaseClient) {
    super(supabaseClient, 'profiles');
  }

  // Get user by ID with profile data
  async getUser(userId: string): Promise<User | null> {
    try {
      const result = await this.supabaseClient.executeOptionalQuery(async () => {
        return this.supabaseClient
          .getClient()
          .from('profiles')
          .select(`
            id,
            email,
            username,
            full_name,
            avatar_url,
            role,
            bio,
            credits,
            created_at,
            updated_at,
            last_sign_in,
            phone,
            address_line1,
            address_line2,
            city,
            state,
            postal_code,
            country,
            date_of_birth,
            gender,
            custom_gender,
            age_group,
            marketing_opt_in,
            terms_accepted,
            terms_accepted_at
          `)
          .eq('id', userId)
          .maybeSingle();
      });

      return result as User | null;
    } catch (error) {
      if (error instanceof NotFoundError) {
        return null;
      }
      throw error;
    }
  }

  // Update user profile
  async updateUser(userId: string, updates: UserUpdateData): Promise<User> {
    this.validateUserUpdate(updates);

    try {
      const result = await this.supabaseClient.executeMutation(async () => {
        return this.supabaseClient
          .getClient()
          .from('profiles')
          .update({
            ...updates,
            updated_at: new Date().toISOString()
          })
          .eq('id', userId)
          .select(`
            id,
            email,
            username,
            full_name,
            avatar_url,
            role,
            bio,
            credits,
            created_at,
            updated_at,
            last_sign_in,
            phone,
            address_line1,
            address_line2,
            city,
            state,
            postal_code,
            country,
            date_of_birth,
            gender,
            custom_gender,
            age_group,
            marketing_opt_in,
            terms_accepted,
            terms_accepted_at
          `)
          .single();
      });

      if (!result) {
        throw new UserNotFoundError(userId);
      }

      return result as User;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new UserNotFoundError(userId);
      }
      throw error;
    }
  }

  // Get user statistics
  async getUserStats(userId: string): Promise<UserStats> {
    try {
      // Get puzzle completions
      const completions = await this.supabaseClient.executeArrayQuery(async () => {
        return this.supabaseClient
          .getClient()
          .from('puzzle_completions')
          .select(`
            completion_time,
            moves_count,
            completed_at,
            is_winner,
            puzzles!inner(title, category_id, prize_value),
            categories!inner(name)
          `)
          .eq('user_id', userId);
      });

      // Calculate stats
      const totalPuzzlesCompleted = completions.length;
      const totalTimePlayed = completions.reduce((sum, comp) => sum + (comp.completion_time || 0), 0);
      const averageCompletionTime = totalPuzzlesCompleted > 0 ? totalTimePlayed / totalPuzzlesCompleted : 0;
      const fastestTime = completions.length > 0 ? Math.min(...completions.map(c => c.completion_time || Infinity)) : 0;
      
      // Get unique categories played
      const categoriesPlayed = [...new Set(completions.map(comp => comp.categories?.name).filter(Boolean))];
      
      // Calculate total winnings
      const winnings = completions
        .filter(comp => comp.is_winner)
        .reduce((sum, comp) => sum + (comp.puzzles?.prize_value || 0), 0);

      // For now, return empty achievements and rank (can be expanded later)
      const achievements: any[] = [];
      const rank = 0;

      return {
        totalPuzzlesCompleted,
        totalTimePlayed,
        averageCompletionTime,
        fastestTime: fastestTime === Infinity ? 0 : fastestTime,
        categoriesPlayed,
        achievements,
        rank,
        winnings
      };
    } catch (error) {
      console.error('Error fetching user stats:', error);
      throw error;
    }
  }

  // Get user's puzzle history
  async getUserPuzzles(userId: string, limit: number = 50): Promise<UserPuzzle[]> {
    try {
      const result = await this.supabaseClient.executeArrayQuery(async () => {
        return this.supabaseClient
          .getClient()
          .from('puzzle_completions')
          .select(`
            id,
            puzzle_id,
            completion_time,
            moves_count,
            completed_at,
            is_winner,
            puzzles!inner(title, prize_value, categories!inner(name))
          `)
          .eq('user_id', userId)
          .order('completed_at', { ascending: false })
          .limit(limit);
      });

      return result.map(comp => ({
        id: comp.id,
        puzzle_id: comp.puzzle_id,
        title: comp.puzzles?.title || 'Unknown Puzzle',
        category: comp.puzzles?.categories?.name || 'Unknown Category',
        completion_time: comp.completion_time || 0,
        moves_count: comp.moves_count || 0,
        completed_at: comp.completed_at,
        is_winner: comp.is_winner || false,
        prize_value: comp.is_winner ? (comp.puzzles?.prize_value || 0) : 0
      })) as UserPuzzle[];
    } catch (error) {
      console.error('Error fetching user puzzles:', error);
      throw error;
    }
  }

  // Award credits to user
  async awardCredits(userId: string, amount: number, reason: string): Promise<User> {
    if (amount <= 0) {
      throw new UserValidationError('Credit amount must be positive');
    }

    try {
      // Get current user
      const user = await this.getUser(userId);
      if (!user) {
        throw new UserNotFoundError(userId);
      }

      // Update credits
      const updatedUser = await this.updateUser(userId, {
        // We'll need to handle credits separately as it's not in UserUpdateData
      });

      // Also update the credits field directly
      await this.supabaseClient.executeMutation(async () => {
        return this.supabaseClient
          .getClient()
          .from('profiles')
          .update({ credits: (user.credits || 0) + amount })
          .eq('id', userId)
          .select()
          .single();
      });

      // Log the credit transaction
      await this.supabaseClient.executeMutation(async () => {
        return this.supabaseClient
          .getClient()
          .from('financial_transactions')
          .insert({
            user_id: userId,
            member_id: userId,
            transaction_type: 'credit_award',
            amount: amount,
            currency: 'CREDITS',
            status: 'completed',
            description: reason,
            metadata: {
              award_type: 'manual',
              awarded_at: new Date().toISOString()
            }
          })
          .select()
          .single();
      });

      // Return updated user
      return await this.getUser(userId) as User;
    } catch (error) {
      console.error('Error awarding credits:', error);
      throw error;
    }
  }

  // Check if user has sufficient credits
  async hasCredits(userId: string, amount: number): Promise<boolean> {
    const user = await this.getUser(userId);
    return user ? (user.credits || 0) >= amount : false;
  }

  // Deduct credits from user
  async deductCredits(userId: string, amount: number, reason: string): Promise<User> {
    if (amount <= 0) {
      throw new UserValidationError('Credit amount must be positive');
    }

    const user = await this.getUser(userId);
    if (!user) {
      throw new UserNotFoundError(userId);
    }

    if ((user.credits || 0) < amount) {
      throw new UserValidationError('Insufficient credits');
    }

    try {
      // Update credits
      await this.supabaseClient.executeMutation(async () => {
        return this.supabaseClient
          .getClient()
          .from('profiles')
          .update({ credits: (user.credits || 0) - amount })
          .eq('id', userId)
          .select()
          .single();
      });

      // Log the credit transaction
      await this.supabaseClient.executeMutation(async () => {
        return this.supabaseClient
          .getClient()
          .from('financial_transactions')
          .insert({
            user_id: userId,
            member_id: userId,
            transaction_type: 'credit_deduction',
            amount: -amount,
            currency: 'CREDITS',
            status: 'completed',
            description: reason,
            metadata: {
              deduction_type: 'game_entry',
              deducted_at: new Date().toISOString()
            }
          })
          .select()
          .single();
      });

      // Return updated user
      return await this.getUser(userId) as User;
    } catch (error) {
      console.error('Error deducting credits:', error);
      throw error;
    }
  }

  // Get users by role
  async getUsersByRole(role: string): Promise<User[]> {
    try {
      return await this.supabaseClient.executeArrayQuery(async () => {
        return this.supabaseClient
          .getClient()
          .from('profiles')
          .select('*')
          .eq('role', role);
      }) as User[];
    } catch (error) {
      console.error('Error fetching users by role:', error);
      throw error;
    }
  }

  // Search users
  async searchUsers(searchTerm: string, limit: number = 20): Promise<User[]> {
    try {
      return await this.supabaseClient.executeArrayQuery(async () => {
        return this.supabaseClient
          .getClient()
          .from('profiles')
          .select('*')
          .or(`username.ilike.%${searchTerm}%,full_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`)
          .limit(limit);
      }) as User[];
    } catch (error) {
      console.error('Error searching users:', error);
      throw error;
    }
  }

  // Private validation methods
  private validateUserUpdate(updates: UserUpdateData): void {
    if (updates.username && updates.username.length < 3) {
      throw new UserValidationError('Username must be at least 3 characters long', 'username');
    }

    if (updates.email && !this.isValidEmail(updates.email)) {
      throw new UserValidationError('Invalid email format', 'email');
    }

    if (updates.age_group && !['13-17', '18-24', '25-34', '35-44', '45-60', '60+'].includes(updates.age_group)) {
      throw new UserValidationError('Invalid age group', 'age_group');
    }

    if (updates.gender && !['male', 'female', 'non-binary', 'custom', 'prefer-not-to-say', 'other'].includes(updates.gender)) {
      throw new UserValidationError('Invalid gender', 'gender');
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

// Export a singleton instance
import { supabaseClient } from '@/data/api/supabase/SupabaseClient';
export const userRepository = new UserRepository(supabaseClient);
