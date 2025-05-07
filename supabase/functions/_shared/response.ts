
import { corsHeaders } from './cors.ts';

// Standard response type
export interface StandardResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

/**
 * Create a standardized success response
 * 
 * @param data Optional data to include in the response
 * @param message Optional success message
 * @param status HTTP status code (defaults to 200)
 * @returns Formatted Response object
 */
export function successResponse<T = any>(data?: T, message?: string, status = 200): Response {
  const responseBody: StandardResponse<T> = {
    success: true,
    message,
    data
  };
  
  return new Response(
    JSON.stringify(responseBody),
    {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
}

/**
 * Create a standardized error response
 * 
 * @param message Error message to display
 * @param code Error code identifier (defaults to 'internal_error')
 * @param status HTTP status code (defaults to 500)
 * @param details Additional error details (optional)
 * @returns Formatted Response object
 */
export function errorResponse(
  message: string,
  code = 'internal_error',
  status = 500,
  details?: any
): Response {
  const responseBody: StandardResponse = {
    success: false,
    error: {
      code,
      message,
      details
    }
  };
  
  console.error(`Error [${code}]: ${message}`, details);
  
  return new Response(
    JSON.stringify(responseBody),
    {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
}

/**
 * Create a validation error response
 * 
 * @param message Validation error message
 * @param validationErrors Map of field-specific validation errors
 * @returns Formatted Response object
 */
export function validationErrorResponse(
  message: string,
  validationErrors: Record<string, string>
): Response {
  return errorResponse(
    message,
    'validation_error',
    400,
    { validationErrors }
  );
}

/**
 * Create an unauthorized error response
 * 
 * @param message Error message (defaults to 'Unauthorized')
 * @param details Additional error details (optional)
 * @returns Formatted Response object
 */
export function unauthorizedResponse(message = 'Unauthorized', details?: any): Response {
  return errorResponse(message, 'unauthorized', 401, details);
}

/**
 * Create a forbidden error response
 * 
 * @param message Error message (defaults to 'Permission denied')
 * @param details Additional error details (optional)
 * @returns Formatted Response object
 */
export function forbiddenResponse(message = 'Permission denied', details?: any): Response {
  return errorResponse(message, 'forbidden', 403, details);
}

/**
 * Create a not found error response
 * 
 * @param message Error message (defaults to 'Resource not found')
 * @param details Additional error details (optional)
 * @returns Formatted Response object
 */
export function notFoundResponse(message = 'Resource not found', details?: any): Response {
  return errorResponse(message, 'not_found', 404, details);
}

// HTTP Status code helpers
export const HttpStatus = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422, 
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
};
