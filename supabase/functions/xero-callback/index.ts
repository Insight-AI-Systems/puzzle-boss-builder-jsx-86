
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
const FRONTEND_URL = Deno.env.get("FRONTEND_URL") || "https://thepuzzleboss.com";
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
    console.log("[XERO CALLBACK] Function called");

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
    
    console.log("[XERO CALLBACK] Received parameters:", { code: code?.slice(0, 5) + "...", state: state?.slice(0, 5) + "...", error });
    
    // Check for error in callback
    if (error) {
      throw new Error(`OAuth error: ${error}`);
    }
    
    // Validate required parameters
    if (!code || !state) {
      throw new Error("Missing required OAuth callback parameters");
    }

    // Check if we have required credentials
    if (!XERO_CLIENT_ID || !XERO_CLIENT_SECRET) {
      throw new Error("Missing required Xero OAuth configuration");
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

    // Retrieve the stored redirect URI
    const { data: redirectUriData, error: redirectUriError } = await supabaseAdmin
      .from("xero_integration_settings")
      .select("setting_value")
      .eq("setting_key", "oauth_redirect_uri")
      .single();

    if (redirectUriError || !redirectUriData) {
      console.warn("[XERO CALLBACK] Failed to retrieve redirect URI from settings, using default");
    }

    // Use the stored redirect URI if available, otherwise use default
    const redirectUri = redirectUriData?.setting_value || DEFAULT_REDIRECT_URI;
    
    console.log("[XERO CALLBACK] Using redirect URI for token exchange:", redirectUri);

    console.log("[XERO CALLBACK] State validated, exchanging code for token");
    
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
        redirect_uri: redirectUri
      })
    });
    
    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error("[XERO CALLBACK] Token exchange failed:", errorText);
      throw new Error(`Failed to exchange code for token: ${errorText}`);
    }
    
    const tokenData = await tokenResponse.json();
    console.log("[XERO CALLBACK] Successfully received token");
    
    // Get Xero tenant connections
    const connectionsResponse = await fetch(XERO_CONNECTIONS_URL, {
      headers: {
        "Authorization": `${tokenData.token_type} ${tokenData.access_token}`,
        "Content-Type": "application/json"
      }
    });
    
    if (!connectionsResponse.ok) {
      const errorText = await connectionsResponse.text();
      console.error("[XERO CALLBACK] Failed to retrieve connections:", errorText);
      throw new Error("Failed to retrieve Xero connections");
    }
    
    const connections = await connectionsResponse.json();
    
    if (!connections || connections.length === 0) {
      throw new Error("No Xero organizations connected");
    }
    
    // Use the first tenant/organization
    const tenantId = connections[0].tenantId;
    console.log("[XERO CALLBACK] Retrieved tenant ID:", tenantId);
    
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
    
    console.log("[XERO CALLBACK] Tokens stored, redirecting back to frontend");
    
    // Extract the base URL from the redirect URI for the final redirect
    let redirectBackUrl;
    try {
      const parsedUrl = new URL(redirectUri);
      // Use the origin and pathname from the original redirect URI
      redirectBackUrl = new URL(parsedUrl.pathname, parsedUrl.origin);
      // Add tab=finance query parameter if not already present
      if (!redirectBackUrl.searchParams.has("tab")) {
        redirectBackUrl.searchParams.append("tab", "finance");
      }
      redirectBackUrl.searchParams.append("xero_connected", "true");
    } catch (e) {
      console.warn("[XERO CALLBACK] Failed to parse redirect URI, using default frontend URL");
      redirectBackUrl = new URL(FRONTEND_URL);
      redirectBackUrl.pathname = "/admin-dashboard";
      redirectBackUrl.searchParams.append("tab", "finance");
      redirectBackUrl.searchParams.append("xero_connected", "true");
    }
    
    console.log("[XERO CALLBACK] Redirecting to:", redirectBackUrl.toString());
    
    return new Response(null, {
      status: 302,
      headers: {
        ...corsHeaders,
        "Location": redirectBackUrl.toString()
      }
    });
  } catch (error) {
    console.error("Xero callback error:", error);
    
    // Redirect back to frontend with error parameter
    const redirectUrl = new URL(FRONTEND_URL);
    redirectUrl.pathname = "/admin-dashboard";
    redirectUrl.searchParams.append("tab", "finance");
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
