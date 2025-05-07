
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { setCookie } from "https://deno.land/std@0.168.0/http/cookie.ts";
import { handleCorsOptions } from "../_shared/cors.ts";
import { successResponse, errorResponse, HttpStatus } from "../_shared/response.ts";
import { validateRequiredFields } from "../_shared/validation.ts";
import { verifyAuth } from "../_shared/auth.ts";
import { getSupabaseConfig } from "../_shared/config.ts";
import { EdgeFunctionLogger } from "../_shared/logging.ts";

// Initialize logger
const logger = new EdgeFunctionLogger("security-cookies");

// Cookie configuration
const COOKIE_CONFIG = {
  csrf: {
    httpOnly: {
      name: "csrf_token",
      maxAge: 86400,
      sameSite: "strict",
      secure: true,
      httpOnly: true,
      path: "/"
    },
    visible: {
      name: "csrf_token_visible",
      maxAge: 86400,
      sameSite: "strict",
      secure: true,
      httpOnly: false, // Client can read this one
      path: "/"
    }
  },
  session: {
    name: "session_state",
    maxAge: 3600,
    sameSite: "lax",
    secure: true,
    httpOnly: true,
    path: "/"
  }
};

// Action handlers
const actionHandlers = {
  async setCsrfCookie(req: Request, token: string): Promise<Response> {
    // Validate token
    if (!token) {
      return errorResponse("Token is required", "validation_error", HttpStatus.BAD_REQUEST);
    }
    
    logger.info("Setting CSRF cookie");
    
    // Create response headers with cookies
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    
    // Set HTTP-only cookie with CSRF token
    setCookie(headers, {
      name: COOKIE_CONFIG.csrf.httpOnly.name,
      value: token,
      maxAge: COOKIE_CONFIG.csrf.httpOnly.maxAge,
      sameSite: COOKIE_CONFIG.csrf.httpOnly.sameSite,
      secure: COOKIE_CONFIG.csrf.httpOnly.secure,
      httpOnly: COOKIE_CONFIG.csrf.httpOnly.httpOnly,
      path: COOKIE_CONFIG.csrf.httpOnly.path
    });
    
    // Set readable cookie with same token (for JS access)
    setCookie(headers, {
      name: COOKIE_CONFIG.csrf.visible.name,
      value: token,
      maxAge: COOKIE_CONFIG.csrf.visible.maxAge,
      sameSite: COOKIE_CONFIG.csrf.visible.sameSite,
      secure: COOKIE_CONFIG.csrf.visible.secure,
      httpOnly: COOKIE_CONFIG.csrf.visible.httpOnly,
      path: COOKIE_CONFIG.csrf.visible.path
    });
    
    return new Response(
      JSON.stringify({ success: true }),
      { headers }
    );
  },
  
  validateCsrfToken(req: Request, token: string): Response {
    // Extract CSRF token from cookies
    const cookieHeader = req.headers.get("Cookie") || "";
    const cookies = parseCookies(cookieHeader);
    
    // Get the HTTP-only cookie token
    const storedToken = cookies[COOKIE_CONFIG.csrf.httpOnly.name];
    
    // Validate token from request against stored token
    const valid = storedToken && token && storedToken === token;
    
    logger.info("Validating CSRF token", { valid });
    
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    
    return new Response(
      JSON.stringify({ valid }),
      { headers }
    );
  },
  
  async setSessionState(req: Request, userId: string): Promise<Response> {
    // Validate userId
    if (!userId) {
      return errorResponse("User ID is required", "validation_error", HttpStatus.BAD_REQUEST);
    }
    
    logger.info("Setting session state", { userId });

    // Generate session state with last activity time
    const sessionState = {
      userId,
      lastActive: new Date().toISOString()
    };
    
    // Create response headers with cookies
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    
    // Set session state cookie
    setCookie(headers, {
      name: COOKIE_CONFIG.session.name,
      value: JSON.stringify(sessionState),
      maxAge: COOKIE_CONFIG.session.maxAge,
      sameSite: COOKIE_CONFIG.session.sameSite,
      secure: COOKIE_CONFIG.session.secure,
      httpOnly: COOKIE_CONFIG.session.httpOnly,
      path: COOKIE_CONFIG.session.path
    });
    
    return new Response(
      JSON.stringify({ success: true }),
      { headers }
    );
  }
};

// Helper function to parse cookies
function parseCookies(cookieHeader: string): Record<string, string> {
  return cookieHeader.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    if (key && value) acc[key] = value;
    return acc;
  }, {} as Record<string, string>);
}

serve(async (req) => {
  // Handle CORS preflight requests
  const corsResponse = handleCorsOptions(req);
  if (corsResponse) return corsResponse;

  try {
    // Get request body
    const { action, token, userId } = await req.json();
    
    // Verify authentication except for validateCsrfToken which uses the cookies
    if (action !== "validateCsrfToken") {
      const { user, error } = await verifyAuth(req);
      if (error) return error;
      if (!user) {
        return errorResponse("Authentication required", "unauthorized", HttpStatus.UNAUTHORIZED);
      }
    }
    
    // Execute the requested action
    switch (action) {
      case "setCsrfCookie":
        return await actionHandlers.setCsrfCookie(req, token);
        
      case "validateCsrfToken":
        return actionHandlers.validateCsrfToken(req, token);
        
      case "setSessionState":
        return await actionHandlers.setSessionState(req, userId);
        
      default:
        logger.warn("Invalid action requested", { action });
        return errorResponse("Invalid action", "invalid_action", HttpStatus.BAD_REQUEST);
    }
  } catch (error) {
    logger.error("Unexpected error", { error });
    return errorResponse(
      "An unexpected error occurred", 
      "server_error", 
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
});
