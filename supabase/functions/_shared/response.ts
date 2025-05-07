
// Standard HTTP status codes
export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  INTERNAL_SERVER_ERROR = 500,
  SERVICE_UNAVAILABLE = 503
}

// Standard CORS headers for edge functions
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * Creates a standardized success response
 * @param data The data to return in the response
 * @param status HTTP status code (defaults to 200)
 * @returns Response object with standardized format
 */
export function successResponse(data: any, status: number = HttpStatus.OK): Response {
  return new Response(
    JSON.stringify(data),
    {
      status,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    }
  );
}

/**
 * Creates a standardized error response
 * @param message Human-readable error message
 * @param code Machine-readable error code
 * @param status HTTP status code (defaults to 400)
 * @param details Optional additional details about the error
 * @returns Response object with standardized format
 */
export function errorResponse(
  message: string,
  code: string,
  status: number = HttpStatus.BAD_REQUEST,
  details?: any
): Response {
  return new Response(
    JSON.stringify({
      error: {
        message,
        code,
        details
      }
    }),
    {
      status,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    }
  );
}

/**
 * Shorthand for 403 Forbidden responses
 */
export function forbiddenResponse(message: string = "You don't have permission to perform this action"): Response {
  return errorResponse(message, "forbidden", HttpStatus.FORBIDDEN);
}

/**
 * Shorthand for 401 Unauthorized responses
 */
export function unauthorizedResponse(message: string = "Authentication required"): Response {
  return errorResponse(message, "unauthorized", HttpStatus.UNAUTHORIZED);
}

/**
 * Shorthand for 404 Not Found responses
 */
export function notFoundResponse(message: string = "Resource not found"): Response {
  return errorResponse(message, "not_found", HttpStatus.NOT_FOUND);
}

/**
 * Shorthand for validation error responses
 */
export function validationErrorResponse(message: string, fieldErrors: Record<string, string>): Response {
  return errorResponse(
    message,
    "validation_error",
    HttpStatus.UNPROCESSABLE_ENTITY,
    { fields: fieldErrors }
  );
}
