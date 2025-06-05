
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
    const { email, role = "super_admin" } = await req.json();
    
    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate role - now only super_admin is valid for this endpoint
    if (role !== "super_admin") {
      return new Response(
        JSON.stringify({ error: "Invalid role. Must be 'super_admin'" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Update to use the correct protected admin email
    const isProtectedAdmin = email === 'alantbooth@xtra.co.nz';
    console.log(`Processing request for email: ${email}, isProtectedAdmin: ${isProtectedAdmin}`);

    // Use the Admin Auth API correctly
    const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (listError) {
      console.error("Error listing users:", listError);
      return new Response(
        JSON.stringify({ error: "Failed to list users" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userData = users.find(user => user.email === email);
    
    if (!userData) {
      console.error("User not found for email:", email);
      
      // Special case for protected admin - create user if needed
      if (isProtectedAdmin) {
        console.log(`Protected admin user not found. This isn't an error for the protected admin.`);
        
        // Create a placeholder profile for the protected admin
        const randomUuid = crypto.randomUUID();
        
        const { error: profileError } = await supabaseAdmin
          .from("profiles")
          .insert({
            id: randomUuid,
            role: "super_admin",
            email: email,
            username: "Alan (Admin)",
          });
          
        if (profileError) {
          console.error("Error creating profile for protected admin:", profileError);
          return new Response(
            JSON.stringify({ error: "Failed to create protected admin profile" }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        
        console.log("Created placeholder profile for protected admin");
        
        return new Response(
          JSON.stringify({ 
            success: true,
            message: "Protected admin will be granted super_admin role on sign up",
            placeholderCreated: true,
            placeholderId: randomUuid
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      // For non-protected users, return error
      return new Response(
        JSON.stringify({ error: "User not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userId = userData.id;
    console.log(`Found user with ID ${userId} for email ${email}`);
    
    // Check if profile exists
    const { data: existingProfile, error: profileCheckError } = await supabaseAdmin
      .from("profiles")
      .select("id, role")
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
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          user_id: userId, 
          role,
          message: "Profile created with admin role"
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } else {
      // Profile exists, update the role
      console.log(`Updating role for existing profile (${userId}) from ${existingProfile.role} to ${role}`);
      
      const { error: updateError } = await supabaseAdmin
        .from("profiles")
        .update({ role })
        .eq("id", userId);

      if (updateError) {
        console.error("Error updating role:", updateError);
        return new Response(
          JSON.stringify({ error: "Failed to update user role" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      console.log(`Successfully updated role of ${email} to ${role}`);
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          user_id: userId, 
          role,
          message: "Profile role updated successfully"
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "An unexpected error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
