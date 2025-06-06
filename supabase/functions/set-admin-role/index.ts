
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
    console.log('Processing set-admin-role request');
    
    // Create a Supabase client with the Admin API key
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    // Parse request body
    const { email, role } = await req.json();
    
    if (!email || !role) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: email and role" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Setting role ${role} for user: ${email}`);

    // Find the user by email in auth.users
    const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (authError) {
      console.error("Error fetching auth users:", authError);
      return new Response(
        JSON.stringify({ error: "Error fetching user data" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const targetUser = authUsers.users.find(user => user.email === email);
    
    if (!targetUser) {
      console.error(`User not found with email: ${email}`);
      return new Response(
        JSON.stringify({ error: `User not found with email: ${email}` }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Found user: ${targetUser.id}`);

    // Update or insert the user's profile with the new role
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .upsert({ 
        id: targetUser.id, 
        email: email,
        role: role,
        username: targetUser.user_metadata?.username || email.split('@')[0]
      })
      .select();

    if (error) {
      console.error("Error updating user role:", error);
      return new Response(
        JSON.stringify({ error: "Failed to update user role", details: error.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Successfully set role ${role} for user ${email}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Successfully set role ${role} for user ${email}`,
        user: data?.[0]
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Unexpected error in set-admin-role:", error);
    return new Response(
      JSON.stringify({ 
        error: "Internal server error", 
        message: error.message 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
