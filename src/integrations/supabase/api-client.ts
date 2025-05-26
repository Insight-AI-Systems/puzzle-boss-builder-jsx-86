
import { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from './client';
import { Database } from './types';

export interface ApiError {
  message: string;
  code?: string;
}

export interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
}

class ApiClient {
  private client: SupabaseClient<Database>;

  constructor(supabaseClient: SupabaseClient<Database>) {
    this.client = supabaseClient;
  }

  private formatError(error: unknown): ApiError {
    if (error && typeof error === 'object' && 'message' in error) {
      return {
        message: (error as any).message,
        code: (error as any).code
      };
    }
    return {
      message: 'An unknown error occurred'
    };
  }

  async get<T>(tableName: string, options?: any): Promise<ApiResponse<T>> {
    try {
      const query = this.client.from(tableName as any).select(options?.query || '*');
      
      if (options?.filters) {
        Object.entries(options.filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            query.eq(key, value);
          }
        });
      }
      
      if (options?.page !== undefined && options?.pageSize) {
        const from = options.page * options.pageSize;
        const to = from + options.pageSize - 1;
        query.range(from, to);
      }
      
      if (options?.orderBy) {
        query.order(options.orderBy, { 
          ascending: options?.ascending !== false
        });
      }
      
      const response = await query;
      
      if (response.error) {
        return {
          data: null,
          error: this.formatError(response.error)
        };
      }
      
      return {
        data: response.data as unknown as T,
        error: null
      };
    } catch (error) {
      return {
        data: null,
        error: this.formatError(error)
      };
    }
  }

  async getById<T>(tableName: string, id: string | number, options?: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.client
        .from(tableName as any)
        .select(options?.query || '*')
        .eq('id', id)
        .maybeSingle();
      
      if (response.error) {
        return {
          data: null,
          error: this.formatError(response.error)
        };
      }
      
      return {
        data: response.data as unknown as T,
        error: null
      };
    } catch (error) {
      return {
        data: null,
        error: this.formatError(error)
      };
    }
  }

  async create<T>(tableName: string, data: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.client
        .from(tableName as any)
        .insert([data])
        .select();
      
      if (response.error) {
        return {
          data: null,
          error: this.formatError(response.error)
        };
      }
      
      return {
        data: response.data?.[0] as unknown as T,
        error: null
      };
    } catch (error) {
      return {
        data: null,
        error: this.formatError(error)
      };
    }
  }

  async update<T>(tableName: string, id: string | number, data: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.client
        .from(tableName as any)
        .update(data)
        .eq('id', id)
        .select();
      
      if (response.error) {
        return {
          data: null,
          error: this.formatError(response.error)
        };
      }
      
      return {
        data: response.data?.[0] as unknown as T,
        error: null
      };
    } catch (error) {
      return {
        data: null,
        error: this.formatError(error)
      };
    }
  }

  async delete(tableName: string, id: string | number): Promise<ApiResponse<null>> {
    try {
      const response = await this.client
        .from(tableName as any)
        .delete()
        .eq('id', id);
      
      if (response.error) {
        return {
          data: null,
          error: this.formatError(response.error)
        };
      }
      
      return {
        data: null,
        error: null
      };
    } catch (error) {
      return {
        data: null,
        error: this.formatError(error)
      };
    }
  }

  query(table: string) {
    return this.client.from(table as any);
  }

  getRawClient() {
    return this.client;
  }
}

export const apiClient = new ApiClient(supabase);
