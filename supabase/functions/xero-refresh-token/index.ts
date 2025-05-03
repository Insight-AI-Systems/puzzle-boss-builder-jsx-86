
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
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

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
    console.log("[XERO REFRESH] Function called");
    
    // Check authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ 
          code: 401,
          message: "Missing authorization header" 
        }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
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
      throw new Error(`Error getting token: ${tokenError.message}`);
    }
    
    if (!tokens || tokens.length === 0) {
      throw new Error("No tokens found to refresh");
    }
    
    const token = tokens[0];
    const tenantId = token.tenant_id;
    
    // Check if token needs refresh (< 60 minutes until expiry)
    const expiryDate = new Date(token.expires_at);
    const now = new Date();
    const minutesUntilExpiry = (expiryDate.getTime() - now.getTime()) / (1000 * 60);
    
    if (minutesUntilExpiry > 60) {
      return new Response(
        JSON.stringify({
          message: "Token does not need refreshing yet",
          expiresIn: Math.round(minutesUntilExpiry)
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }
    
    console.log("[XERO REFRESH] Refreshing token that expires in", Math.round(minutesUntilExpiry), "minutes");
    
    // Exchange refresh token for new access token
    const response = await fetch(XERO_TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Basic ${btoa(`${XERO_CLIENT_ID}:${XERO_CLIENT_SECRET}`)}`
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: token.refresh_token
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("[XERO REFRESH] Token refresh failed:", errorText);
      throw new Error(`Failed to refresh token: ${errorText}`);
    }
    
    const newTokenData = await response.json();
    
    // Calculate new expiry time
    const newExpiresAt = new Date();
    newExpiresAt.setSeconds(newExpiresAt.getSeconds() + newTokenData.expires_in);
    
    // Store new tokens
    await supabaseAdmin.from("xero_oauth_tokens").upsert({
      tenant_id: tenantId,
      access_token: newTokenData.access_token,
      refresh_token: newTokenData.refresh_token,
      token_type: newTokenData.token_type,
      expires_at: newExpiresAt.toISOString(),
      scope: newTokenData.scope,
      updated_at: new Date().toISOString()
    }, {
      onConflict: "tenant_id"
    });
    
    console.log("[XERO REFRESH] Token refreshed successfully");
    
    return new Response(
      JSON.stringify({
        message: "Token refreshed successfully",
        expiresAt: newExpiresAt.toISOString()
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
    
  } catch (error) {
    console.error("[XERO REFRESH] Error:", error);
    
    return new Response(
      JSON.stringify({ error: error.message || "Unknown error occurred" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
