
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
    console.log('Processing get-all-users request');
    
    // Create a Supabase client with the Admin API key for full access
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

    // Get JWT token from header and verify user
    const token = authHeader.replace("Bearer ", "");
    console.log('Verifying user token...');
    
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
    
    if (userError || !user) {
      console.error("Auth error:", userError);
      return new Response(
        JSON.stringify({ error: "Unauthorized - invalid or expired token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log('User authenticated:', user.email);

    // Check if user is admin or super_admin
    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError) {
      console.error("Profile error:", profileError);
      return new Response(
        JSON.stringify({ error: "Error fetching user profile" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check for admin roles including the protected admin email
    const adminRoles = ["admin", "super_admin", "cfo", "category_manager", "social_media_manager", "partner_manager"];
    const isProtectedAdmin = user.email === 'alantbooth@xtra.co.nz';
    const hasAdminRole = profile && adminRoles.includes(profile.role);
    
    if (!isProtectedAdmin && !hasAdminRole) {
      console.error("Access denied - not an admin. User role:", profile?.role);
      return new Response(
        JSON.stringify({ error: "Unauthorized - admin access required" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log('Admin access granted. Fetching users...');

    // Fetch all users from auth.users
    const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (authError) {
      console.error("Error fetching auth users:", authError);
      return new Response(
        JSON.stringify({ error: "Error fetching users from auth system" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Retrieved ${authUsers.users.length} users from auth system`);

    // Fetch profiles with error handling for missing columns
    let profiles = [];
    try {
      const { data: profilesData, error: profilesError } = await supabaseAdmin
        .from("profiles")
        .select("id, role, username, email, country, last_sign_in, created_at, updated_at, gender, age_group, custom_gender");
      
      if (profilesError) {
        console.error("Error fetching profiles:", profilesError);
        // Fallback: try with minimal columns if the full query fails
        const { data: fallbackData, error: fallbackError } = await supabaseAdmin
          .from("profiles")
          .select("id, role, username, email, created_at, updated_at");
        
        if (fallbackError) {
          throw fallbackError;
        }
        profiles = fallbackData || [];
        console.log('Used fallback profile query due to column issues');
      } else {
        profiles = profilesData || [];
      }
    } catch (error) {
      console.error("Critical error fetching profiles:", error);
      return new Response(
        JSON.stringify({ error: "Error fetching user profiles", details: error.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Retrieved ${profiles.length} profiles from database`);

    // Create a map of profiles by user id for easy lookup
    const profileMap = new Map();
    profiles.forEach(profile => {
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
        display_name: profile.username || user.email?.split('@')[0] || 'Anonymous User',
        role: profile.role || 'player',
        country: profile.country || null,
        created_at: user.created_at,
        updated_at: profile.updated_at || user.updated_at || user.created_at,
        last_sign_in: lastSignIn,
        gender: profile.gender || null,
        custom_gender: profile.custom_gender || null,
        age_group: profile.age_group || null,
        categories_played: profile.categories_played || []
      };
    });

    console.log(`Returning ${combinedUsers.length} users successfully`);
    
    return new Response(
      JSON.stringify(combinedUsers),
      { 
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json" 
        } 
      }
    );

  } catch (error) {
    console.error("Unexpected error in get-all-users:", error);
    return new Response(
      JSON.stringify({ 
        error: "Internal server error", 
        message: error.message,
        stack: error.stack 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
