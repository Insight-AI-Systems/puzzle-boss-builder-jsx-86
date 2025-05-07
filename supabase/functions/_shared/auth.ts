
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { getSupabaseConfig } from "./config.ts";
import { EdgeFunctionLogger } from "./logging.ts";
import { errorResponse, HttpStatus } from "./response.ts";

// Initialize logger
const logger = new EdgeFunctionLogger("auth-utils");

/**
 * Verify user authentication from JWT token in request
 */
export async function verifyAuth(req: Request) {
  try {
    const config = getSupabaseConfig();
    const authHeader = req.headers.get('Authorization');
    
    if (!authHeader) {
      return { 
        user: null, 
        error: errorResponse(
          "Missing authorization header", 
          "unauthorized",
          HttpStatus.UNAUTHORIZED
        )
      };
    }
    
    const supabase = createClient(config.url, config.anonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Get user from token
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      logger.error("Invalid token", { error });
      return { 
        user: null, 
        error: errorResponse(
          "Invalid token", 
          "unauthorized",
          HttpStatus.UNAUTHORIZED
        )
      };
    }

    return { user, error: null };
  } catch (error) {
    logger.error("Error in verifyAuth", { error });
    return { 
      user: null, 
      error: errorResponse(
        `Authentication error: ${error.message}`,
        "auth_error",
        HttpStatus.UNAUTHORIZED
      )
    };
  }
}
