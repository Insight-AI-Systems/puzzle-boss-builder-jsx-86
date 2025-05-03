
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// CORS headers for browser requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Xero OAuth configuration
const XERO_CLIENT_ID = Deno.env.get("XERO_CLIENT_ID") || "E9A32798D8EB477995DEEC32917F3C12";
const XERO_CLIENT_SECRET = Deno.env.get("XERO_CLIENT_SECRET") || "xjG9CiByuoLkJCflCYWAvCEab5WGMoutaLWhroOJvy_OIM3v";
const DEFAULT_REDIRECT_URI = "https://thepuzzleboss.com/admin-dashboard?tab=finance";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const XERO_AUTH_URL = "https://login.xero.com/identity/connect/authorize";
const XERO_TOKEN_URL = "https://identity.xero.com/connect/token";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    console.log("[XERO AUTH] Function called with method:", req.method);
    
    // Create Supabase client with service role key
    const supabaseAdmin = createClient(
      SUPABASE_URL!,
      SUPABASE_SERVICE_ROLE_KEY!
    );

    // Check required environment variables
    if (!XERO_CLIENT_ID || !XERO_CLIENT_SECRET) {
      console.error("[XERO AUTH] Missing required Xero OAuth configuration");
      throw new Error("Missing required Xero OAuth configuration");
    }

    // Parse request body for custom redirect URL if provided
    let requestBody = {};
    let redirectUri = DEFAULT_REDIRECT_URI;
    
    if (req.method === "POST" && req.body) {
      try {
        requestBody = await req.json();
        if (requestBody && requestBody.redirectUrl) {
          redirectUri = requestBody.redirectUrl;
          console.log("[XERO AUTH] Using custom redirect URL:", redirectUri);
          
          // Ensure the redirect URL includes protocol
          if (!redirectUri.startsWith('http')) {
            redirectUri = `https://${redirectUri}`;
            console.log("[XERO AUTH] Fixed redirect URL:", redirectUri);
          }
        }
      } catch (e) {
        // No valid JSON body or no redirect URL specified, use default
        console.log("[XERO AUTH] No valid request body or redirectUrl, using default");
      }
    }

    // Handle different actions based on URL parameters
    const url = new URL(req.url);
    const action = url.searchParams.get("action");

    console.log("[XERO AUTH] Action requested:", action);

    switch (action) {
      case "authorize":
        // Generate state parameter for security
        const state = crypto.randomUUID();
        
        // Store state and redirect URI in DB for verification during callback
        await supabaseAdmin
          .from("xero_integration_settings")
          .upsert([
            { 
              setting_key: "oauth_state", 
              setting_value: state,
              updated_at: new Date().toISOString()
            },
            {
              setting_key: "oauth_redirect_uri",
              setting_value: redirectUri,
              updated_at: new Date().toISOString()
            }
          ]);

        // Construct the authorization URL
        const authUrl = new URL(XERO_AUTH_URL);
        authUrl.searchParams.append("response_type", "code");
        authUrl.searchParams.append("client_id", XERO_CLIENT_ID);
        authUrl.searchParams.append("redirect_uri", redirectUri);
        authUrl.searchParams.append("scope", "offline_access accounting.transactions accounting.contacts");
        authUrl.searchParams.append("state", state);
        
        console.log("[XERO AUTH] Generated auth URL with redirect URI:", redirectUri);
        
        return new Response(
          JSON.stringify({ url: authUrl.toString() }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
          }
        );

      case "status":
        // Check if we have active tokens
        const { data: tokens, error: tokenError } = await supabaseAdmin
          .from("xero_oauth_tokens")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(1);
        
        if (tokenError) {
          throw new Error(`Error checking token status: ${tokenError.message}`);
        }
        
        const connected = tokens && tokens.length > 0 && new Date(tokens[0].expires_at) > new Date();
        
        return new Response(
          JSON.stringify({ 
            connected,
            expiresAt: tokens && tokens.length > 0 ? tokens[0].expires_at : null,
            tenantId: tokens && tokens.length > 0 ? tokens[0].tenant_id : null
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
          }
        );

      default:
        return new Response(
          JSON.stringify({ error: "Invalid action" }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
          }
        );
    }
  } catch (error) {
    console.error("Xero auth error:", error);
    
    return new Response(
      JSON.stringify({ error: error.message || "Unknown error occurred" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
