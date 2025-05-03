
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Xero API configuration
const XERO_CLIENT_ID = Deno.env.get("XERO_CLIENT_ID") || "E9A32798D8EB477995DEEC32917F3C12";
const XERO_CLIENT_SECRET = Deno.env.get("XERO_CLIENT_SECRET");
const XERO_TOKEN_URL = "https://identity.xero.com/connect/token";

// Supabase configuration
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    console.log("[XERO REFRESH] Function called");

    // Check if we have required credentials
    if (!XERO_CLIENT_ID || !XERO_CLIENT_SECRET) {
      throw new Error("Missing required Xero OAuth configuration");
    }

    // Create Supabase client with service role key
    const supabaseAdmin = createClient(
      SUPABASE_URL!,
      SUPABASE_SERVICE_ROLE_KEY!
    );

    // Get the current token
    const { data: tokens, error: tokenError } = await supabaseAdmin
      .from("xero_oauth_tokens")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1);
    
    if (tokenError) {
      throw new Error(`Error retrieving tokens: ${tokenError.message}`);
    }
    
    if (!tokens || tokens.length === 0) {
      throw new Error("No Xero tokens found");
    }
    
    const currentToken = tokens[0];
    
    // Check if token is expired or will expire in the next 5 minutes
    const expiresAt = new Date(currentToken.expires_at);
    const now = new Date();
    const buffer = 5 * 60 * 1000; // 5 minutes in milliseconds
    
    // If token is still valid for more than the buffer period, return it
    if (expiresAt.getTime() > now.getTime() + buffer) {
      return new Response(
        JSON.stringify({ 
          message: "Token is still valid",
          expires_at: currentToken.expires_at,
          tenant_id: currentToken.tenant_id
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200
        }
      );
    }
    
    console.log("[XERO REFRESH] Token expired or about to expire, refreshing");
    
    // Token is expired or about to expire, refresh it
    const refreshResponse = await fetch(XERO_TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Basic ${btoa(`${XERO_CLIENT_ID}:${XERO_CLIENT_SECRET}`)}`
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: currentToken.refresh_token
      })
    });
    
    if (!refreshResponse.ok) {
      const errorText = await refreshResponse.text();
      throw new Error(`Failed to refresh token: ${errorText}`);
    }
    
    const refreshData = await refreshResponse.json();
    console.log("[XERO REFRESH] Successfully refreshed token");
    
    // Calculate new expiry time
    const newExpiresAt = new Date();
    newExpiresAt.setSeconds(newExpiresAt.getSeconds() + refreshData.expires_in);
    
    // Store new tokens
    await supabaseAdmin.from("xero_oauth_tokens").upsert({
      id: currentToken.id,
      tenant_id: currentToken.tenant_id,
      access_token: refreshData.access_token,
      refresh_token: refreshData.refresh_token,
      token_type: refreshData.token_type,
      expires_at: newExpiresAt.toISOString(),
      scope: refreshData.scope,
      updated_at: new Date().toISOString()
    });
    
    return new Response(
      JSON.stringify({ 
        message: "Token refreshed successfully",
        expires_at: newExpiresAt.toISOString(),
        tenant_id: currentToken.tenant_id
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200
      }
    );
    
  } catch (error) {
    console.error("Xero token refresh error:", error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || "Unknown error occurred during token refresh" 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      }
    );
  }
});
