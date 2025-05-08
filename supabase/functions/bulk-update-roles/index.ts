
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.27.0";
import { EdgeFunctionLogger } from "../_shared/logging.ts";
import { handleCors, corsHeaders } from "../_shared/cors.ts";
import { verifyAdmin } from "../_shared/auth.ts";

// Logger for this function
const logger = new EdgeFunctionLogger("bulk-update-roles");

// Interface for the request body
interface BulkUpdateRolesRequest {
  userIds: string[];
  newRole: string;
}

// Process the request
async function processRequest(req: Request, supabase: SupabaseClient) {
  logger.info("Processing bulk role update request");

  try {
    // Parse request body
    const requestData: BulkUpdateRolesRequest = await req.json();
    const { userIds, newRole } = requestData;

    logger.info(`Attempting to update ${userIds.length} users to role ${newRole}`);

    // Validate input
    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return new Response(
        JSON.stringify({ success: false, message: "No user IDs provided" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    if (!newRole || typeof newRole !== "string") {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid role provided" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Limit the number of users that can be updated at once to prevent abuse
    const MAX_USERS = 100;
    if (userIds.length > MAX_USERS) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: `Too many users. Maximum ${MAX_USERS} allowed at once` 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Verify admin status
    const adminVerification = await verifyAdmin(supabase);
    if (!adminVerification.isAdmin) {
      logger.warn("Non-admin user attempted to update roles", { userId: adminVerification.userId });
      return new Response(
        JSON.stringify({ success: false, message: "Admin privileges required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 403 }
      );
    }

    // Update roles in batches to avoid timeout
    const BATCH_SIZE = 20;
    const results = [];
    const errors = [];

    for (let i = 0; i < userIds.length; i += BATCH_SIZE) {
      const batch = userIds.slice(i, i + BATCH_SIZE);
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .update({ role: newRole })
          .in('id', batch)
          .select('id');
        
        if (error) {
          logger.error(`Error updating batch ${i / BATCH_SIZE + 1}`, { error });
          errors.push(error);
        } else if (data) {
          results.push(...data);
        }
      } catch (err) {
        logger.error(`Exception in batch ${i / BATCH_SIZE + 1}`, { error: err });
        errors.push(err);
      }
    }

    // Check if all updates were successful
    if (errors.length > 0) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "Some role updates failed", 
          results,
          errors: errors.map(err => err.message || String(err))
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    logger.info(`Successfully updated ${results.length} users to role ${newRole}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Successfully updated ${results.length} users`, 
        count: results.length 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );

  } catch (error) {
    logger.error("Error processing request", { error });
    
    return new Response(
      JSON.stringify({ success: false, message: error.message || "Unknown error occurred" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
}

// Main function handler
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return handleCors(req);
  }

  // Only allow POST requests
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ success: false, message: "Method not allowed" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 405 }
    );
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
    );

    return await processRequest(req, supabaseClient);
    
  } catch (error) {
    console.error("Fatal error:", error);
    
    return new Response(
      JSON.stringify({ success: false, message: "Internal server error" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
