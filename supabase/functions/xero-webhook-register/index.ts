
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// CORS headers for browser requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Xero API configuration
const XERO_CLIENT_ID = Deno.env.get("XERO_CLIENT_ID");
const XERO_CLIENT_SECRET = Deno.env.get("XERO_CLIENT_SECRET");
const XERO_WEBHOOK_KEY = Deno.env.get("XERO_WEBHOOK_KEY");
const WEBHOOK_BASE_URL = Deno.env.get("WEBHOOK_BASE_URL") || "https://vcacfysfjgoahledqdwa.supabase.co/functions/v1/xero-webhook";

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
    // Create Supabase client
    const supabaseAdmin = createClient(
      SUPABASE_URL!,
      SUPABASE_SERVICE_ROLE_KEY!
    );
    
    // Get active token for Xero API call
    const { data: tokens, error: tokenError } = await supabaseAdmin
      .from("xero_oauth_tokens")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1);
    
    if (tokenError) {
      throw new Error(`Error fetching token: ${tokenError.message}`);
    }
    
    if (!tokens || tokens.length === 0) {
      throw new Error("No Xero tokens found");
    }
    
    const accessToken = tokens[0].access_token;
    const tenantId = tokens[0].tenant_id;
    
    // Parse request body
    const { eventType } = await req.json();
    
    // Support for multiple event types
    const eventTypes = Array.isArray(eventType) ? eventType : [eventType];
    const results = [];
    
    // Register each webhook
    for (const event of eventTypes) {
      // Register the webhook with Xero
      const response = await fetch("https://api.xero.com/api.xro/2.0/webhooks", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Xero-Tenant-Id": tenantId,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          Url: WEBHOOK_BASE_URL,
          Key: XERO_WEBHOOK_KEY,
          EventTypes: [event]
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Xero API error: ${response.status} ${errorText}`);
      }
      
      const webhookData = await response.json();
      
      // Store the webhook registration in database
      const { data: webhookRecord, error: webhookError } = await supabaseAdmin
        .from("integration_webhooks")
        .insert({
          provider: "xero",
          type: event,
          url: WEBHOOK_BASE_URL,
          is_active: true
        })
        .select()
        .single();
      
      if (webhookError) {
        throw new Error(`Error storing webhook registration: ${webhookError.message}`);
      }
      
      results.push({
        event,
        webhook_id: webhookRecord.id,
        xero_webhook_id: webhookData.WebhookId
      });
    }
    
    return new Response(
      JSON.stringify({ 
        success: true,
        message: `Successfully registered ${results.length} webhook(s)`,
        webhooks: results
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200
      }
    );
    
  } catch (error) {
    console.error("Xero webhook registration error:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || "Unknown error occurred during webhook registration" 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      }
    );
  }
});
