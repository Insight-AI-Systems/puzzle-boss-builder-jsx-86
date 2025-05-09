
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the Admin API key for full access
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    // Extract auth token from request
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      console.error("No authorization header provided");
      return new Response(
        JSON.stringify({ error: "No authorization header provided" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get JWT token from header and verify user
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
    
    if (userError || !user) {
      console.error("Auth error:", userError);
      return new Response(
        JSON.stringify({ error: "Unauthorized - invalid token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Log user trying to perform action
    console.log(`User ${user.id} (${user.email}) attempting to update roles`);

    // Check if user is super_admin
    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      console.error("Profile error:", profileError);
      return new Response(
        JSON.stringify({ error: "Unauthorized - profile not found" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Special case for specific super admin email
    const isSpecificAdminEmail = user.email === "alan@insight-ai-systems.com";
    const isSuperAdmin = profile.role === "super_admin" || isSpecificAdminEmail;

    console.log(`User permissions check: isSuperAdmin=${isSuperAdmin}, isSpecificAdminEmail=${isSpecificAdminEmail}, role=${profile.role}, email=${user.email}`);

    if (!isSuperAdmin) {
      console.error("Permissions error: Not an admin");
      return new Response(
        JSON.stringify({ error: "Unauthorized - not a super_admin" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse the request body
    const { userIds, newRole } = await req.json();
    
    console.log(`Attempting to update roles: userIds=${JSON.stringify(userIds)}, newRole=${newRole}`);
    
    if (!userIds || !Array.isArray(userIds) || !newRole) {
      console.error("Invalid request body:", { userIds, newRole });
      return new Response(
        JSON.stringify({ error: "Invalid request body" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate the role before proceeding
    const validRoles = ["super_admin", "category_manager", "social_media_manager", "partner_manager", "cfo", "player"];
    if (!validRoles.includes(newRole)) {
      console.error("Invalid role specified:", newRole);
      return new Response(
        JSON.stringify({ error: "Invalid role specified" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Only super admins can assign super_admin role
    if (newRole === "super_admin" && !isSuperAdmin) {
      console.error("Permission denied: Only super_admin can assign super_admin role");
      return new Response(
        JSON.stringify({ error: "Permission denied: Only super_admin can assign super_admin role" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Update roles with upsert in case profiles don't exist yet
    const results = [];
    for (const userId of userIds) {
      // Special protection for protected admin - only the protected admin itself or super admins can change its role
      if (userId === "alan@insight-ai-systems.com" && !isSpecificAdminEmail && !isSuperAdmin) {
        console.error(`Cannot modify protected admin account. Requester: ${user.email}, isSpecificAdminEmail: ${isSpecificAdminEmail}, isSuperAdmin: ${isSuperAdmin}`);
        results.push({
          id: userId,
          success: false,
          error: "Cannot modify protected admin account",
          data: null
        });
        continue;
      }
      
      console.log(`Updating role for user ${userId} to ${newRole} by ${user.email} (${isSuperAdmin ? 'super_admin' : profile.role})`);
      
      try {
        const { data, error } = await supabaseAdmin
          .from("profiles")
          .upsert({
            id: userId,
            role: newRole,
          })
          .select("id, role");

        results.push({
          id: userId,
          success: !error,
          error: error ? error.message : null,
          data
        });

        if (error) {
          console.error(`Error updating role for user ${userId}:`, error);
        } else {
          console.log(`Successfully updated role for user ${userId} to ${newRole}`);
        }
      } catch (err) {
        console.error(`Exception updating role for user ${userId}:`, err);
        results.push({
          id: userId,
          success: false, 
          error: err.message || "Unknown error",
          data: null
        });
      }
    }

    return new Response(
      JSON.stringify({
        message: `Updated ${results.filter(r => r.success).length} users to role: ${newRole}`,
        results
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "An unexpected error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
