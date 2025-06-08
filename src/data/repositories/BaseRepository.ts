
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
    return this.supabaseClient.executeOptionalQuery(async () => {
      return this.supabaseClient
        .getClient()
        .from(this.tableName)
        .select('*')
        .eq('id', id)
        .maybeSingle() as Promise<T | null>;
    });
  }

  async findMany(filter?: Partial<T>): Promise<T[]> {
    return this.supabaseClient.executeArrayQuery(async () => {
      let query = this.supabaseClient.getClient().from(this.tableName).select('*');
      
      if (filter) {
        Object.entries(filter).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            query = query.eq(key, value);
          }
        });
      }
      
      return query as Promise<T[]>;
    });
  }

  async create(entity: Omit<T, 'id' | 'created_at' | 'updated_at'>): Promise<T> {
    return this.supabaseClient.executeMutation(async () => {
      return this.supabaseClient
        .getClient()
        .from(this.tableName)
        .insert(entity as any)
        .select()
        .single() as Promise<T>;
    });
  }

  async update(id: K, updates: Partial<T>): Promise<T> {
    const result = await this.supabaseClient.executeMutation(async () => {
      return this.supabaseClient
        .getClient()
        .from(this.tableName)
        .update(updates as any)
        .eq('id', id)
        .select()
        .single() as Promise<T>;
    });

    if (!result) {
      throw new NotFoundError(this.tableName, String(id));
    }

    return result;
  }

  async delete(id: K): Promise<boolean> {
    try {
      await this.supabaseClient.executeMutation(async () => {
        return this.supabaseClient
          .getClient()
          .from(this.tableName)
          .delete()
          .eq('id', id)
          .select()
          .single() as Promise<T>;
      });
      return true;
    } catch (error) {
      if (error instanceof RepositoryError && error.code === 'NOT_FOUND') {
        return false;
      }
      throw error;
    }
  }

  async createMany(entities: Omit<T, 'id' | 'created_at' | 'updated_at'>[]): Promise<T[]> {
    return this.supabaseClient.executeArrayQuery(async () => {
      return this.supabaseClient
        .getClient()
        .from(this.tableName)
        .insert(entities as any[])
        .select() as Promise<T[]>;
    });
  }

  async updateMany(filter: Partial<T>, updates: Partial<T>): Promise<T[]> {
    return this.supabaseClient.executeArrayQuery(async () => {
      let query = this.supabaseClient
        .getClient()
        .from(this.tableName)
        .update(updates as any);
      
      Object.entries(filter).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value);
        }
      });
      
      return query.select() as Promise<T[]>;
    });
  }

  async deleteMany(filter: Partial<T>): Promise<number> {
    const result = await this.supabaseClient.executeArrayQuery(async () => {
      let query = this.supabaseClient.getClient().from(this.tableName).delete();
      
      Object.entries(filter).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value);
        }
      });
      
      return query.select() as Promise<T[]>;
    });

    return result.length;
  }

  async count(filter?: Partial<T>): Promise<number> {
    const result = await this.supabaseClient.executeQuery(async () => {
      let query = this.supabaseClient
        .getClient()
        .from(this.tableName)
        .select('*', { count: 'exact', head: true });
      
      if (filter) {
        Object.entries(filter).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            query = query.eq(key, value);
          }
        });
      }
      
      return query;
    });

    return (result as any).count || 0;
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
    const data = await this.supabaseClient.executeArrayQuery(async () => {
      let query = this.supabaseClient.getClient().from(this.tableName).select('*');
      
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
      
      return query.range(offset, offset + limit - 1) as Promise<T[]>;
    });

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    };
  }
}
