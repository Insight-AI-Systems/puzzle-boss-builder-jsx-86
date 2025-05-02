
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { createHmac } from "https://deno.land/std@0.168.0/crypto/mod.ts";

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Xero configuration
const XERO_WEBHOOK_KEY = Deno.env.get("XERO_WEBHOOK_KEY");

// Supabase configuration
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const SUPABASE_FUNCTION_URL = Deno.env.get("SUPABASE_FUNCTION_URL") ||
  `https://vcacfysfjgoahledqdwa.supabase.co/functions/v1`;

// Verify the webhook signature to ensure it's from Xero
async function verifySignature(body: string, signature: string): Promise<boolean> {
  if (!XERO_WEBHOOK_KEY) {
    console.error("XERO_WEBHOOK_KEY is not set");
    return false;
  }

  try {
    const hmac = createHmac("sha256", XERO_WEBHOOK_KEY);
    const computedSignature = await hmac.update(new TextEncoder().encode(body)).digest();
    const computedSignatureBase64 = btoa(String.fromCharCode(...new Uint8Array(computedSignature)));
    
    return computedSignatureBase64 === signature;
  } catch (error) {
    console.error("Error verifying signature:", error);
    return false;
  }
}

async function refreshXeroData(eventType: string, resourceId: string) {
  try {
    // Determine what to sync based on event type
    let recordType = "all";
    
    if (eventType.includes("Invoice")) {
      recordType = "invoices";
    } else if (eventType.includes("Bill") || eventType.includes("Purchase")) {
      recordType = "bills";
    } else if (eventType.includes("Contact")) {
      recordType = "contacts";
    } else if (eventType.includes("Transaction") || eventType.includes("Bank")) {
      recordType = "transactions";
    }
    
    // Call the sync function to update data
    const response = await fetch(`${SUPABASE_FUNCTION_URL}/xero-sync`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recordType,
        days: 30
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Sync failed: ${errorText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error syncing data after webhook event:", error);
    throw error;
  }
}

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
    
    // Get request body and signature
    const body = await req.text();
    const signature = req.headers.get("x-xero-signature");
    
    if (!signature) {
      throw new Error("No signature provided");
    }
    
    // Verify the webhook is from Xero
    const isValid = await verifySignature(body, signature);
    
    if (!isValid) {
      throw new Error("Invalid signature");
    }
    
    // Parse the webhook payload
    const payload = JSON.parse(body);
    
    // Log the webhook event
    const { data: logData, error: logError } = await supabaseAdmin
      .from("webhook_logs")
      .insert({
        provider: "xero",
        event_type: payload.events?.[0]?.eventType || "unknown",
        raw_data: payload,
        processed: false
      });
    
    if (logError) {
      console.error("Error logging webhook:", logError);
    }
    
    // Process each event
    if (payload.events && Array.isArray(payload.events)) {
      for (const event of payload.events) {
        const eventType = event.eventType;
        const resourceId = event.resourceId;
        
        console.log(`Processing Xero webhook: ${eventType} for resource ${resourceId}`);
        
        // Sync data based on the event type
        await refreshXeroData(eventType, resourceId);
        
        // Mark the webhook as processed
        if (logData) {
          await supabaseAdmin
            .from("webhook_logs")
            .update({ processed: true })
            .eq("id", logData[0].id);
        }
      }
    }
    
    return new Response(
      JSON.stringify({ success: true, message: "Webhook processed successfully" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200
      }
    );
    
  } catch (error) {
    console.error("Xero webhook error:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || "Unknown error occurred processing webhook" 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      }
    );
  }
});
