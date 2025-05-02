
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
const FRONTEND_URL = Deno.env.get("FRONTEND_URL") || "http://localhost:5173";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

// Xero API endpoints
const XERO_TOKEN_URL = "https://identity.xero.com/connect/token";
const XERO_CONNECTIONS_URL = "https://api.xero.com/connections";

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

    // Get URL parameters
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const error = url.searchParams.get("error");
    
    // Check for error in callback
    if (error) {
      throw new Error(`OAuth error: ${error}`);
    }
    
    // Validate required parameters
    if (!code || !state) {
      throw new Error("Missing required OAuth callback parameters");
    }
    
    // Verify state parameter to prevent CSRF
    const { data: stateData } = await supabaseAdmin
      .from("xero_integration_settings")
      .select("setting_value")
      .eq("setting_key", "oauth_state")
      .single();
    
    if (!stateData || stateData.setting_value !== state) {
      throw new Error("Invalid state parameter");
    }
    
    // Exchange authorization code for tokens
    const tokenResponse = await fetch(XERO_TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Basic ${btoa(`${XERO_CLIENT_ID}:${XERO_CLIENT_SECRET}`)}`
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: XERO_REDIRECT_URI!
      })
    });
    
    if (!tokenResponse.ok) {
      const error = await tokenResponse.text();
      throw new Error(`Failed to exchange code for token: ${error}`);
    }
    
    const tokenData = await tokenResponse.json();
    
    // Get Xero tenant connections
    const connectionsResponse = await fetch(XERO_CONNECTIONS_URL, {
      headers: {
        "Authorization": `${tokenData.token_type} ${tokenData.access_token}`,
        "Content-Type": "application/json"
      }
    });
    
    if (!connectionsResponse.ok) {
      throw new Error("Failed to retrieve Xero connections");
    }
    
    const connections = await connectionsResponse.json();
    
    if (!connections || connections.length === 0) {
      throw new Error("No Xero organizations connected");
    }
    
    // Use the first tenant/organization
    const tenantId = connections[0].tenantId;
    
    // Calculate token expiry time
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + tokenData.expires_in);
    
    // Store tokens in database
    await supabaseAdmin.from("xero_oauth_tokens").upsert({
      tenant_id: tenantId,
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      token_type: tokenData.token_type,
      expires_at: expiresAt.toISOString(),
      scope: tokenData.scope,
      updated_at: new Date().toISOString()
    }, {
      onConflict: "tenant_id"
    });
    
    // Redirect back to frontend with success parameter
    const redirectUrl = new URL(`${FRONTEND_URL}/cfo-dashboard`);
    redirectUrl.searchParams.append("xero_connected", "true");
    
    return new Response(null, {
      status: 302,
      headers: {
        ...corsHeaders,
        "Location": redirectUrl.toString()
      }
    });
  } catch (error) {
    console.error("Xero callback error:", error);
    
    // Redirect back to frontend with error parameter
    const redirectUrl = new URL(`${FRONTEND_URL}/cfo-dashboard`);
    redirectUrl.searchParams.append("xero_error", encodeURIComponent(error.message || "Unknown error"));
    
    return new Response(null, {
      status: 302,
      headers: {
        ...corsHeaders,
        "Location": redirectUrl.toString()
      }
    });
  }
});
