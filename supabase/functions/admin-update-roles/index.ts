
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    // Extract auth token from request
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      console.error('No authorization header provided');
      return new Response(
        JSON.stringify({ error: "No authorization header provided" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get JWT token and verify user
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
    
    if (userError || !user) {
      console.error("Auth error:", userError);
      return new Response(
        JSON.stringify({ error: "Unauthorized - invalid token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log('User authenticated:', user.email);

    // Check if user is super_admin or protected admin
    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const isProtectedAdmin = user.email === 'alantbooth@xtra.co.nz';
    const isSuperAdmin = profile?.role === 'super_admin';
    
    if (!isProtectedAdmin && !isSuperAdmin) {
      console.error("Access denied - not a super admin");
      return new Response(
        JSON.stringify({ error: "Unauthorized - super admin access required" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

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
      .update({ role: newRole })
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
