
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-user-email',
};

// Admin emails - centralized for consistency and security
const ADMIN_EMAILS = [
  'alan@insight-ai-systems.com',
  'alantbooth@xtra.co.nz',
  'rob.small.1234@gmail.com',
  'benbooth@xtra.co.nz',
  'tamara@insight-ai-systems.com',
  '0sunnysideup0@gmail.com'
];

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Processing admin-update-roles request');
    
    // Create a Supabase client with the Admin API key
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    // Get user email from header (sent by Clerk frontend)
    const userEmail = req.headers.get("x-user-email");
    if (!userEmail) {
      console.error('No user email provided in headers');
      return new Response(
        JSON.stringify({ error: "No user email provided" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log('User email from header:', userEmail);

    // Check if user is admin by email
    const isAdminUser = ADMIN_EMAILS.includes(userEmail);
    
    if (!isAdminUser) {
      console.error("Access denied - not an admin user:", userEmail);
      return new Response(
        JSON.stringify({ error: "Unauthorized - admin access required" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log('Admin access granted for email:', userEmail);

    // Parse request body
    const { userIds, newRole } = await req.json();
    
    if (!userIds || !Array.isArray(userIds) || !newRole) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: userIds (array) and newRole" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Updating role to ${newRole} for ${userIds.length} users`);

    // Update roles for all specified users
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .update({ 
        role: newRole,
        updated_at: new Date().toISOString()
      })
      .in("id", userIds)
      .select();

    if (error) {
      console.error("Error updating roles:", error);
      return new Response(
        JSON.stringify({ error: "Failed to update user roles", details: error.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Successfully updated ${data?.length || 0} user roles`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Updated ${data?.length || 0} user roles to ${newRole}`,
        updated_users: data
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Unexpected error in admin-update-roles:", error);
    return new Response(
      JSON.stringify({ 
        error: "Internal server error", 
        message: error.message 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
