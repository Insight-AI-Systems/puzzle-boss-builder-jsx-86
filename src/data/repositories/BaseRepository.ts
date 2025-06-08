
import { SupabaseClient } from '@supabase/supabase-js';

export abstract class BaseRepository<T extends Record<string, any>> {
  protected supabase: SupabaseClient;
  protected abstract tableName: string;

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
  }

  async create(data: Partial<T>): Promise<T> {
    const { data: result, error } = await this.supabase
      .from(this.tableName)
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return result as T;
  }

  async findAll(): Promise<T[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*');

    if (error) throw error;
    return data as T[];
  }

  async findById(id: string): Promise<T | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data as T;
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    const { data: result, error } = await this.supabase
      .from(this.tableName)
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return result as T;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from(this.tableName)
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async findByField(field: keyof T, value: any): Promise<T[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq(field as string, value);

    if (error) throw error;
    return data as T[];
  }

  async findWhere(conditions: Partial<T>): Promise<T[]> {
    let query = this.supabase.from(this.tableName).select('*');

    Object.entries(conditions).forEach(([key, value]) => {
      query = query.eq(key, value);
    });

    const { data, error } = await query;

    if (error) throw error;
    return data as T[];
  }

  async count(): Promise<number> {
    const { count, error } = await this.supabase
      .from(this.tableName)
      .select('*', { count: 'exact', head: true });

    if (error) throw error;
    return count || 0;
  }

  async exists(id: string): Promise<boolean> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('id')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return !!data;
  }

  async upsert(data: Partial<T>): Promise<T> {
    const { data: result, error } = await this.supabase
      .from(this.tableName)
      .upsert(data)
      .select()
      .single();

    if (error) throw error;
    return result as T;
  }

  async bulkCreate(items: Partial<T>[]): Promise<T[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .insert(items)
      .select();

    if (error) throw error;
    return data as T[];
  }

  async bulkUpdate(updates: Array<{ id: string; data: Partial<T> }>): Promise<T[]> {
    const promises = updates.map(({ id, data }) => this.update(id, data));
    return Promise.all(promises);
  }

  async bulkDelete(ids: string[]): Promise<void> {
    const { error } = await this.supabase
      .from(this.tableName)
      .delete()
      .in('id', ids);

    if (error) throw error;
  }
}
