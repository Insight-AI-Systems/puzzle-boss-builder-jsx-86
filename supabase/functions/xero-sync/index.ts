
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// CORS headers for browser requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Supabase configuration
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const SUPABASE_FUNCTION_URL = Deno.env.get("SUPABASE_FUNCTION_URL") || 
  `https://vcacfysfjgoahledqdwa.supabase.co/functions/v1`;

async function refreshToken(supabaseAdmin) {
  try {
    const refreshResponse = await fetch(`${SUPABASE_FUNCTION_URL}/xero-refresh-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" }
    });

    if (!refreshResponse.ok) {
      const error = await refreshResponse.text();
      throw new Error(`Token refresh failed: ${error}`);
    }

    const refreshResult = await refreshResponse.json();
    return refreshResult;
  } catch (error) {
    console.error("Error refreshing token:", error);
    throw error;
  }
}

async function getActiveToken(supabaseAdmin) {
  // First try to refresh the token
  await refreshToken(supabaseAdmin);
  
  // Then get the latest token
  const { data: tokens, error } = await supabaseAdmin
    .from("xero_oauth_tokens")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1);
  
  if (error) {
    throw new Error(`Error fetching token: ${error.message}`);
  }
  
  if (!tokens || tokens.length === 0) {
    throw new Error("No Xero tokens found");
  }
  
  return tokens[0];
}

async function syncInvoices(supabaseAdmin, accessToken, tenantId, days = 30) {
  try {
    // Calculate date range
    const today = new Date();
    const pastDate = new Date();
    pastDate.setDate(today.getDate() - days);
    
    // Format dates for Xero API (YYYY-MM-DD)
    const fromDate = pastDate.toISOString().split("T")[0];
    const toDate = today.toISOString().split("T")[0];
    
    // Call Xero API to get invoices
    const response = await fetch(
      `https://api.xero.com/api.xro/2.0/Invoices?where=Date>=DateTime(${fromDate})%20AND%20Date<=DateTime(${toDate})`,
      {
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Accept": "application/json",
          "Xero-Tenant-Id": tenantId
        }
      }
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Xero API error: ${response.status} ${errorText}`);
    }
    
    const data = await response.json();
    
    if (!data.Invoices) {
      return { count: 0 };
    }
    
    // Process and store each invoice
    let processedCount = 0;
    
    for (const invoice of data.Invoices) {
      await supabaseAdmin.from("xero_invoices").upsert({
        xero_id: invoice.InvoiceID,
        invoice_number: invoice.InvoiceNumber || `INV-${invoice.InvoiceID.substr(0, 8)}`,
        date: invoice.Date,
        due_date: invoice.DueDate,
        status: invoice.Status,
        total: invoice.Total,
        contact_name: invoice.Contact?.Name,
        raw_data: invoice,
        last_synced: new Date().toISOString()
      }, {
        onConflict: "xero_id"
      });
      
      processedCount++;
      
      // Log sync activity
      await supabaseAdmin.from("sync_logs").insert({
        integration: "xero",
        direction: "inbound",
        record_type: "invoice",
        record_id: invoice.InvoiceID,
        status: "success"
      });
    }
    
    return { count: processedCount };
  } catch (error) {
    console.error("Error syncing invoices:", error);
    
    // Log sync error
    await supabaseAdmin.from("sync_logs").insert({
      integration: "xero",
      direction: "inbound",
      record_type: "invoices",
      record_id: "batch",
      status: "failed",
      error_message: error.message
    });
    
    throw error;
  }
}

async function syncBills(supabaseAdmin, accessToken, tenantId, days = 30) {
  try {
    // Calculate date range
    const today = new Date();
    const pastDate = new Date();
    pastDate.setDate(today.getDate() - days);
    
    // Format dates for Xero API (YYYY-MM-DD)
    const fromDate = pastDate.toISOString().split("T")[0];
    const toDate = today.toISOString().split("T")[0];
    
    // Call Xero API to get bills (purchase invoices)
    const response = await fetch(
      `https://api.xero.com/api.xro/2.0/Invoices?where=Type=="ACCPAY" AND Date>=DateTime(${fromDate})%20AND%20Date<=DateTime(${toDate})`,
      {
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Accept": "application/json",
          "Xero-Tenant-Id": tenantId
        }
      }
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Xero API error: ${response.status} ${errorText}`);
    }
    
    const data = await response.json();
    
    if (!data.Invoices) {
      return { count: 0 };
    }
    
    // Process and store each bill
    let processedCount = 0;
    
    for (const bill of data.Invoices) {
      await supabaseAdmin.from("xero_bills").upsert({
        xero_id: bill.InvoiceID,
        bill_number: bill.InvoiceNumber || `BILL-${bill.InvoiceID.substr(0, 8)}`,
        date: bill.Date,
        due_date: bill.DueDate,
        status: bill.Status,
        total: bill.Total,
        vendor_name: bill.Contact?.Name,
        raw_data: bill,
        last_synced: new Date().toISOString()
      }, {
        onConflict: "xero_id"
      });
      
      processedCount++;
      
      // Log sync activity
      await supabaseAdmin.from("sync_logs").insert({
        integration: "xero",
        direction: "inbound",
        record_type: "bill",
        record_id: bill.InvoiceID,
        status: "success"
      });
    }
    
    return { count: processedCount };
  } catch (error) {
    console.error("Error syncing bills:", error);
    
    // Log sync error
    await supabaseAdmin.from("sync_logs").insert({
      integration: "xero",
      direction: "inbound",
      record_type: "bills",
      record_id: "batch",
      status: "failed",
      error_message: error.message
    });
    
    throw error;
  }
}

async function syncContacts(supabaseAdmin, accessToken, tenantId) {
  try {
    // Call Xero API to get contacts
    const response = await fetch(
      "https://api.xero.com/api.xro/2.0/Contacts",
      {
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Accept": "application/json",
          "Xero-Tenant-Id": tenantId
        }
      }
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Xero API error: ${response.status} ${errorText}`);
    }
    
    const data = await response.json();
    
    if (!data.Contacts) {
      return { count: 0 };
    }
    
    // Process and store each contact
    let processedCount = 0;
    
    for (const contact of data.Contacts) {
      await supabaseAdmin.from("xero_contacts").upsert({
        xero_id: contact.ContactID,
        name: contact.Name,
        email: contact.EmailAddress,
        phone: contact.Phones?.[0]?.PhoneNumber,
        status: contact.ContactStatus,
        is_customer: contact.IsCustomer,
        is_supplier: contact.IsSupplier,
        raw_data: contact,
        last_synced: new Date().toISOString()
      }, {
        onConflict: "xero_id"
      });
      
      processedCount++;
    }
    
    // Log sync activity
    await supabaseAdmin.from("sync_logs").insert({
      integration: "xero",
      direction: "inbound",
      record_type: "contacts",
      record_id: "batch",
      status: "success"
    });
    
    return { count: processedCount };
  } catch (error) {
    console.error("Error syncing contacts:", error);
    
    // Log sync error
    await supabaseAdmin.from("sync_logs").insert({
      integration: "xero",
      direction: "inbound",
      record_type: "contacts",
      record_id: "batch",
      status: "failed",
      error_message: error.message
    });
    
    throw error;
  }
}

async function syncTransactions(supabaseAdmin, accessToken, tenantId, days = 30) {
  try {
    // Calculate date range
    const today = new Date();
    const pastDate = new Date();
    pastDate.setDate(today.getDate() - days);
    
    // Format dates for Xero API (YYYY-MM-DD)
    const fromDate = pastDate.toISOString().split("T")[0];
    const toDate = today.toISOString().split("T")[0];
    
    // Call Xero API to get bank transactions
    const response = await fetch(
      `https://api.xero.com/api.xro/2.0/BankTransactions?where=Date>=DateTime(${fromDate})%20AND%20Date<=DateTime(${toDate})`,
      {
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Accept": "application/json",
          "Xero-Tenant-Id": tenantId
        }
      }
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Xero API error: ${response.status} ${errorText}`);
    }
    
    const data = await response.json();
    
    if (!data.BankTransactions) {
      return { count: 0 };
    }
    
    // Process and store each transaction
    let processedCount = 0;
    
    for (const transaction of data.BankTransactions) {
      await supabaseAdmin.from("xero_transactions").upsert({
        xero_id: transaction.BankTransactionID,
        date: transaction.Date,
        description: transaction.Reference || transaction.Type,
        amount: transaction.Total,
        type: transaction.Type,
        account_code: transaction.BankAccount?.Code,
        contact_name: transaction.Contact?.Name,
        raw_data: transaction,
        last_synced: new Date().toISOString()
      }, {
        onConflict: "xero_id"
      });
      
      processedCount++;
    }
    
    // Log sync activity
    await supabaseAdmin.from("sync_logs").insert({
      integration: "xero",
      direction: "inbound",
      record_type: "transactions",
      record_id: "batch",
      status: "success"
    });
    
    return { count: processedCount };
  } catch (error) {
    console.error("Error syncing transactions:", error);
    
    // Log sync error
    await supabaseAdmin.from("sync_logs").insert({
      integration: "xero",
      direction: "inbound",
      record_type: "transactions",
      record_id: "batch",
      status: "failed",
      error_message: error.message
    });
    
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

    // Parse request body
    const { recordType, days } = await req.json();
    
    // Get active token
    const token = await getActiveToken(supabaseAdmin);
    
    // Default response
    let result = { message: "No sync action performed" };
    
    // Perform sync based on record type
    switch (recordType) {
      case "invoices":
        result = await syncInvoices(supabaseAdmin, token.access_token, token.tenant_id, days);
        break;
        
      case "bills":
        result = await syncBills(supabaseAdmin, token.access_token, token.tenant_id, days);
        break;
        
      case "contacts":
        result = await syncContacts(supabaseAdmin, token.access_token, token.tenant_id);
        break;
        
      case "transactions":
        result = await syncTransactions(supabaseAdmin, token.access_token, token.tenant_id, days);
        break;
        
      case "all":
        const invoiceResult = await syncInvoices(supabaseAdmin, token.access_token, token.tenant_id, days);
        const billResult = await syncBills(supabaseAdmin, token.access_token, token.tenant_id, days);
        const contactResult = await syncContacts(supabaseAdmin, token.access_token, token.tenant_id);
        const transactionResult = await syncTransactions(supabaseAdmin, token.access_token, token.tenant_id, days);
        
        result = {
          invoices: invoiceResult.count,
          bills: billResult.count,
          contacts: contactResult.count,
          transactions: transactionResult.count
        };
        break;
        
      default:
        result = { error: "Invalid record type specified" };
    }
    
    return new Response(
      JSON.stringify(result),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200
      }
    );
  } catch (error) {
    console.error("Xero sync error:", error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || "Unknown error occurred during sync" 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      }
    );
  }
});
