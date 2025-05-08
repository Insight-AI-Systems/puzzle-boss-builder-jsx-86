
import { corsHeaders } from './cors.ts';

/**
 * Success response helper
 */
export function successResponse(data: any, status = 200) {
  return new Response(
    JSON.stringify(data),
    { 
      status,
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json' 
      }
    }
  );
}

/**
 * Error response helper
 */
export function errorResponse(message: string, code = 'server_error', status = 500) {
  return new Response(
    JSON.stringify({ 
      error: { 
        message,
        code
      } 
    }),
    { 
      status,
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json' 
      }
    }
  );
}

/**
 * Forbidden response helper
 */
export function forbiddenResponse(message: string) {
  return errorResponse(message, 'forbidden', 403);
}

/**
 * Validation error response helper
 */
export function validationErrorResponse(message: string, validationErrors: Record<string, string>) {
  return new Response(
    JSON.stringify({ 
      error: { 
        message,
        code: 'validation_error',
        validationErrors
      } 
    }),
    { 
      status: 422,
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json' 
      }
    }
  );
}

/**
 * Not found response helper
 */
export function notFoundResponse(message = 'Resource not found') {
  return errorResponse(message, 'not_found', 404);
}
