
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// CORS headers for requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    // Get the request body
    const body = await req.json();
    console.log("Received webhook data from Xero:", JSON.stringify(body).substring(0, 200) + "...");

    // Create Supabase client using environment variables
    const supabaseClient = createClient(
      // Supabase API URL - env var set by default for all edge functions
      Deno.env.get("SUPABASE_URL")!,
      // Supabase API SERVICE ROLE KEY - env var set by default for all edge functions
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Determine the data type from the request
    const dataType = body.data_type || "unknown";
    
    // Process different data types
    switch (dataType) {
      case "invoice":
        await processInvoiceData(supabaseClient, body);
        break;
      case "bill":
        await processBillData(supabaseClient, body);
        break;
      case "transaction":
        await processTransactionData(supabaseClient, body);
        break;
      default:
        console.log(`Unknown data type: ${dataType}`);
        // Store the raw data for later processing
        await storeRawWebhookData(supabaseClient, body);
    }

    // Return success
    return new Response(
      JSON.stringify({ success: true, message: "Webhook processed successfully" }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error processing webhook:", error);
    
    // Return error
    return new Response(
      JSON.stringify({ success: false, message: error.message || "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

// Process invoice data from Xero
async function processInvoiceData(supabaseClient, data) {
  console.log("Processing invoice data");
  
  // Store the processed invoice data
  const { error } = await supabaseClient
    .from("xero_invoices")
    .upsert({
      xero_id: data.invoice_id || data.id,
      invoice_number: data.invoice_number,
      date: data.date || new Date().toISOString(),
      due_date: data.due_date,
      status: data.status,
      total: data.total,
      contact_name: data.contact_name,
      raw_data: data,
      last_synced: new Date().toISOString()
    }, {
      onConflict: "xero_id"
    });

  if (error) {
    console.error("Error storing invoice data:", error);
    throw error;
  }
}

// Process bill data from Xero
async function processBillData(supabaseClient, data) {
  console.log("Processing bill data");
  
  // Store the processed bill data
  const { error } = await supabaseClient
    .from("xero_bills")
    .upsert({
      xero_id: data.bill_id || data.id,
      bill_number: data.bill_number,
      date: data.date || new Date().toISOString(),
      due_date: data.due_date,
      status: data.status,
      total: data.total,
      vendor_name: data.vendor_name || data.contact_name,
      raw_data: data,
      last_synced: new Date().toISOString()
    }, {
      onConflict: "xero_id"
    });

  if (error) {
    console.error("Error storing bill data:", error);
    throw error;
  }
}

// Process transaction data from Xero
async function processTransactionData(supabaseClient, data) {
  console.log("Processing transaction data");
  
  // Store the processed transaction data
  const { error } = await supabaseClient
    .from("xero_transactions")
    .upsert({
      xero_id: data.transaction_id || data.id,
      date: data.date || new Date().toISOString(),
      description: data.description || data.reference,
      amount: data.amount,
      type: data.type || "UNKNOWN",
      account_code: data.account_code,
      contact_name: data.contact_name,
      raw_data: data,
      last_synced: new Date().toISOString()
    }, {
      onConflict: "xero_id"
    });

  if (error) {
    console.error("Error storing transaction data:", error);
    throw error;
  }
}

// Store raw webhook data for debugging or later processing
async function storeRawWebhookData(supabaseClient, data) {
  console.log("Storing raw webhook data");
  
  const { error } = await supabaseClient
    .from("webhook_logs")
    .insert({
      provider: "xero",
      event_type: data.event_type || "unknown",
      raw_data: data,
      processed: false
    });

  if (error) {
    console.error("Error storing raw webhook data:", error);
    throw error;
  }
}
