
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { setCookie } from "https://deno.land/std@0.168.0/http/cookie.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get Supabase client with admin privileges
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Parse request body
    const body = await req.json();
    const { action, token, userId } = body;
    
    // Verify authentication except for validation which uses the cookies
    if (action !== "validateCsrfToken") {
      const authHeader = req.headers.get("Authorization");
      if (!authHeader) {
        return new Response(
          JSON.stringify({ error: "No authorization header provided" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
  
      const jwtToken = authHeader.replace("Bearer ", "");
      const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(jwtToken);
      
      if (userError || !user) {
        return new Response(
          JSON.stringify({ error: "Unauthorized - invalid token" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }
    
    // Create response headers for setting cookies
    const headers = new Headers(corsHeaders);
    headers.append("Content-Type", "application/json");
    
    if (action === "setCsrfCookie") {
      if (!token) {
        return new Response(
          JSON.stringify({ error: "Token is required" }),
          { status: 400, headers }
        );
      }

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
    } 
    else if (action === "validateCsrfToken") {
      // Extract CSRF token from cookies
      const cookieHeader = req.headers.get("Cookie") || "";
      const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split('=');
        if (key && value) acc[key] = value;
        return acc;
      }, {} as Record<string, string>);
      
      // Get the HTTP-only cookie token
      const storedToken = cookies[COOKIE_CONFIG.csrf.httpOnly.name];
      
      // Validate token from request against stored token
      const valid = storedToken && token && storedToken === token;
      
      return new Response(
        JSON.stringify({ valid }),
        { headers }
      );
    }
    else if (action === "setSessionState") {
      if (!userId) {
        return new Response(
          JSON.stringify({ error: "User ID is required" }),
          { status: 400, headers }
        );
      }

      // Generate session state with last activity time
      const sessionState = {
        userId,
        lastActive: new Date().toISOString()
      };
      
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
    else {
      return new Response(
        JSON.stringify({ error: "Invalid action" }),
        { status: 400, headers }
      );
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
