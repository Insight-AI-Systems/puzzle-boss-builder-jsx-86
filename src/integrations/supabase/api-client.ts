
import { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from './client';
import { Database } from './types';

export type ApiError = {
  code: string;
  message: string;
  details?: unknown;
  status?: number;
};

export type ApiResponse<T> = {
  data: T | null;
  error: ApiError | null;
};

/**
 * Standardized API client wrapping Supabase calls
 * with consistent error handling and response formatting
 */
class ApiClient {
  private client: SupabaseClient<Database>;

  constructor(supabaseClient: SupabaseClient<Database>) {
    this.client = supabaseClient;
  }

  /**
   * Standardized error formatting for consistent error handling
   */
  private formatError(error: any): ApiError {
    console.error('API error:', error);
    
    // Handle Supabase-specific error format
    if (error.code && error.message) {
      return {
        code: error.code,
        message: error.message,
        details: error.details,
        status: error.status
      };
    }
    
    // Handle unexpected error formats
    return {
      code: 'unknown_error',
      message: error.message || 'An unexpected error occurred',
      details: error
    };
  }

  /**
   * Standardized GET request
   */
  async get<T>(path: string, options?: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.from(path).select(options?.query || '*');
      
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

  /**
   * Standardized GET request for a single record
   */
  async getById<T>(path: string, id: string | number, options?: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.client
        .from(path)
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

  /**
   * Standardized POST request
   */
  async create<T>(path: string, data: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.client
        .from(path)
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

  /**
   * Standardized PUT request
   */
  async update<T>(path: string, id: string | number, data: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.client
        .from(path)
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

  /**
   * Standardized DELETE request
   */
  async delete(path: string, id: string | number): Promise<ApiResponse<null>> {
    try {
      const response = await this.client
        .from(path)
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

  /**
   * Advanced query using builder pattern
   */
  query(table: string) {
    return this.client.from(table);
  }
}

// Export singleton instance
export const apiClient = new ApiClient(supabase);
