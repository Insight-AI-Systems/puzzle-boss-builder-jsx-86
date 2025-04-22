
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
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    // Extract email to set as admin
    const { email, role = "admin" } = await req.json();
    
    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate role
    if (role !== "admin" && role !== "super_admin") {
      return new Response(
        JSON.stringify({ error: "Invalid role. Must be 'admin' or 'super_admin'" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // First, get the user ID from auth.users
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserByEmail(email);
    
    if (userError || !userData?.user) {
      console.error("Error finding user:", userError);
      
      // Special case - create the user if they don't exist yet
      if (userError?.message?.includes("User not found") || !userData?.user) {
        console.log(`User with email ${email} not found. This user needs to sign up first.`);
        return new Response(
          JSON.stringify({ error: "User not found. This user needs to sign up first before they can be assigned a role." }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: userError?.message || "User not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userId = userData.user.id;
    console.log(`Found user with ID ${userId} for email ${email}`);
    
    // Check if profile exists
    const { data: existingProfile, error: profileCheckError } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("id", userId)
      .single();
      
    if (profileCheckError && profileCheckError.code !== "PGRST116") {
      console.error("Error checking if profile exists:", profileCheckError);
    }
    
    if (!existingProfile) {
      // Profile doesn't exist, need to create it
      console.log(`Profile doesn't exist for user ${userId}, creating it`);
      
      const { error: insertError } = await supabaseAdmin
        .from("profiles")
        .insert({
          id: userId,
          role: role,
          email: email,
          username: email.split('@')[0], // Default username from email
        });
        
      if (insertError) {
        console.error("Error creating profile:", insertError);
        return new Response(
          JSON.stringify({ error: "Failed to create user profile" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      console.log(`Successfully created profile and set role of ${email} to ${role}`);
    } else {
      // Profile exists, update the role
      const { data, error } = await supabaseAdmin
        .from("profiles")
        .update({ role })
        .eq("id", userId);

      if (error) {
        console.error("Error updating role:", error);
        return new Response(
          JSON.stringify({ error: "Failed to update user role" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      console.log(`Successfully updated role of ${email} to ${role}`);
    }

    return new Response(
      JSON.stringify({ success: true, user_id: userId, role }),
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
