
import { SupabaseClient } from '@/data/api/supabase/SupabaseClient';
import { 
  IRepository, 
  PaginatedResult, 
  RepositoryError, 
  NotFoundError 
} from './IRepository';

// Abstract base repository implementing common CRUD operations
export abstract class BaseRepository<T extends Record<string, any>, K = string> implements IRepository<T, K> {
  constructor(
    protected supabaseClient: SupabaseClient,
    protected tableName: string
  ) {}

  async findById(id: K): Promise<T | null> {
    const { data, error } = await this.supabaseClient
      .getClient()
      .from(this.tableName as any)
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (error) throw new RepositoryError(`Failed to find record: ${error.message}`);
    return data as T | null;
  }

  async findMany(filter?: Partial<T>): Promise<T[]> {
    let query = this.supabaseClient.getClient().from(this.tableName as any).select('*');
    
    if (filter) {
      Object.entries(filter).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value);
        }
      });
    }
    
    const { data, error } = await query;
    if (error) throw new RepositoryError(`Failed to find records: ${error.message}`);
    return data as T[];
  }

  async create(entity: Omit<T, 'id' | 'created_at' | 'updated_at'>): Promise<T> {
    const { data, error } = await this.supabaseClient
      .getClient()
      .from(this.tableName as any)
      .insert(entity as any)
      .select()
      .single();
    
    if (error) throw new RepositoryError(`Failed to create record: ${error.message}`);
    return data as T;
  }

  async update(id: K, updates: Partial<T>): Promise<T> {
    const { data, error } = await this.supabaseClient
      .getClient()
      .from(this.tableName as any)
      .update(updates as any)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new NotFoundError(this.tableName, String(id));
      }
      throw new RepositoryError(`Failed to update record: ${error.message}`);
    }

    return data as T;
  }

  async delete(id: K): Promise<boolean> {
    const { error } = await this.supabaseClient
      .getClient()
      .from(this.tableName as any)
      .delete()
      .eq('id', id);
    
    if (error) {
      if (error.code === 'PGRST116') {
        return false;
      }
      throw new RepositoryError(`Failed to delete record: ${error.message}`);
    }
    
    return true;
  }

  async createMany(entities: Omit<T, 'id' | 'created_at' | 'updated_at'>[]): Promise<T[]> {
    const { data, error } = await this.supabaseClient
      .getClient()
      .from(this.tableName as any)
      .insert(entities as any[])
      .select();
    
    if (error) throw new RepositoryError(`Failed to create records: ${error.message}`);
    return data as T[];
  }

  async updateMany(filter: Partial<T>, updates: Partial<T>): Promise<T[]> {
    let query = this.supabaseClient
      .getClient()
      .from(this.tableName as any)
      .update(updates as any);
    
    Object.entries(filter).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        query = query.eq(key, value);
      }
    });
    
    const { data, error } = await query.select();
    if (error) throw new RepositoryError(`Failed to update records: ${error.message}`);
    return data as T[];
  }

  async deleteMany(filter: Partial<T>): Promise<number> {
    let query = this.supabaseClient.getClient().from(this.tableName as any).delete();
    
    Object.entries(filter).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        query = query.eq(key, value);
      }
    });
    
    const { data, error } = await query.select();
    if (error) throw new RepositoryError(`Failed to delete records: ${error.message}`);
    return data ? data.length : 0;
  }

  async count(filter?: Partial<T>): Promise<number> {
    let query = this.supabaseClient
      .getClient()
      .from(this.tableName as any)
      .select('*', { count: 'exact', head: true });
    
    if (filter) {
      Object.entries(filter).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value);
        }
      });
    }
    
    const { count, error } = await query;
    if (error) throw new RepositoryError(`Failed to count records: ${error.message}`);
    return count || 0;
  }

  async exists(id: K): Promise<boolean> {
    const result = await this.findById(id);
    return result !== null;
  }

  async findPaginated(
    page: number = 1,
    limit: number = 10,
    filter?: Partial<T>,
    sortBy?: keyof T,
    sortOrder: 'asc' | 'desc' = 'asc'
  ): Promise<PaginatedResult<T>> {
    const offset = (page - 1) * limit;
    
    // Get total count
    const total = await this.count(filter);
    
    // Get paginated data
    let query = this.supabaseClient.getClient().from(this.tableName as any).select('*');
    
    if (filter) {
      Object.entries(filter).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value);
        }
      });
    }
    
    if (sortBy) {
      query = query.order(String(sortBy), { ascending: sortOrder === 'asc' });
    }
    
    const { data, error } = await query.range(offset, offset + limit - 1);
    if (error) throw new RepositoryError(`Failed to get paginated data: ${error.message}`);

    const totalPages = Math.ceil(total / limit);

    return {
      data: data as T[],
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    };
  }
}
