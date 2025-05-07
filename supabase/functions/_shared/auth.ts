
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { EdgeFunctionLogger } from "./logging.ts";
import { errorResponse, HttpStatus } from "./response.ts";
import { getSupabaseConfig } from "./config.ts";

// Initialize logger
const logger = new EdgeFunctionLogger("auth-utils");

// Define protected admin email constant for consistent reference
export const PROTECTED_ADMIN_EMAIL = 'alan@insight-ai-systems.com';

export interface AuthResult {
  user: { id: string; email?: string } | null;
  error: Response | null;
}

/**
 * Verify authentication token in request
 * 
 * @param req - The incoming request
 * @returns Authentication result with user info or error
 */
export async function verifyAuth(req: Request): Promise<AuthResult> {
  try {
    // Get JWT from the Authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      logger.warn("No Authorization header");
      return {
        user: null,
        error: errorResponse("No Authorization header", "unauthorized", HttpStatus.UNAUTHORIZED)
      };
    }

    // Extract the token from the Authorization header
    const token = authHeader.replace('Bearer ', '');
    if (!token) {
      logger.warn("No token found in Authorization header");
      return {
        user: null,
        error: errorResponse("No token provided", "unauthorized", HttpStatus.UNAUTHORIZED)
      };
    }

    // Create Supabase client
    const config = getSupabaseConfig();
    if (!config || !config.url || !config.serviceRoleKey) {
      logger.error("Missing Supabase configuration");
      return {
        user: null,
        error: errorResponse("Server configuration error", "server_error", HttpStatus.INTERNAL_SERVER_ERROR)
      };
    }
    
    const supabase = createClient(config.url, config.serviceRoleKey);
    
    // Verify the token
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      logger.warn("Invalid token", { error });
      return {
        user: null,
        error: errorResponse("Invalid token", "unauthorized", HttpStatus.UNAUTHORIZED)
      };
    }

    // Special case for a protected admin
    if (user.email?.toLowerCase() === PROTECTED_ADMIN_EMAIL.toLowerCase()) {
      logger.info("Protected admin authenticated", { 
        userId: user.id, 
        email: user.email 
      });
    } else {
      logger.info("User authenticated successfully", { 
        userId: user.id,
        email: user.email 
      });
    }

    return { 
      user: { id: user.id, email: user.email },
      error: null 
    };
  } catch (err) {
    logger.error("Error in verifyAuth", { error: err });
    return {
      user: null,
      error: errorResponse("Authentication error", "server_error", HttpStatus.INTERNAL_SERVER_ERROR)
    };
  }
}

/**
 * Helper function to check if user is a specific protected admin
 * 
 * @param email - Email to check
 * @returns Boolean indicating if email matches protected admin
 */
export function isProtectedAdmin(email?: string): boolean {
  if (!email) return false;
  return email.toLowerCase() === PROTECTED_ADMIN_EMAIL.toLowerCase();
}
