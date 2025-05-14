
import { ApiErrorDetails } from '@/types/api-responses';
import { toast } from '@/hooks/use-toast';

/**
 * Standard error class for API errors
 */
export class ApiError extends Error {
  code: string;
  details?: unknown;
  status?: number;

  constructor(errorDetails: ApiErrorDetails) {
    super(errorDetails.message);
    this.name = 'ApiError';
    this.code = errorDetails.code;
    this.details = errorDetails.details;
    this.status = errorDetails.status;
  }
}

/**
 * Parse and standardize error from any source
 */
export function parseError(error: unknown): ApiErrorDetails {
  // If it's already an ApiError, return its properties
  if (error instanceof ApiError) {
    return {
      code: error.code,
      message: error.message,
      details: error.details,
      status: error.status
    };
  }

  // If it's a standard Error
  if (error instanceof Error) {
    return {
      code: 'unknown_error',
      message: error.message || 'An unknown error occurred',
      details: error.stack
    };
  }

  // Handle Supabase-specific error format
  if (
    typeof error === 'object' && 
    error !== null && 
    'code' in error &&
    'message' in error &&
    typeof (error as any).code === 'string' &&
    typeof (error as any).message === 'string'
  ) {
    return {
      code: (error as any).code,
      message: (error as any).message,
      details: (error as any).details,
      status: (error as any).status
    };
  }

  // For completely unknown errors
  return {
    code: 'unhandled_error',
    message: error instanceof Error 
      ? error.toString() 
      : typeof error === 'string' 
        ? error 
        : 'An unknown error occurred'
  };
}

/**
 * Display a standardized error toast for API errors
 */
export function showErrorToast(error: unknown, title = 'Error'): void {
  const parsedError = parseError(error);
  
  toast({
    title,
    description: parsedError.message,
    variant: 'destructive',
  });
  
  // Also log to console for debugging
  console.error('API Error:', parsedError);
}

/**
 * Process and handle errors in API calls
 */
export function handleApiError<T>(
  error: unknown,
  showToast = true,
  defaultReturnValue?: T
): T | undefined {
  const parsedError = parseError(error);
  
  if (showToast) {
    showErrorToast(parsedError);
  }
  
  return defaultReturnValue;
}
