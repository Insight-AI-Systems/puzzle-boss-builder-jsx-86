
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
    const { webhookId } = await req.json();
    
    // Get webhook details to retrieve Xero webhook ID
    const { data: webhookData, error: webhookError } = await supabaseAdmin
      .from("integration_webhooks")
      .select("*")
      .eq("id", webhookId)
      .single();
    
    if (webhookError) {
      throw new Error(`Error retrieving webhook: ${webhookError.message}`);
    }
    
    if (!webhookData) {
      throw new Error("Webhook not found");
    }
    
    // Delete webhook in Xero
    // Note: For this example, we assume there's a field in the DB that stores the Xero webhook ID
    // In a real implementation, you'd need to store the Xero webhook ID when it's created
    const xeroWebhookId = webhookData.metadata?.xero_id;
    
    if (xeroWebhookId) {
      const response = await fetch(`https://api.xero.com/api.xro/2.0/webhooks/${xeroWebhookId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Xero-Tenant-Id": tenantId
        }
      });
      
      if (!response.ok && response.status !== 404) {
        // It's okay if it returns 404 (already deleted in Xero)
        const errorText = await response.text();
        throw new Error(`Xero API error: ${response.status} ${errorText}`);
      }
    }
    
    // Update the webhook status in database
    await supabaseAdmin
      .from("integration_webhooks")
      .update({ is_active: false })
      .eq("id", webhookId);
    
    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Webhook deleted successfully"
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200
      }
    );
    
  } catch (error) {
    console.error("Xero webhook deletion error:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || "Unknown error occurred deleting webhook" 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      }
    );
  }
});
