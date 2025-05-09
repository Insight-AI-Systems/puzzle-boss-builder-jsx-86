
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { corsHeaders } from "../_shared/cors.ts";

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

    // Check if user is admin or super_admin
    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError || !profile || !["admin", "super_admin", "cfo"].includes(profile.role)) {
      console.error("Permissions error:", profileError || "Not an admin");
      return new Response(
        JSON.stringify({ error: "Unauthorized - not an admin" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch all users from auth.users
    const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (authError) {
      console.error("Error fetching auth users:", authError);
      return new Response(
        JSON.stringify({ error: "Error fetching users" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build a safe select query that only includes columns we know exist
    // This avoids the "column profiles.gender does not exist" error
    const selectQuery = "id, role, username, country, last_sign_in";
    
    // Fetch profiles with a safe query
    const { data: profiles, error: profilesError } = await supabaseAdmin
      .from("profiles")
      .select(selectQuery);
    
    if (profilesError) {
      console.error("Error fetching profiles:", profilesError);
      return new Response(
        JSON.stringify({ error: "Error fetching profiles", details: profilesError }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create a map of profiles by user id for easy lookup
    const profileMap = new Map();
    profiles?.forEach(profile => {
      profileMap.set(profile.id, profile);
    });

    // Combine auth users with their profiles
    const combinedUsers = authUsers.users.map(user => {
      const profile = profileMap.get(user.id) || {};
      
      // Prioritize profile's last_sign_in field but fall back to auth user's last_sign_in_at if needed
      const lastSignIn = profile.last_sign_in || user.last_sign_in_at || null;
      
      return {
        id: user.id,
        email: user.email,
        created_at: user.created_at,
        display_name: profile.username || user.email?.split('@')[0] || 'N/A',
        role: profile.role || 'player',
        country: profile.country || null,
        last_sign_in: lastSignIn
      };
    });

    console.log(`Returning ${combinedUsers.length} users`);

    return new Response(
      JSON.stringify(combinedUsers),
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
