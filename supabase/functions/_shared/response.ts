
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

// Success response helper
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

// Error response helper
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
