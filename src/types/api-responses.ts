
/**
 * API Response Types
 * 
 * This file contains interfaces for API responses to ensure
 * consistent typing throughout the application.
 */

export interface ApiBaseResponse {
  success: boolean;
  error?: string;
  message?: string;
}

export interface ApiPaginatedResponse<T> extends ApiBaseResponse {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface ApiSingleResponse<T> extends ApiBaseResponse {
  data: T | null;
}

export interface ApiErrorDetails {
  code: string;
  message: string;
  details?: unknown;
  status?: number;
}
