
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// CORS headers for browser requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Xero OAuth configuration
const XERO_CLIENT_ID = Deno.env.get("XERO_CLIENT_ID");
const XERO_CLIENT_SECRET = Deno.env.get("XERO_CLIENT_SECRET");
const XERO_REDIRECT_URI = Deno.env.get("XERO_REDIRECT_URI");
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
    // Create Supabase client with service role key
    const supabaseAdmin = createClient(
      SUPABASE_URL!,
      SUPABASE_SERVICE_ROLE_KEY!
    );

    // Check required environment variables
    if (!XERO_CLIENT_ID || !XERO_CLIENT_SECRET || !XERO_REDIRECT_URI) {
      throw new Error("Missing required Xero OAuth configuration");
    }

    // Handle different actions based on URL parameters
    const url = new URL(req.url);
    const action = url.searchParams.get("action");

    switch (action) {
      case "authorize":
        // Generate state parameter for security
        const state = crypto.randomUUID();
        
        // Store state in DB for verification during callback
        await supabaseAdmin
          .from("xero_integration_settings")
          .upsert({ 
            setting_key: "oauth_state", 
            setting_value: state,
            updated_at: new Date().toISOString()
          });

        // Construct the authorization URL
        const authUrl = new URL(XERO_AUTH_URL);
        authUrl.searchParams.append("response_type", "code");
        authUrl.searchParams.append("client_id", XERO_CLIENT_ID);
        authUrl.searchParams.append("redirect_uri", XERO_REDIRECT_URI);
        authUrl.searchParams.append("scope", "offline_access accounting.transactions accounting.contacts");
        authUrl.searchParams.append("state", state);
        
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
