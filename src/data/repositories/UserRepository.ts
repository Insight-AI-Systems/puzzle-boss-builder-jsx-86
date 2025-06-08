
import { BaseRepository } from './BaseRepository';
import { User } from '@/business/models/User';
import { supabase } from '@/integrations/supabase/client';

export class UserRepository extends BaseRepository<User> {
  protected tableName = 'profiles';

  constructor() {
    super(supabase);
  }

  async getUser(userId: string): Promise<User | null> {
    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data as User || null;
    } catch (error) {
      console.error('Failed to get user:', error);
      return null;
    }
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<User> {
    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return data as User;
    } catch (error) {
      console.error('Failed to update user:', error);
      throw error;
    }
  }
}

export const userRepository = new UserRepository();
