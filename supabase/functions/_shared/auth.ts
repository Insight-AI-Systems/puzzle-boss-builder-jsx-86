
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { EdgeFunctionLogger } from "./logging.ts";
import { errorResponse, HttpStatus } from "./response.ts";
import { getSupabaseConfig } from "./config.ts";

// Initialize logger
const logger = new EdgeFunctionLogger("auth-utils");

export interface AuthResult {
  user: { id: string; email?: string } | null;
  error: Response | null;
}

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
    if (user.email === 'alan@insight-ai-systems.com') {
      logger.info("Protected admin authenticated");
    } else {
      logger.info("User authenticated successfully", { userId: user.id });
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
