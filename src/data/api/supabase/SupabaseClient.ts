
import { createClient, SupabaseClient as SupabaseClientType, PostgrestError } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';
import { RepositoryError } from '@/data/repositories/IRepository';

// Supabase client wrapper with enhanced error handling and connection management
export class SupabaseClient {
  private client: SupabaseClientType<Database>;
  private retryCount = 3;
  private retryDelay = 1000; // 1 second

  constructor() {
    // Import security config to avoid hardcoded credentials
    const { SECURITY_CONFIG } = require('@/config/security');
    
    this.client = createClient<Database>(
      SECURITY_CONFIG.SUPABASE_URL, 
      SECURITY_CONFIG.SUPABASE_ANON_KEY
    );
  }

  // Get the underlying Supabase client
  getClient(): SupabaseClientType<Database> {
    return this.client;
  }

  // Execute query with retry logic and error handling
  async executeQuery<T>(
    queryFn: () => Promise<{ data: T | null; error: PostgrestError | null }>
  ): Promise<T> {
    let lastError: PostgrestError | null = null;
    
    for (let attempt = 1; attempt <= this.retryCount; attempt++) {
      try {
        const { data, error } = await queryFn();
        
        if (error) {
          lastError = error;
          
          // Don't retry on certain errors
          if (this.isNonRetryableError(error)) {
            break;
          }
          
          // Wait before retrying
          if (attempt < this.retryCount) {
            await this.delay(this.retryDelay * attempt);
            continue;
          }
        }
        
        if (data === null && !error) {
          throw new RepositoryError('No data returned', 'NO_DATA');
        }
        
        return data as T;
      } catch (err) {
        if (err instanceof RepositoryError) {
          throw err;
        }
        
        lastError = err as PostgrestError;
        
        if (attempt < this.retryCount) {
          await this.delay(this.retryDelay * attempt);
          continue;
        }
      }
    }
    
    throw this.handleError(lastError);
  }

  // Execute query that may return null (for optional results)
  async executeOptionalQuery<T>(
    queryFn: () => Promise<{ data: T | null; error: PostgrestError | null }>
  ): Promise<T | null> {
    try {
      const { data, error } = await queryFn();
      
      if (error) {
        throw this.handleError(error);
      }
      
      return data;
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      throw this.handleError(err as PostgrestError);
    }
  }

  // Execute query that returns an array
  async executeArrayQuery<T>(
    queryFn: () => Promise<{ data: T[] | null; error: PostgrestError | null }>
  ): Promise<T[]> {
    try {
      const { data, error } = await queryFn();
      
      if (error) {
        throw this.handleError(error);
      }
      
      return data || [];
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      throw this.handleError(err as PostgrestError);
    }
  }

  // Execute mutation with proper error handling
  async executeMutation<T>(
    mutationFn: () => Promise<{ data: T | null; error: PostgrestError | null }>
  ): Promise<T> {
    try {
      const { data, error } = await mutationFn();
      
      if (error) {
        throw this.handleError(error);
      }
      
      if (data === null) {
        throw new RepositoryError('Mutation failed - no data returned', 'MUTATION_FAILED');
      }
      
      return data;
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      throw this.handleError(err as PostgrestError);
    }
  }

  // Check connection health
  async checkConnection(): Promise<boolean> {
    try {
      await this.client.from('profiles').select('id').limit(1);
      return true;
    } catch {
      return false;
    }
  }

  // Get current user
  getCurrentUser() {
    return this.client.auth.getUser();
  }

  // Get current session
  getSession() {
    return this.client.auth.getSession();
  }

  // Private helper methods
  private isNonRetryableError(error: PostgrestError): boolean {
    // Don't retry on authentication, authorization, or validation errors
    const nonRetryableCodes = ['PGRST301', 'PGRST302', 'PGRST116', '23505', '23514'];
    return nonRetryableCodes.some(code => error.code?.includes(code));
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private handleError(error: PostgrestError | null): RepositoryError {
    if (!error) {
      return new RepositoryError('Unknown error occurred', 'UNKNOWN_ERROR');
    }

    // Map specific Supabase errors to our error types
    switch (error.code) {
      case 'PGRST116':
        return new RepositoryError('Not found', 'NOT_FOUND', error);
      case '23505':
        return new RepositoryError('Duplicate entry', 'CONFLICT', error);
      case '23514':
        return new RepositoryError('Validation failed', 'VALIDATION_ERROR', error);
      case 'PGRST301':
        return new RepositoryError('Unauthorized', 'UNAUTHORIZED', error);
      case 'PGRST302':
        return new RepositoryError('Forbidden', 'FORBIDDEN', error);
      default:
        return new RepositoryError(
          error.message || 'Database operation failed',
          error.code || 'DB_ERROR',
          error
        );
    }
  }
}

// Singleton instance
export const supabaseClient = new SupabaseClient();
